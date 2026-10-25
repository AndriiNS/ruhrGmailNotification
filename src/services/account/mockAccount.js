// DEMO ONLY. Preferences live in memory; deleteAccount deletes nothing.
let preferences = { includeSubject: true }
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockAccount = {
  async getPreferences() {
    await delay(250)
    return { ...preferences }
  },
  async savePreferences(next) {
    await delay()
    preferences = { ...preferences, ...next }
    return { ...preferences }
  },
  async deleteAccount() {
    await delay(700)
  },
}
