import apiClient from './client'

export async function fetchHistory(params = {}) {
  const query = {}
  if (typeof params.limit === 'number') {
    query.limit = params.limit
  }
  if (typeof params.offset === 'number') {
    query.offset = params.offset
  }
  if (params.status && params.status !== 'ALL') {
    query.status = params.status
  }

  const { data } = await apiClient.get('/history', { params: query })
  return data
}

export async function fetchHistoryDetail(transactionId) {
  if (!transactionId) {
    throw new Error('transactionId is required')
  }

  const { data } = await apiClient.get(`/history/${transactionId}`)
  return data
}
