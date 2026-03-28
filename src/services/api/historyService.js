import apiClient from './client'

export async function fetchHistory(params = {}) {
  const query = {
    page: params.page ?? 0,
    size: params.size ?? 20,
  }

  if (params.status && params.status !== 'ALL') query.status = params.status
  if (params.date) query.date = params.date
  if (typeof params.allUsers === 'boolean') query.allUsers = params.allUsers

  const { data } = await apiClient.get('/history', { params: query })
  return data
}

export async function fetchAdminHistory(params = {}) {
  return fetchHistory({ ...params, allUsers: true })
}

export async function fetchHistoryDetail(transactionId) {
  if (!transactionId) {
    throw new Error('transactionId is required')
  }
  const { data } = await apiClient.get(`/history/${transactionId}`)
  return data
}
