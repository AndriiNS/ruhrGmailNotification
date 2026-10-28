# MailPing server

Node.js (JavaScript, ESM) + Express. Verifies Supabase users and, in later stages, runs the Gmail,
Telegram and Stripe integrations. Database and auth: Supabase project `mailping` (Frankfurt).

## Setup (PowerShell)
```powershell
cd server
npm install
Copy-Item .env.example .env   # fill SUPABASE_URL and SUPABASE_SECRET_KEY
npm test
npm run dev                   # http://localhost:3001/health
```
`SUPABASE_SECRET_KEY` is in the Supabase dashboard under Project Settings > API Keys. It bypasses RLS:
keep it only in `server/.env`, never in the frontend, Git or chats.

## Database
`supabase/migrations/` holds the schema (tables, RLS, grants). Design rules:
- Row Level Security on every table; the browser can only read the signed-in user's own rows.
- All business writes (mailboxes, subscriptions, Telegram link, notification log) come from this server.
- OAuth refresh tokens are encrypted by the server and never readable by clients (`mailbox_credentials`).
- `notification_log` stores no sender, subject or body, only message id and delivery result.
- The 3-mailbox limit is enforced by a database trigger as well as by the server.

## Routes
- `GET /health` public
- `GET /api/me` requires `Authorization: Bearer <Supabase access token>`
- `POST /api/telegram/connect` creates a one-time link `t.me/<bot>?start=<token>` (valid 15 min; only its hash is stored)
- `POST /api/telegram/cancel`, `/disconnect`, `/test` (sends a real message to the connected chat)
- All `/api/telegram/*` routes need the Bearer token; without `TELEGRAM_BOT_TOKEN` they answer 503.

## Telegram
The server long-polls the bot for `/start <token>` messages (no public URL needed locally), so only one
process may poll a bot at a time. Do not run `npm run telegram:chat-id` from the PoC while the server runs.
Add `TELEGRAM_BOT_TOKEN` to `server/.env`.
