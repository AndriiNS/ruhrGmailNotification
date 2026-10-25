// Illustration only: shows the format of a notification. Not live data.
export default function NotificationPreview() {
  return (
    <figure className="mx-auto w-full max-w-sm">
      <div className="rounded-panel border border-line bg-surface p-4 shadow-overlay">
        <div className="mb-3 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-brand text-sm font-bold text-white"
          >
            M
          </span>
          <div>
            <p className="text-sm font-bold leading-tight">MailPing bot</p>
            <p className="text-xs text-muted">Telegram</p>
          </div>
        </div>
        <div className="rounded-panel rounded-tl-sm bg-paper p-4 text-sm leading-relaxed shadow-panel">
          <p className="font-bold">New email</p>
          <p><span className="text-muted">From:</span> Anna Weber &lt;anna@example.com&gt;</p>
          <p><span className="text-muted">Subject:</span> Interview moved to Thursday, 10:00</p>
          <p><span className="text-muted">Received:</span> 25.10.2026, 09:41</p>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted">
        Example notification. Sender, subject and time only.
      </figcaption>
    </figure>
  )
}
