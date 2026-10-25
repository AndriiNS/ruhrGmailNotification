import { sleep } from './util.js'

const BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

export class GmailError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function explain(status, body) {
  const reason = body?.error?.errors?.[0]?.reason || body?.error?.status || ''
  const msg = body?.error?.message || ''
  if (/accessNotConfigured|SERVICE_DISABLED/i.test(reason + msg))
    return 'Gmail API is not enabled in your Google Cloud project. Enable it in APIs & Services > Library.'
  if (/insufficient/i.test(reason + msg))
    return 'The granted Gmail permission is insufficient. Run: npm run gmail:auth and approve access.'
  return `Gmail API error ${status}${reason ? ` (${reason})` : ''}${msg ? `: ${msg}` : ''}`
}

export function createGmail(getAccessToken) {
  async function request(path, params = {}, attempt = 0, forceToken = false) {
    const url = new URL(`${BASE}${path}`)
    for (const [k, v] of Object.entries(params))
      for (const item of [].concat(v)) if (item !== undefined) url.searchParams.append(k, item)

    let res
    try {
      res = await fetch(url, { headers: { authorization: `Bearer ${await getAccessToken(forceToken)}` } })
    } catch (e) {
      if (e.name === 'AuthError') throw e
      if (attempt < 3) { await sleep(2 ** attempt * 1000); return request(path, params, attempt + 1) }
      throw new GmailError('Network error while contacting Gmail API.')
    }
    if (res.status === 401 && !forceToken) return request(path, params, attempt, true)
    const retryable = res.status === 429 || res.status >= 500
    if (retryable && attempt < 3) { await sleep(2 ** attempt * 1000); return request(path, params, attempt + 1) }
    const body = await res.json().catch(() => null)
    if (!res.ok) throw new GmailError(explain(res.status, body), res.status)
    return body
  }

  return {
    // Current mailbox checkpoint. Falls back if getProfile is not allowed for the scope.
    async getCurrentHistoryId() {
      try {
        return (await request('/profile', { fields: 'historyId' })).historyId
      } catch (e) {
        if (e.status !== 403) throw e
        const list = await request('/messages', { maxResults: 1, fields: 'messages/id' })
        const first = list.messages?.[0]?.id
        if (!first) throw new GmailError('Mailbox is empty; cannot determine a starting checkpoint.')
        return (await request(`/messages/${first}`, { format: 'minimal', fields: 'historyId' })).historyId
      }
    },

    listHistory({ startHistoryId, pageToken }) {
      return request('/history', {
        startHistoryId,
        historyTypes: 'messageAdded',
        labelId: 'INBOX',
        pageToken,
        fields: 'historyId,nextPageToken,history/messagesAdded/message/id',
      })
    },

    // Headers only. The `fields` mask excludes snippet and body parts.
    async getMetadata(id) {
      try {
        const m = await request(`/messages/${id}`, {
          format: 'metadata',
          metadataHeaders: ['From', 'Subject'],
          fields: 'id,internalDate,labelIds,payload/headers',
        })
        const h = Object.fromEntries((m.payload?.headers ?? []).map((x) => [x.name.toLowerCase(), x.value]))
        return { id: m.id, labelIds: m.labelIds ?? [], internalDate: m.internalDate, from: h.from, subject: h.subject }
      } catch (e) {
        if (e.status === 404) return null // deleted before we could read it
        throw e
      }
    },
  }
}
