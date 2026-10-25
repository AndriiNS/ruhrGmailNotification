# Gmail → Telegram: local proof of concept

Experiment, not production code. Runs on your own PC, no hosting, no Pub/Sub, no paid services.
It polls Gmail for new inbox mail and sends **sender, subject and time** to Telegram.
It never downloads message bodies or attachments, and never sends, changes or deletes mail.

Requires Node.js 20.6+ (`node -v`). No npm dependencies to install.

## 1. Telegram bot (manual)
1. In Telegram open **@BotFather** → `/newbot` → follow the prompts → copy the bot token.
2. Open your new bot, press **Start**, send "hi" (a bot cannot message you first).
3. In PowerShell: `Copy-Item .env.example .env`, then put the token into `TELEGRAM_BOT_TOKEN` in `.env`.
4. `npm run telegram:chat-id` → copy the printed number into `TELEGRAM_CHAT_ID`.
5. `npm run telegram:test` → a test message should arrive in Telegram.

## 2. Google Cloud (manual, free)
Creating a project and enabling Gmail API does not require a billing account. If any step asks for one, stop and tell me.
1. https://console.cloud.google.com → create a project (e.g. `gmail-telegram-poc`).
2. **APIs & Services → Library** → enable **Gmail API**.
3. **Google Auth Platform / OAuth consent screen**: user type **External**, fill app name and your email. Leave **Publishing status = Testing**.
4. **Data Access / Scopes**: add `https://www.googleapis.com/auth/gmail.metadata`.
5. **Audience → Test users**: add your own Gmail address.
6. **Clients → Create client → Desktop app**. Copy Client ID and Client secret into `.env`
   (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).

## 3. Run
```powershell
npm run gmail:auth   # open the printed link, sign in, approve; tokens go to data/tokens.json
npm run monitor      # first run only sets a baseline; Ctrl+C to stop
```
Now send yourself a test email. A Telegram message should appear within one polling interval.
Other commands: `npm test` (unit tests, no network), `npm run state:reset` (forget checkpoint, next run sets a new baseline).

## Things to know
- **Scope:** `gmail.metadata` is a *restricted* scope. Fine for personal testing in Testing mode; a public launch needs Google's restricted-scope verification and an annual security assessment (see `poc-gmail-telegram.md`).
- **Testing mode:** authorization and refresh token expire after **7 days**. Then the monitor stops with a message; run `npm run gmail:auth` again.
- **Local tokens:** `data/tokens.json` is a plain file. Whoever copies it can read your mail metadata until you revoke access (https://myaccount.google.com/permissions). It is Git-ignored. Never share it, `.env` or screenshots of them.
- **Polling interval:** `POLL_INTERVAL_SECONDS` (default 60, minimum 15). Shorter = faster alerts but more Gmail API calls and more risk of rate limits. Errors back off automatically.
- **Reliability:** the checkpoint advances only after Telegram accepted all messages, and already-notified IDs are remembered, so a failed cycle is retried without duplicates.
- **Mail missed while offline:** if the PC was off long enough that Gmail drops the old checkpoint, the monitor resets the baseline and logs a warning.

## Troubleshooting
| Message | Fix |
|---|---|
| `.env: not found` | `Copy-Item .env.example .env` |
| Telegram 401 | Wrong or revoked bot token |
| Telegram 400 chat not found / 403 | Press Start in the bot; recheck chat id |
| `access_denied` / app not verified | Add your address under Test users |
| Gmail API not enabled | Enable Gmail API in the same project as the OAuth client |
| `invalid_grant` | 7-day expiry or revoked access: `npm run gmail:auth` |
| No refresh token | Remove the app at myaccount.google.com/permissions, run auth again |
| Gmail 403 insufficient permission | Run auth again and approve the permission |
