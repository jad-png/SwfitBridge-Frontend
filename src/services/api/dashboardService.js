import apiClient from './client'
import { fetchHistory } from './historyService'
import { getAllUsers } from './userService'

function normalizeStatus(status) {
  return String(status ?? '').toLowerCase()
}

function extractHistoryRows(response) {
  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response)) {
    return response
  }

  return []
}

function toDayKey(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString().slice(0, 10)
}

function sortByDay(a, b) {
  return new Date(a.day).getTime() - new Date(b.day).getTime()
}

function buildTrendSeries(rows) {
  const map = new Map()

  rows.forEach((row) => {
    const day = toDayKey(row?.requestTimestamp ?? row?.createdAt ?? row?.created)
    if (!day) {
      return
    }

    const current = map.get(day) ?? { day, total: 0, success: 0 }
    current.total += 1

    const status = normalizeStatus(row?.conversionStatus ?? row?.status)
    if (status === 'success' || status === 'completed') {
      current.success += 1
    }

    map.set(day, current)
  })

  return Array.from(map.values())
    .sort(sortByDay)
    .map((item) => ({
      ...item,
      successRate: item.total > 0 ? Number(((item.success / item.total) * 100).toFixed(1)) : 0,
    }))
}

function pickUserRows(rows, user) {
  const userId = String(user?.id ?? '')
  const username = String(user?.username ?? '').toLowerCase()
  const email = String(user?.email ?? '').toLowerCase()

  const matches = rows.filter((row) => {
    const ownerId = String(row?.userId ?? row?.ownerId ?? row?.createdById ?? '')
    const ownerUsername = String(row?.username ?? row?.createdByUsername ?? row?.ownerUsername ?? '').toLowerCase()
    const ownerEmail = String(row?.email ?? row?.ownerEmail ?? row?.createdByEmail ?? '').toLowerCase()

    return (userId && ownerId && ownerId === userId)
      || (username && ownerUsername && ownerUsername === username)
      || (email && ownerEmail && ownerEmail === email)
  })

  if (matches.length > 0) {
    return matches
  }

  return []
}

export async function fetchUserOverviewData(user) {
  const response = await fetchHistory({ size: 100, page: 0 })
  const rows = extractHistoryRows(response)
  const personalRows = pickUserRows(rows, user)
  const successful = personalRows.filter((row) => {
    const status = normalizeStatus(row?.conversionStatus ?? row?.status)
    return status === 'success' || status === 'completed'
  }).length

  const trend = buildTrendSeries(personalRows)
  const recent = personalRows
    .slice()
    .sort((first, second) => {
      const firstTime = new Date(first?.requestTimestamp ?? first?.createdAt ?? 0).getTime()
      const secondTime = new Date(second?.requestTimestamp ?? second?.createdAt ?? 0).getTime()
      return secondTime - firstTime
    })
    .slice(0, 5)
    .map((row) => ({
      id: row?.transactionId ?? row?.id ?? '—',
      status: normalizeStatus(row?.conversionStatus ?? row?.status) || 'pending',
      createdAt: row?.requestTimestamp ?? row?.createdAt ?? null,
    }))

  return {
    totalConversions: personalRows.length,
    successfulConversions: successful,
    successRate: personalRows.length > 0 ? Number(((successful / personalRows.length) * 100).toFixed(1)) : 0,
    activityTrend: trend,
    recentActivity: recent,
  }
}

export async function fetchAdminDashboardData() {
  const usersResponse = await getAllUsers()

  const users = Array.isArray(usersResponse?.data)
    ? usersResponse.data
    : Array.isArray(usersResponse)
      ? usersResponse
      : []

  const analytics = usersResponse?.analytics
    ?? usersResponse?.stats
    ?? usersResponse?.metrics
    ?? {}
  const totalUsers = users.length
  const roleCountMap = users.reduce((accumulator, user) => {
    const role = String(user?.role ?? 'ROLE_USER')
    accumulator[role] = (accumulator[role] ?? 0) + 1
    return accumulator
  }, {})

  const roleDistribution = Object.entries(roleCountMap).map(([role, count]) => ({
    role,
    count,
    percentage: totalUsers > 0 ? Number(((count / totalUsers) * 100).toFixed(1)) : 0,
  }))

  const totalConversions = Number(analytics?.totalConversions ?? analytics?.conversionsTotal ?? 0)
  const totalSuccessfulConversions = Number(
    analytics?.totalSuccessfulConversions
    ?? analytics?.successfulConversions
    ?? analytics?.conversionsSuccessful
    ?? 0,
  )

  const totalGuests = users.filter((user) => {
    const role = String(user?.role ?? '').toUpperCase()
    return role.includes('GUEST') || Boolean(user?.isGuest)
  }).length

  const rawConversionVolume = Array.isArray(analytics?.conversionVolume)
    ? analytics.conversionVolume
    : []

  const conversionVolume = rawConversionVolume.map((item) => ({
    day: item.day ?? item.date ?? item.label ?? '—',
    total: Number(item.total ?? item.count ?? 0),
    success: Number(item.success ?? item.successful ?? 0),
    successRate: Number(item.successRate ?? 0),
  }))

  const derivedSuccessRate = totalConversions > 0
    ? Number(((totalSuccessfulConversions / totalConversions) * 100).toFixed(1))
    : 0

  const conversionSuccessRate = Number(analytics?.conversionSuccessRate ?? analytics?.successRate ?? derivedSuccessRate)

  const rawSuccessRateTrend = Array.isArray(analytics?.successRateTrend)
    ? analytics.successRateTrend
    : conversionVolume.map((row) => ({
      day: row.day,
      successRate: row.total > 0 ? Number(((row.success / row.total) * 100).toFixed(1)) : 0,
      total: row.total,
    }))

  const successRateTrend = rawSuccessRateTrend.map((item) => ({
    day: item.day ?? item.date ?? item.label ?? '—',
    successRate: Number(item.successRate ?? 0),
    total: Number(item.total ?? item.count ?? 0),
  }))

  return {
    metrics: {
      totalUsers,
      totalConversions,
      totalSuccessfulConversions,
      totalGuests,
      conversionSuccessRate,
    },
    roleDistribution,
    conversionVolume,
    successRateTrend,
  }
}


