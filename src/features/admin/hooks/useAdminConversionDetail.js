import { useCallback, useEffect, useState } from 'react'
import { fetchHistoryDetail } from '../../../services/api/historyService'

function useAdminConversionDetail(id) {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const load = useCallback(async () => {
        if (!id) return
        setIsLoading(true)
        setError(null)
        try {
            const result = await fetchHistoryDetail(id)
            setData(result)
        } catch (reason) {
            setError(reason?.response?.data?.message ?? reason.message ?? 'Unable to load conversion details.')
        } finally {
            setIsLoading(false)
        }
    }, [id])

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

export default useAdminConversionDetail
