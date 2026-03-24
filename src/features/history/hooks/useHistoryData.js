import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchHistory } from '../../../services/api/historyService'

function formatTimestamp(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

function formatDuration(ms) {
  if (ms === null || ms === undefined) {
    return '—'
  }
  if (ms < 1000) {
    return `${ms} ms`
  }
  return `${(ms / 1000).toFixed(1)} s`
}

function useHistoryData(initialLimit = 20) {
  const [rawRows, setRawRows] = useState([])
  const [rows, setRows] = useState([])
  const [filters, setFilters] = useState({ query: '', status: 'ALL' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [limit] = useState(initialLimit)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(0)

  const filterRows = useCallback((data, query) => {
    if (!query) {
      return data
    }
    const keyword = query.trim().toLowerCase()
    return data.filter((row) => row.id.toLowerCase().includes(keyword) || row.reference.toLowerCase().includes(keyword))
  }, [])

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetchHistory({
        limit,
        offset: page * limit,
        status: filters.status,
      })

      const normalized = (response?.data ?? []).map((item) => ({
        id: item.transactionId,
        reference: item.messageReference ?? '—',
        messageType: item.messageType ?? '—',
        status: item.conversionStatus?.toLowerCase?.() ?? 'pending',
        created: formatTimestamp(item.requestTimestamp),
        duration: formatDuration(item.processingDurationMs),
      }))

      setRawRows(normalized)
      setTotal(response?.pagination?.total ?? normalized.length)
      setPages(response?.pagination?.pages ?? 1)
    } catch (reason) {
      setError(reason?.response?.data?.message ?? reason.message ?? 'Unable to load history.')
      setRawRows([])
    } finally {
      setIsLoading(false)
    }
  }, [filters.status, limit, page])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  useEffect(() => {
    setRows(filterRows(rawRows, filters.query))
  }, [filterRows, filters.query, rawRows])

  const pagination = useMemo(
    () => ({
      limit,
      total,
      pages,
      page,
      hasPrev: page > 0,
      hasNext: page + 1 < Math.max(pages, 1),
    }),
    [limit, page, pages, total],
  )

  const updateFilters = useCallback(
    (next) => {
      setFilters((prev) => ({ ...prev, ...next }))
      if (next.status && next.status !== filters.status) {
        setPage(0)
      }
    },
    [filters.status],
  )

  const goToPage = useCallback((nextPage) => {
    setPage((prev) => {
      if (nextPage < 0) return 0
      if (nextPage >= Math.max(pages, 1)) {
        return Math.max(pages - 1, 0)
      }
      if (Number.isNaN(nextPage)) {
        return prev
      }
      return nextPage
    })
  }, [pages])

  return {
    rows,
    isLoading,
    error,
    filters,
    updateFilters,
    pagination,
    goToPage,
    refresh: loadHistory,
  }
}

export default useHistoryData
