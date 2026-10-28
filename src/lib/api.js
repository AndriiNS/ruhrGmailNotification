import { getClient } from './supabase'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export class ApiError extends Error {
  constructor(code) {
    super(code)
    this.code = code
  }
}

// POST to the MailPing server with the signed-in user's access token. Throws ApiError(code).
export async function apiPost(path) {
  const { data } = await getClient().auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new ApiError('unauthorized')
  let res
  try {
    res = await fetch(`${API_URL}${path}`, { method: 'POST', headers: { authorization: `Bearer ${token}` } })
  } catch {
    throw new ApiError('network')
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(body.error || 'unknown')
  return body
}
