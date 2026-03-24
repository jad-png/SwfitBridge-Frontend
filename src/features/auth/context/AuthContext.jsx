import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { login as loginRequest, register as registerRequest } from '../../../services/api/authService'
import { AUTH_UNAUTHORIZED_EVENT } from '../../../services/api/client'
import { buildUserUpdatePayload, fetchCurrentUser, updateUser } from '../../../services/api/userService'
import { decodeJwtPayload, isTokenExpired } from '../../../utils/auth/jwt'
import { clearSessionStorage, readSessionStorage, writeSessionStorage, SESSION_STORAGE_KEY } from '../../../utils/auth/sessionStorage'
import { AuthContext } from './AuthContextInstance'

const DEFAULT_EXPIRES_IN_SECONDS = 86_400

const EMPTY_SESSION = {
  token: null,
  tokenType: 'Bearer',
  expiresIn: DEFAULT_EXPIRES_IN_SECONDS,
  user: null,
  expiresAt: null,
}

function normalizeExpiresIn(expiresIn) {
  const value = Number(expiresIn)
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_EXPIRES_IN_SECONDS
}

function createSession({ token, tokenType, expiresIn, user }) {
  const normalizedExpiresIn = normalizeExpiresIn(expiresIn)

  return {
    token,
    tokenType: tokenType || 'Bearer',
    expiresIn: normalizedExpiresIn,
    user: user ?? null,
    expiresAt: Date.now() + normalizedExpiresIn * 1000,
  }
}

function normalizeRoles(user) {
  if (Array.isArray(user?.roles)) {
    return user.roles
  }

  if (typeof user?.role === 'string' && user.role.trim()) {
    return [user.role]
  }

  return []
}

function normalizeRole(role) {
  return String(role ?? '').toUpperCase().replace(/^ROLE_/, '')
}

function hasRole(user, targetRole) {
  const normalizedTarget = normalizeRole(targetRole)
  return normalizeRoles(user).some((role) => normalizeRole(role) === normalizedTarget)
}

function isValidSession(session) {
  if (!session?.token || !session?.expiresAt) {
    return false
  }

  const expiredByTtl = session.expiresAt <= Date.now()
  if (expiredByTtl) {
    return false
  }

  return !isTokenExpired(session.token)
}

