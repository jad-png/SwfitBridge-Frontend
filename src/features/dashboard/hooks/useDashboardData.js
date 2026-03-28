import { Activity, ArrowUpRight, CheckCircle2, GitCompareArrows, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { fetchHistory } from '../../../services/api/historyService'
import { useAuth } from '../../auth/context/useAuth'

function useDashboardData() {
  const { user } = useAuth()
  const [data, setData] = useState({
    metrics: [],
    rows: [],
    queue: [],
    alerts: [],
    cta: { label: 'Launch conversion', icon: ArrowUpRight },
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchHistory({ size: 25, page: 0 })
      const rows = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : []

      const successCount = rows.filter((row) => String(row?.conversionStatus ?? '').toUpperCase() === 'SUCCESS').length
      const failedCount = rows.filter((row) => String(row?.conversionStatus ?? '').toUpperCase() === 'FAILED').length
      const successRate = rows.length > 0 ? Number(((successCount / rows.length) * 100).toFixed(1)) : 0
      const avgDuration = rows.length > 0
        ? Math.round(rows.reduce((total, row) => total + Number(row?.processingDurationMs ?? 0), 0) / rows.length)
        : 0

      const recentRows = rows.slice(0, 8).map((row) => ({
        id: row?.transactionId ?? '—',
        counterparty: row?.messageReference ?? row?.messageType ?? 'Unknown',
        amount: row?.messageType ?? '—',
        status: String(row?.conversionStatus ?? 'pending').toLowerCase(),
        time: row?.requestTimestamp ? new Date(row.requestTimestamp).toLocaleString() : '—',
      }))

      const queueItems = rows
        .filter((row) => String(row?.conversionStatus ?? '').toUpperCase() !== 'SUCCESS')
        .slice(0, 4)
        .map((row) => ({
          label: row?.transactionId ?? 'Unknown job',
          owner: row?.messageReference ?? user?.username ?? 'System',
          eta: row?.requestTimestamp ? new Date(row.requestTimestamp).toLocaleString() : 'Awaiting update',
          status: String(row?.conversionStatus ?? 'pending').toLowerCase(),
        }))

      const alerts = []
      if (failedCount > 0) {
        alerts.push({
          id: 'failed-jobs',
          tone: 'warning',
          icon: TriangleAlert,
          message: `${failedCount} conversion job(s) failed recently.`,
        })
      }

      alerts.push({
        id: 'throughput',
        tone: 'info',
        icon: Activity,
        message: `${rows.length} conversion request(s) processed in latest window.`,
      })

      setData({
        metrics: [
          {
            title: 'MT103 Generated',
            value: String(successCount),
            trend: `${rows.length} total requests`,
            icon: GitCompareArrows,
            tone: 'primary',
          },
          {
            title: 'Conversion SLA',
            value: `${successRate}%`,
            trend: `${failedCount} failed`,
            icon: CheckCircle2,
            tone: 'success',
          },
          {
            title: 'Avg Processing',
            value: `${avgDuration} ms`,
            trend: 'Recent API response window',
            icon: Activity,
            tone: 'info',
          },
        ],
        rows: recentRows,
        queue: queueItems,
        alerts,
        cta: { label: 'Launch conversion', icon: ArrowUpRight },
      })
    } catch (reason) {
      setError(reason?.response?.data?.message ?? reason?.message ?? 'Unable to load dashboard data.')
      setData({
        metrics: [],
        rows: [],
        queue: [],
        alerts: [],
        cta: { label: 'Launch conversion', icon: ArrowUpRight },
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.username])

  useEffect(() => {
    load()
  }, [load])

  return {
    ...data,
    isLoading,
    error,
    refresh: load,
  }
}

export default useDashboardData
