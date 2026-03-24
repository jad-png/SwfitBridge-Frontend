import { useCallback, useEffect, useState } from 'react'
import { fetchUserStatsFromAPI, fetchUserOverviewData } from '../../../services/api/dashboardService'
import { getCachedRequest } from '../../../services/api/requestCache'
import { useAuth } from '../../auth/context/useAuth'

const USER_OVERVIEW_TTL = 60_000

function useUserOverviewData() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    const key = `dashboard:user:${user?.id ?? user?.username ?? 'self'}`

    setIsLoading(true)
    setError(null)
    try {
      // Try to fetch from the new API endpoint first
      let result
      try {
        result = await getCachedRequest(
          key,
          fetchUserStatsFromAPI,
          USER_OVERVIEW_TTL,
        )
      } catch (apiError) {
        // Fallback to calculating from history data
        console.warn('User stats API failed, falling back to history calculation:', apiError?.message)
        result = await getCachedRequest(
          key,
          () => fetchUserOverviewData(user),
          USER_OVERVIEW_TTL,
        )
      }
      setData(result)
    } catch (reason) {
      setError(reason?.response?.data?.message ?? reason?.message ?? 'Unable to load overview data.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  return {
    data,
    isLoading,
    error,
    refresh: load,
  }
}

export default useUserOverviewData