function loadSessionFromStorage() {
  const stored = readSessionStorage()
  if (!stored) {
    return EMPTY_SESSION
  }

  if (!isValidSession(stored)) {
    clearSessionStorage()
    return EMPTY_SESSION
  }

  return stored
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSessionFromStorage())
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingUser, setIsFetchingUser] = useState(false)
  const [error, setError] = useState(null)
  const userRequestRef = useRef(null)

  const clearError = useCallback(() => setError(null), [])

  const logout = useCallback(() => {
    setSession(EMPTY_SESSION)
    userRequestRef.current = null
    clearSessionStorage()
  }, [])

  useEffect(() => {
    if (!session.token) {
      clearSessionStorage()
      return
    }

    writeSessionStorage(session)
  }, [session])

  useEffect(() => {
    if (!session.token) {
      return undefined
    }

    const remaining = session.expiresAt - Date.now()
    if (remaining <= 0) {
      logout()
      return undefined
    }

    const timer = window.setTimeout(() => {
      logout()
    }, remaining)

    return () => window.clearTimeout(timer)
  }, [logout, session.expiresAt, session.token])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function handleUnauthorized() {
      logout()
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [logout])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    function handleStorage(event) {
      if (event.key === SESSION_STORAGE_KEY) {
        setSession(loadSessionFromStorage())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const extractErrorMessage = useCallback((reason, fallback) => {
    return reason?.response?.data?.message ?? reason?.message ?? fallback
  }, [])

  const handleAuthSuccess = useCallback((response) => {
    const token = response?.token ?? response?.accessToken
    if (!token) {
      throw new Error('Authentication token missing in response.')
    }

    const payload = decodeJwtPayload(token)
    const nextSession = createSession({
      token,
      tokenType: response?.tokenType ?? 'Bearer',
      expiresIn: response?.expiresIn,
      user: payload?.sub
        ? {
            username: payload.sub,
            role: payload.role ?? null,
            roles: Array.isArray(payload.roles) ? payload.roles : undefined,
          }
        : null,
    })

    writeSessionStorage(nextSession)
    setSession(nextSession)
    return nextSession
  }, [])

  const refreshCurrentUser = useCallback(
    async (tokenOverride) => {
      const activeToken = tokenOverride ?? session.token
      if (!activeToken) {
        return null
      }

      if (userRequestRef.current) {
        return userRequestRef.current
      }

      setIsFetchingUser(true)

      const request = fetchCurrentUser({
        token: activeToken,
        tokenType: session.tokenType,
      })
        .then((currentUser) => {
          setSession((previous) => {
            if (previous.token !== activeToken) {
              return previous
            }

            return { ...previous, user: currentUser }
          })
          return currentUser
        })
        .catch((reason) => {
          if (reason?.response?.status === 401) {
            logout()
            return null
          }

          const message = extractErrorMessage(reason, 'Unable to load current user profile.')
          setError(message)
          throw new Error(message)
        })
        .finally(() => {
          userRequestRef.current = null
          setIsFetchingUser(false)
        })

      userRequestRef.current = request
      return request
    },
    [extractErrorMessage, logout, session.token, session.tokenType],
  )

  useEffect(() => {
    if (!session.token || session.user) {
      return
    }

    refreshCurrentUser(session.token).catch(() => {
      /* surfaced through context error state */
    })
  }, [refreshCurrentUser, session.token, session.user])

  const updateCurrentUserProfile = useCallback(
    async (input) => {
      if (!session.user?.id) {
        throw new Error('Current user is not loaded yet.')
      }

      const canUpdateRole = hasRole(session.user, 'ADMIN')
      const payload = buildUserUpdatePayload(input, { canUpdateRole })

      if (!payload.email && !payload.role) {
        throw new Error('No valid profile fields to update.')
      }

      try {
        const updatedUser = await updateUser(session.user.id, payload)
        setSession((previous) => ({ ...previous, user: updatedUser }))
        setError(null)
        return updatedUser
      } catch (reason) {
        const message = extractErrorMessage(reason, 'Unable to update profile.')
        setError(message)
        throw new Error(message)
      }
    },
    [extractErrorMessage, session.user],
  )

  const login = useCallback(
    async (credentials) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await loginRequest(credentials)
        const nextSession = handleAuthSuccess(response)
        await refreshCurrentUser(nextSession.token)
        return nextSession
      } catch (reason) {
        const message = extractErrorMessage(reason, 'Unable to sign in. Please check your credentials.')
        setError(message)
        throw new Error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [extractErrorMessage, handleAuthSuccess, refreshCurrentUser],
  )

  const register = useCallback(
    async (payload) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await registerRequest(payload)
        return response
      } catch (reason) {
        const message = extractErrorMessage(reason, 'Unable to register. Please try again later.')
        setError(message)
        throw new Error(message)
      } finally {
        setIsLoading(false)
      }
    },
    [extractErrorMessage],
  )

  const value = useMemo(
    () => ({
      token: session.token,
      tokenType: session.tokenType,
      expiresIn: session.expiresIn,
      user: session.user,
      expiresAt: session.expiresAt,
      isAuthenticated: Boolean(session.token),
      isLoading,
      isFetchingUser,
      error,
      login,
      register,
      logout,
      refreshCurrentUser,
      updateCurrentUserProfile,
      clearError,
    }),
    [
      clearError,
      error,
      isFetchingUser,
      isLoading,
      login,
      logout,
      refreshCurrentUser,
      register,
      session.expiresAt,
      session.expiresIn,
      session.token,
      session.tokenType,
      session.user,
      updateCurrentUserProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
