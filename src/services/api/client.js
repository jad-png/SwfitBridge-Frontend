import axios from 'axios'
import { clearSessionStorage, readSessionStorage } from '../../utils/auth/sessionStorage'

export const AUTH_UNAUTHORIZED_EVENT = 'swiftbridge:auth-unauthorized'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function getStoredToken() {
  const session = readSessionStorage()
  return {
    token: session?.token ?? null,
    tokenType: session?.tokenType ?? 'Bearer',
  }
}

apiClient.interceptors.request.use(
  (config) => {
    const { token, tokenType } = getStoredToken()

    if (token) {
      config.headers.Authorization = `${tokenType || 'Bearer'} ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearSessionStorage()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT))
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
