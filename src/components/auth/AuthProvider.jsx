import { useCallback, useMemo, useState } from 'react'
import { AuthContext } from '../../hooks/authContext'
import { authService } from '../../services/auth'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getSession())

  const signIn = useCallback(async (email, password) => {
    const u = await authService.signIn(email, password)
    setUser(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    await authService.signOut()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      signIn,
      signOut,
      signUp: authService.signUp,
      requestPasswordReset: authService.requestPasswordReset,
      resendVerification: authService.resendVerification,
    }),
    [user, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
