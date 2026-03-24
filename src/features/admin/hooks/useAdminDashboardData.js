import { useCallback, useEffect, useState } from 'react'
import { fetchAdminStatsFromAPI, fetchAdminDashboardData } from '../../../services/api/dashboardService'
import { getCachedRequest } from '../../../services/api/requestCache'

const ADMIN_DASHBOARD_TTL = 60_000

function useAdminDashboardData() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isForbidden, setIsForbidden] = useState(false)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setIsForbidden(false)

    try {
      // Try to fetch from the new API endpoint first
      let result
      try {
        result = await getCachedRequest(
          'dashboard:admin',
          fetchAdminStatsFromAPI,
          ADMIN_DASHBOARD_TTL,
        )
      } catch (apiError) {
        // Check if it's a permission error
        if (apiError?.response?.status === 403) {
          setIsForbidden(true)
          throw apiError
        }
        // Fallback to calculating from users and history
        console.warn('Admin stats API failed, falling back to history calculation:', apiError?.message)
        result = await getCachedRequest(
          'dashboard:admin',
          fetchAdminDashboardData,
          ADMIN_DASHBOARD_TTL,
        )
      }
      setData(result)
    } catch (reason) {
      if (reason?.response?.status === 403) {
        setIsForbidden(true)
      } else {
        setError(reason?.response?.data?.message ?? reason?.message ?? 'Unable to load admin dashboard.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    isLoading,
    error,
    isForbidden,
    refresh: load,
  }
}

export default useAdminDashboardData