// Express middleware: accepts only requests with a valid Supabase access token and attaches req.user.
// The token is verified by Supabase Auth, so a forged or expired token is rejected.
export function requireUser(supabase) {
  return async (req, res, next) => {
    const header = req.get('authorization') || ''
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
    if (!token) return res.status(401).json({ error: 'unauthorized' })
    try {
      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data?.user) return res.status(401).json({ error: 'unauthorized' })
      req.user = { id: data.user.id, email: data.user.email, isAdmin: data.user.app_metadata?.is_admin === true }
      next()
    } catch {
      res.status(503).json({ error: 'auth_unavailable' })
    }
  }
}

// Use after requireUser for admin-only endpoints. is_admin lives in app_metadata, which users cannot edit.
export function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'forbidden' })
  next()
}
