import PageHeader from '../common/PageHeader'

// Shared layout for legal documents. Content lives in the page files and is a DRAFT.
export default function LegalPage({ title, sections }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader title={title} />
      <p role="note" className="mb-8 rounded-control bg-warn-soft px-4 py-3 text-sm text-warn">
        <strong>Draft.</strong> This text has not been reviewed by a lawyer and contains placeholders in
        [square brackets]. Do not publish it as-is.
      </p>
      <div className="space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-bold">{s.heading}</h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="mt-2 text-muted">{p}</p>
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}
