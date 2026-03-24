export const SESSION_STORAGE_KEY = 'sb_session'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

export function readSessionStorage() {
  if (!isBrowser()) {
    return null
  }

  const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    return JSON.parse(raw)
  } catch {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }
}

export function writeSessionStorage(session) {
  if (!isBrowser()) {
    return
  }

  if (!session) {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearSessionStorage() {
  writeSessionStorage(null)
}
