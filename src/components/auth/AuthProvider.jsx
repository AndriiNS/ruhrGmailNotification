import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '../../hooks/authContext'
import { authService } from '../../services/auth'
import { isDemoActive, syncDemoFor } from '../../lib/demo'

export default function AuthProvider({ children }) {
  // user: undefined while the session is still loading (real auth), null when signed out.
  const [user, setUser] = useState(() => {
    const s = authService.getSession()
    return s instanceof Promise ? undefined : s
  })

  useEffect(() => {
    const s = authService.getSession()
    if (!(s instanceof Promise)) return
    let cancelled = false
    s.then((u) => !cancelled && setUser(u))
    const unsubscribe = authService.subscribe?.((u) => !cancelled && setUser(u))
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const u = await authService.signIn(email, password)
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  syncDemoFor(user) // idempotent: must happen before screens request data
  const demoActive = isDemoActive()

  const value = useMemo(
    () => ({
      user,
      isAdmin: Boolean(user?.isAdmin),
      demoActive,
      signIn,
      signOut,
      signUp: authService.signUp,
      requestPasswordReset: authService.requestPasswordReset,
      resendVerification: authService.resendVerification,
      updatePassword: authService.updatePassword,
    }),
    [user, demoActive, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
