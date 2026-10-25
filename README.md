# MailPing (ruhrGmailNotification)

SaaS that forwards notifications about new Gmail messages to Telegram (WhatsApp planned).
It is not a mail client. Requirements: `email-notification-saas-mvp-plan.md`.

Stack: React + Vite (JavaScript), Tailwind CSS v4, React Router.

## Commands
- `npm install`
- `npm run dev` — local dev server
- `npm run lint`
- `npm run build` / `npm run preview`

## Status
Frontend stages 0–8 are built on **demo data only** (`VITE_DEMO_MODE`, default `true`):
landing, auth forms, dashboard, mailboxes, channels, billing, settings, draft legal pages.
Nothing is connected to Google, Telegram, Stripe or a database. Demo screens are labelled as such.
The `/privacy` and `/terms` texts are drafts that need legal review.

Routes: `/`, `/login`, `/signup`, `/forgot-password`, `/verify-email`, `/privacy`, `/terms`,
`/app`, `/app/mailboxes`, `/app/integrations`, `/app/billing`, `/app/settings`.

## Architecture
Every integration sits behind a service seam in `src/services/<name>/index.js`
(auth, mailbox, channel, billing, account, dashboard). In demo mode each uses a mock;
with `VITE_DEMO_MODE=false` the services report "not configured" instead of faking success.
Replace the mock with a real implementation (Supabase, Gmail OAuth via backend, Telegram Bot API,
Stripe Checkout/Portal) without changing the UI. Mock data lives in `src/data`.
The backend must enforce all limits and statuses; the UI only displays them.

## Proof of concept
`poc/gmail-telegram/` — local Gmail → Telegram experiment (separate from the frontend).
See its README and `poc-gmail-telegram.md`.

## Secrets
Never commit `.env`, `data/`, tokens or client secrets (see `.gitignore`). `VITE_*` variables are public.
