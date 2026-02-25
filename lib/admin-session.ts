// Admin session management - persists authentication state
const ADMIN_SESSION_KEY = "admin-session-token"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function setAdminSession(): void {
  const sessionData = {
    timestamp: Date.now(),
    token: Math.random().toString(36).substring(2, 15),
  }
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData))
}

export function getAdminSession(): { isValid: boolean; isExpired: boolean } {
  if (typeof window === "undefined") {
    return { isValid: false, isExpired: false }
  }

  const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!sessionData) {
    return { isValid: false, isExpired: false }
  }

  try {
    const session = JSON.parse(sessionData)
    const age = Date.now() - session.timestamp
    const isExpired = age > SESSION_DURATION

    if (isExpired) {
      clearAdminSession()
      return { isValid: false, isExpired: true }
    }

    return { isValid: true, isExpired: false }
  } catch {
    clearAdminSession()
    return { isValid: false, isExpired: false }
  }
}

export function clearAdminSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }
}
