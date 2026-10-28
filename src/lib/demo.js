// Decides whether screens use mock data. Rules:
// - No Supabase keys and VITE_DEMO_MODE not "false": always demo (offline UI development).
// - With Supabase keys: regular users never see demo data. An admin (app_metadata.is_admin, set only
//   server-side) can switch demo tools on or off; the choice is remembered in this browser.
import { DEMO_MODE, REAL_AUTH } from './config'

const KEY = 'mailping.demoTools'
let active = !REAL_AUTH && DEMO_MODE

const stored = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export const isDemoActive = () => active

// Called whenever the signed-in user changes.
export function syncDemoFor(user) {
  if (REAL_AUTH) active = Boolean(user?.isAdmin) && stored()
}

// Reloads the page so every screen starts again with the right data source.
export function toggleDemoTools() {
  try {
    localStorage.setItem(KEY, stored() ? '0' : '1')
  } catch {
    return
  }
  window.location.reload()
}

// Returns an object with the same methods as the mock and real services, choosing one per call.
export const pickService = (mock, real) =>
  new Proxy({}, { get: (_t, name) => (...args) => (isDemoActive() ? mock : real)[name]?.(...args) })
