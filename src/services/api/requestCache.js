const requestCache = new Map()

export async function getCachedRequest(key, fetcher, ttlMs = 60_000) {
  const now = Date.now()
  const cached = requestCache.get(key)

  if (cached && cached.expiresAt > now) {
    return cached.value
  }

  const value = await fetcher()
  requestCache.set(key, {
    value,
    expiresAt: now + ttlMs,
  })

  return value
}

export function invalidateCachedRequest(key) {
  requestCache.delete(key)
}

export function clearRequestCache() {
  requestCache.clear()
}