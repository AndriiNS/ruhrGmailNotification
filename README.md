# MailPing (ruhrGmailNotification)

SaaS that forwards notifications about new Gmail messages to Telegram and WhatsApp.
It is not a mail client. Requirements: `email-notification-saas-mvp-plan.md`.

Stack: React + Vite (JavaScript), Tailwind CSS v4, React Router.

## Commands
- `npm install`
- `npm run dev` — local dev server
- `npm run lint`
- `npm run build` / `npm run preview`

## Status
Stage 0+1 done: scaffold, design tokens, UI kit, layouts, routes with placeholder pages.
All data is demo data (`VITE_DEMO_MODE`). No real integrations yet.

## Proof of concept
`poc/gmail-telegram/` — local Gmail → Telegram experiment (separate from the frontend). See its README and `poc-gmail-telegram.md`.