export async function fetchUserStatsFromAPI() {
  const { data } = await apiClient.get('/users/stats')
  return normalizeUserStats(data)
}


export async function fetchAdminStatsFromAPI() {
  const { data } = await apiClient.get('/admin/stats')
  return normalizeAdminStats(data)
}

function normalizeUserStats(data) {
  if (!data) {
    return {
      totalConversions: 0,
      successfulConversions: 0,
      failedConversions: 0,
      successRate: 0,
      recentActivity: [],
      activityTrend: [],
    }
  }

  const totalConversions = Number(data?.totalConversions ?? 0)
  const successfulConversions = Number(data?.successfulConversions ?? 0)
  const failedConversions = Number(data?.failedConversions ?? totalConversions - successfulConversions)
  const successRate = Number(data?.successRate ?? 0)

  const normalizedSuccessRate = successRate > 1 ? successRate : successRate * 100

  const recentActivity = Array.isArray(data?.recentActivity)
    ? data.recentActivity.map((activity) => ({
      id: activity?.id ?? activity?.transactionId ?? '—',
      status: String(activity?.status ?? 'pending').toLowerCase(),
      createdAt: activity?.createdAt ?? activity?.timestamp ?? null,
    }))
    : []

  const activityTrend = Array.isArray(data?.activityTrend)
    ? data.activityTrend.map((trend) => ({
      day: trend?.day ?? trend?.date ?? '—',
      total: Number(trend?.total ?? trend?.count ?? 0),
      success: Number(trend?.success ?? trend?.successful ?? 0),
      successRate: Number(trend?.successRate ?? 0),
    }))
    : []

  return {
    totalConversions,
    successfulConversions,
    failedConversions,
    successRate: Math.round(normalizedSuccessRate * 10) / 10,
    recentActivity,
    activityTrend,
  }
}

function normalizeAdminStats(data) {
  if (!data) {
    return {
      metrics: {
        totalUsers: 0,
        totalConversions: 0,
        totalSuccessfulConversions: 0,
        conversionSuccessRate: 0,
        totalGuests: 0,
      },
      conversionVolume: [],
      successRateTrend: [],
      roleDistribution: [],
    }
  }

  const metrics = {
    totalUsers: Number(data?.metrics?.totalUsers ?? 0),
    totalConversions: Number(data?.metrics?.totalConversions ?? 0),
    totalSuccessfulConversions: Number(data?.metrics?.totalSuccessfulConversions ?? 0),
    totalGuests: Number(data?.metrics?.totalGuests ?? 0),
    conversionSuccessRate: Number(data?.metrics?.conversionSuccessRate ?? 0),
  }

  const rate = metrics.conversionSuccessRate
  metrics.conversionSuccessRate = rate > 1 ? rate : rate * 100

  const rawConversionVolume = data?.charts?.conversionVolume ?? data?.conversionVolume
  const conversionVolume = Array.isArray(rawConversionVolume)
    ? rawConversionVolume.map((item) => ({
      day: item?.day ?? item?.date ?? '—',
      total: Number(item?.total ?? item?.count ?? 0),
      success: Number(item?.success ?? item?.successful ?? 0),
      successRate: Number(item?.successRate ?? 0),
    }))
    : []

  const rawSuccessRateTrend = data?.charts?.successRateTrend ?? data?.successRateTrend
  const successRateTrend = Array.isArray(rawSuccessRateTrend)
    ? rawSuccessRateTrend.map((item) => ({
      day: item?.day ?? item?.date ?? '—',
      successRate: Number(item?.successRate ?? 0),
      total: Number(item?.total ?? item?.count ?? 0),
    }))
    : []

  const roleDistribution = Array.isArray(data?.roleDistribution)
    ? data.roleDistribution
    : []

  return {
    metrics,
    conversionVolume,
    successRateTrend,
    roleDistribution,
  }
}