import fs from 'node:fs'
import path from 'node:path'

const MAX_REMEMBERED = 1000

// Persists the Gmail history checkpoint and IDs we already notified about.
export function createStore(file = path.join('data', 'state.json')) {
  return {
    load() {
      try {
        const s = JSON.parse(fs.readFileSync(file, 'utf8'))
        return { historyId: s.historyId ?? null, notified: Array.isArray(s.notified) ? s.notified : [] }
      } catch {
        return { historyId: null, notified: [] }
      }
    },
    save(state) {
      fs.mkdirSync(path.dirname(file), { recursive: true })
      const tmp = `${file}.tmp`
      fs.writeFileSync(tmp, JSON.stringify(state, null, 2))
      fs.renameSync(tmp, file)
    },
  }
}

export function rememberNotified(state, id) {
  state.notified.push(id)
  if (state.notified.length > MAX_REMEMBERED) state.notified.splice(0, state.notified.length - MAX_REMEMBERED)
}
