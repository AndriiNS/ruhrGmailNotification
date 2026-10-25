// Seam for the dashboard API. Today it returns demo data; later it will call the backend.
import { dashboardScenarios } from '../data/dashboard'

export async function getDashboard(scenario = 'active') {
  await new Promise((resolve) => setTimeout(resolve, 400))
  if (scenario === 'error') throw new Error('demo error')
  return structuredClone(dashboardScenarios[scenario] ?? dashboardScenarios.active)
}
