const clean = (s, max) => {
  const t = String(s ?? '').replace(/\p{Cc}+/gu, ' ').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

export function formatNotification(msg) {
  const when = msg.internalDate ? new Date(Number(msg.internalDate)).toLocaleString() : 'unknown time'
  return [
    'New email',
    `From: ${clean(msg.from, 200) || '(unknown sender)'}`,
    `Subject: ${clean(msg.subject, 200) || '(no subject)'}`,
    `Received: ${when}`,
  ].join('\n')
}
