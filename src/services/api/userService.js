import apiClient from './client'

function encodePathSegment(value) {
  return encodeURIComponent(String(value))
}

function isRetryableEndpointError(reason) {
  const status = reason?.response?.status
  return status === 404 || status === 405 || status === 500
}

async function putUserByPath(userId, payload, path) {
  const { data } = await apiClient.put(`${path}/${encodePathSegment(userId)}`, payload)
  return data
}

async function patchUserStatusByPath(userId, payload, path) {
  const { data } = await apiClient.patch(`${path}/${encodePathSegment(userId)}/status`, payload)
  return data
}

function normalizeUserRecord(user) {
  if (!user || typeof user !== 'object') {
    return user
  }

  const id = user.id ?? user.userId ?? null
  return {
    ...user,
    id,
    userId: user.userId ?? id,
  }
}

export async function fetchCurrentUser(auth) {
  const headers = {}

  if (auth?.token) {
    headers.Authorization = `${auth.tokenType || 'Bearer'} ${auth.token}`
  }

  const { data } = await apiClient.get('/v1/users/me', {
    headers,
  })
  return data
}

export function buildUserUpdatePayload(input, { canUpdateRole = false } = {}) {
  const payload = {}

  if (typeof input?.email === 'string') {
    payload.email = input.email.trim()
  }

  if (canUpdateRole && typeof input?.role === 'string') {
    payload.role = input.role.trim()
  }

  return payload
}

export async function updateUser(userId, payload) {
  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    return await putUserByPath(userId, payload, '/v1/users')
  } catch (reason) {
    if (!isRetryableEndpointError(reason)) {
      throw reason
    }

    return putUserByPath(userId, payload, '/users')
  }
}

export async function getAllUsers() {
  try {
    const { data } = await apiClient.get('/admin/users')
    if (Array.isArray(data)) {
      return data.map(normalizeUserRecord)
    }

    if (Array.isArray(data?.data)) {
      return {
        ...data,
        data: data.data.map(normalizeUserRecord),
      }
    }

    return data
  } catch (reason) {
    if (reason?.response?.status === 404) {
      const { data } = await apiClient.get('/v1/users')
      if (Array.isArray(data)) {
        return data.map(normalizeUserRecord)
      }

      if (Array.isArray(data?.data)) {
        return {
          ...data,
          data: data.data.map(normalizeUserRecord),
        }
      }

      return data
    }

    throw reason
  }
}

export async function deleteUser(userId) {
  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    const { data } = await apiClient.delete(`/v1/users/${encodePathSegment(userId)}`)
    return data
  } catch (reason) {
    if (!isRetryableEndpointError(reason)) {
      throw reason
    }

    const { data } = await apiClient.delete(`/users/${encodePathSegment(userId)}`)
    return data
  }
}

export async function toggleUserStatus(userId, status) {
  if (!userId) {
    throw new Error('userId is required')
  }

  const nextState = String(status ?? '').toUpperCase()
  const isActive = nextState !== 'BANNED'

  try {
    return await patchUserStatusByPath(userId, { status: nextState }, '/v1/users')
  } catch (reason) {
    if (!isRetryableEndpointError(reason)) {
      throw reason
    }

    const statusPayloads = [
      { status: nextState },
      { active: isActive },
      { enabled: isActive },
    ]

    for (const payload of statusPayloads) {
      try {
        return await patchUserStatusByPath(userId, payload, '/users')
      } catch (patchReason) {
        if (!isRetryableEndpointError(patchReason)) {
          throw patchReason
        }
      }
    }

    for (const payload of statusPayloads) {
      try {
        return await updateUser(userId, payload)
      } catch (updateReason) {
        if (!isRetryableEndpointError(updateReason)) {
          throw updateReason
        }
      }
    }

    throw reason
  }
}

export async function fetchUserStats() {
  const { data } = await apiClient.get('/users/stats')
  return data
}