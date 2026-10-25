# Email Notification SaaS — повний план MVP

## 1. Ідея та цілі

Створити платний SaaS для користувачів у Європі, який відстежує нові листи у підключених поштових скриньках і надсилає сповіщення в Telegram, WhatsApp або обидва канали.

### Бізнес-модель

- Ціна: €1,99 на місяць.
- До 3 підключених поштових скриньок на один акаунт.
- Одна підписка покриває всі підключені канали.
- Оплата та керування підпискою — через Stripe на сайті.
- Telegram і WhatsApp — канали доставки сповіщень, а не окремі платні продукти.
- Рекомендовано почати з Gmail + Telegram, а потім додати Outlook, WhatsApp та інші сумісні поштові системи.

### Важливі обмеження

- Не обіцяти необмежені повідомлення в WhatsApp за €1,99, поки не перевірено актуальні тарифи Meta та собівартість.
- Не кожна університетська чи корпоративна скринька дозволяє стороннім застосункам доступ через IMAP або OAuth.
- Google OAuth verification та затвердження WhatsApp-шаблонів можуть затримати запуск.
- Не зберігати паролі користувачів від пошти.
- Не зберігати повний вміст листів, якщо для сповіщень достатньо метаданих.
- Усі інтеграції мають показувати реальний статус із бекенду. Не імітувати успішне підключення чи оплату.

---

## 2. Рекомендований стек

### Frontend

- React + Vite
- JavaScript, без TypeScript
- Tailwind CSS
- React Router
- Компонентна архітектура
- Адаптивний дизайн для мобільних, планшетів і десктопів

### Backend

- Node.js
- Express
- REST API
- Фоновий worker для перевірки пошти й доставки сповіщень
- Черга задач або простий механізм повторних спроб на першому етапі

### Дані й авторизація

- Supabase PostgreSQL
- Supabase Auth
- Row Level Security (RLS)
- Серверна перевірка прав доступу
- Зашифроване зберігання OAuth-токенів

### Інтеграції

- Gmail API через Google OAuth
- Microsoft Graph для Outlook/Microsoft 365 — наступний етап
- Інші поштові провайдери через OAuth або IMAP лише після перевірки сумісності
- Telegram Bot API
- WhatsApp Business Platform / Cloud API
- Stripe Checkout
- Stripe Billing Portal
- Stripe Webhooks

### Інфраструктура

- VPS або керована хмарна платформа
- HTTPS
- Домен
- Логи та моніторинг
- Резервні копії бази
- Секрети в серверному environment, а не у frontend

---

## 3. Архітектура

1. React/Vite frontend:
   - Landing page
   - Реєстрація та вхід
   - Dashboard
   - Керування поштовими скриньками
   - Налаштування Telegram і WhatsApp
   - Billing
   - Account settings

2. Node.js/Express backend:
   - Авторизація запитів
   - API для скриньок і каналів
   - Перевірка підписки
   - OAuth callback-и
   - Обробка Stripe webhooks
   - Безпечне створення й відправлення сповіщень

3. Worker:
   - Перевіряє нові листи через API провайдера
   - Виявляє нові повідомлення
   - Запобігає дублюванню
   - Перевіряє активність підписки
   - Надсилає сповіщення в обрані канали
   - Повторює невдалі доставки з обмеженням кількості спроб

4. PostgreSQL:
   - Користувачі
   - Поштові скриньки
   - Підписки
   - Канали сповіщень
   - Оброблені повідомлення
   - Логи доставки

---

## 4. Початкова структура frontend

Це орієнтир. Claude Code має спершу перевірити наявний репозиторій і не перезаписувати файли без потреби.

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   └── common/
├── pages/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── MailboxesPage.jsx
│   ├── IntegrationsPage.jsx
│   ├── BillingPage.jsx
│   └── SettingsPage.jsx
├── hooks/
├── services/
├── lib/
├── data/
├── App.jsx
├── main.jsx
└── index.css
```

Backend можна згодом винести в окрему папку або workspace:

```text
server/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middleware/
│   ├── workers/
│   ├── integrations/
│   └── app.js
├── package.json
└── .env.example
```

---

## 5. План розробки через Claude Code

Працювати по одному етапу за раз. Після кожного етапу перевіряти build, навігацію та зміни в коді. Не просити Claude реалізувати весь продукт одним великим запитом.

### Етап 0 — аудит репозиторію

Prompt для Claude Code:

```text
Analyze the current repository before making any changes.

We are building a paid email notification SaaS for European users.

Stack:
- React + Vite
- JavaScript only, no TypeScript
- Tailwind CSS
- React Router
- Supabase Auth and PostgreSQL
- Node.js + Express backend will be implemented later
- Stripe subscriptions will be implemented later
- Telegram Bot API and WhatsApp Cloud API will be implemented later

Subscription:
- €1.99/month
- Up to 3 connected email accounts
- One subscription covers Telegram, WhatsApp, or both

For this stage:
1. Inspect the existing project and package.json.
2. Identify what is already configured.
3. Propose a minimal folder structure for the frontend.
4. Identify missing dependencies.
5. Do not overwrite existing files unnecessarily.
6. Do not implement the backend or real integrations yet.
7. Ask for approval before performing major structural changes.

Use JavaScript, functional React components, and small reusable components.
Keep the architecture simple and suitable for a beginner to maintain.
```

Очікуваний результат: короткий аудит, пропозиція структури, список відсутніх залежностей. Погодити зміни перед великими перебудовами.

### Етап 1 — дизайн-система та спільна верстка

```text
Implement the visual foundation of the email notification SaaS.

Requirements:
- Modern, clean European SaaS aesthetic.
- Light theme with white and light-gray surfaces.
- Dark navy text and a restrained blue accent.
- Responsive layouts for mobile, tablet, and desktop.
- Consistent spacing, typography, border radii, shadows, and focus states.
- Accessible semantic HTML and keyboard navigation.
- Reusable buttons, inputs, cards, badges, dialogs, and loading states.
- Use the existing Tailwind setup if present; do not reconfigure it unnecessarily.

Create the shared layout and reusable UI components first.

Do not implement authentication, database access, payments, or external APIs in this stage.

Run the available lint/build checks and fix any errors introduced by your changes.
```

### Етап 2 — Landing page

```text
Build a responsive landing page for the email notification SaaS.

Sections:
1. Header with logo, Features, Pricing, FAQ, Sign in, and Get started.
2. Hero section explaining email notifications through Telegram and WhatsApp.
3. Product preview showing an email notification appearing in messaging apps.
4. Three-step explanation: connect email, choose channels, receive notifications.
5. Features section highlighting up to 3 mailboxes.
6. Pricing section showing €1.99/month.
7. FAQ explaining supported email providers, privacy, cancellation, and setup.
8. Footer with Privacy Policy, Terms, and Contact links.

Use English for all initial UI copy.

CTA buttons should navigate to the appropriate routes, even if authentication is not implemented yet.

Do not make unsupported claims about unlimited notifications or universal email-provider compatibility.

Use reusable components and responsive design. Avoid unnecessary animation libraries.

Test the layout on mobile and desktop.
```

### Етап 3 — форми авторизації

```text
Implement the authentication UI for the SaaS.

Create:
- Sign up page
- Sign in page
- Forgot password page
- Email verification state
- Loading, validation, success, and error states

Requirements:
- Email and password fields.
- Password confirmation during registration.
- Show/hide password controls.
- Clear inline validation messages.
- Accessible form labels and keyboard navigation.
- Links between authentication pages.
- Responsive layouts matching the existing design system.

For now, use a clearly separated mock authentication service if Supabase is not configured.
Never pretend that a mock login is real authentication.

Keep the code ready for a later Supabase Auth integration.
Do not store passwords in localStorage or hardcode credentials.
```

### Етап 4 — Dashboard

```text
Build the authenticated dashboard using mock data isolated in src/data.

Include:
- Greeting and account menu.
- Subscription status: Active, Trial, Payment required, or Expired.
- Mailbox usage indicator, such as 2 of 3.
- Connected email accounts with provider, address, and connection status.
- Notification channel status for Telegram and WhatsApp.
- Recent notification activity.
- Add mailbox button.
- Connect Telegram and Connect WhatsApp actions.
- Manage subscription button.
- Empty states for users who have not connected anything.

Create reusable cards and status badges.

Every button must have a meaningful behavior: navigate, open a dialog, or show a clear not-yet-configured state.
Do not simulate successful external connections.

Keep mock data separate from UI components so it can later be replaced with API calls.
```

### Етап 5 — керування поштовими скриньками

```text
Build the email mailbox management UI.

Requirements:
- List connected mailboxes.
- Show provider, email address, connection status, and selected notification channels.
- Add mailbox flow with supported provider choices.
- Clearly distinguish providers that are available from those planned for later.
- Show OAuth connection instructions and error states.
- Allow the user to configure channels per mailbox.
- Allow disconnecting a mailbox after a confirmation dialog.
- Enforce a maximum of 3 mailboxes in the UI, while noting that the backend must enforce the same limit.

Do not ask users to enter their normal email password into our website.

Do not fake OAuth success. Use a mock adapter with an explicit demo mode until real provider integrations are implemented.

Prepare service interfaces so Gmail API, Microsoft Graph, and later supported IMAP providers can be integrated without rewriting the UI.
```

### Етап 6 — Telegram і WhatsApp

```text
Build the integrations settings UI for Telegram and WhatsApp.

Telegram flow:
- Explain that the user must open our official Telegram bot.
- Show a configurable bot link from environment-backed app configuration.
- Display pending connection instructions and connection status.
- Provide a disconnect action.

WhatsApp flow:
- Explain that the user must provide and verify a WhatsApp number through the official supported connection flow.
- Show the required consent and notification preferences.
- Display connection status and delivery errors.
- Explain that message delivery may depend on approved templates and applicable provider rules.

Include per-mailbox channel preferences so users can choose Telegram, WhatsApp, or both.

Do not hardcode real bot tokens, API credentials, phone numbers, or secrets.
Do not mark a channel connected until the backend confirms it.

Use mock services only for the visual prototype and label demo states clearly.
```

### Етап 7 — сторінка оплати

```text
Build the billing and subscription management UI.

Plan:
- Single plan: €1.99/month.
- Up to 3 connected mailboxes.
- Telegram, WhatsApp, or both.
- One subscription for the whole account.

Include:
- Current subscription status.
- Pricing and renewal information.
- Subscribe button.
- Manage subscription button.
- Payment required, past due, canceled, and expired states.
- Invoice/payment history placeholder.
- Clear cancellation and renewal information.

Prepare the UI for Stripe Checkout and Stripe Billing Portal integration.

Never collect or store card details in our own forms.
Do not mark a user as paid based on a frontend redirect or local state; subscription status must come from the backend after verified Stripe webhooks.

Use demo data until the Stripe backend is implemented.
```

### Етап 8 — налаштування, приватність і завершення верстки

```text
Build the account settings and privacy UI.

Include:
- Account email and profile details.
- Language preference.
- Notification preferences.
- Default notification channels.
- Email connection management.
- Subscription management shortcut.
- Export or access-to-data request entry point.
- Delete account flow with confirmation.
- Privacy Policy and Terms routes.
- Success, loading, and error states.

Do not implement destructive actions as frontend-only simulations.
Clearly separate UI placeholders from actual backend functionality.

Check responsive behavior, accessibility, empty states, and navigation across the entire application.

Run the production build and fix all errors.
Provide a summary of changed files, routes, known limitations, and the next backend integration steps.
```

### Етап 9 — реальні інтеграції

Підключати по одній інтеграції, а не всі одночасно:

1. Supabase Auth, PostgreSQL, RLS.
2. Gmail OAuth і Gmail API.
3. Telegram Bot API.
4. Stripe Checkout, webhooks, Billing Portal.
5. WhatsApp Cloud API.
6. Microsoft Graph і додаткові поштові провайдери.

Перед кожною інтеграцією Claude має:
- описати необхідні акаунти й дозволи;
- назвати environment variables;
- не просити вставляти секрети в код;
- реалізувати інтеграцію;
- додати перевірки та обробку помилок;
- описати, як перевірити її локально.

### Контрольний prompt після кожного етапу

```text
Review the changes from the previous task.

1. Run the available lint and production build commands.
2. Check for broken routes, missing imports, console errors, and responsive layout issues.
3. Verify that no existing functionality was accidentally removed.
4. Identify buttons that are still placeholders and explain their current behavior.
5. List changed files and any environment variables needed.
6. Fix issues introduced by the current task before proceeding.

Do not begin the next implementation stage until the current stage passes its checks.
```

Рекомендація: робити окремий Git-коміт після кожного завершеного етапу.

---

## 6. Що потрібно користувачу сервісу

### Шлях користувача

1. Зареєструватися та підтвердити email акаунта сервісу.
2. Оформити підписку €1,99/місяць або активувати доступний тестовий період.
3. Підключити пошту через офіційну авторизацію провайдера.
4. Підключити Telegram, WhatsApp або обидва канали.
5. Вибрати канал або канали для кожної поштової скриньки.
6. Надіслати тестове сповіщення та перевірити доставку.

### Дані та дії для підключення

| Компонент | Що потрібно користувачу |
|---|---|
| Акаунт сервісу | Email і пароль або інший підтримуваний спосіб входу |
| Gmail | Google-акаунт і згода на необхідні дозволи |
| Outlook | Microsoft-акаунт і згода на необхідні дозволи |
| Інша пошта | Сумісний спосіб авторизації; IMAP лише якщо провайдер дозволяє |
| Telegram | Акаунт Telegram і запуск офіційного бота |
| WhatsApp | Номер WhatsApp, згода на сповіщення та передбачене підтвердження |
| Оплата | Платіжний метод, підтримуваний Stripe |

Користувач ніколи не повинен передавати пароль від своєї пошти або Telegram. Авторизація має проходити через офіційні механізми.

---

## 7. Що потрібно розробнику

### Початковий чекліст

- [ ] Git-репозиторій і локальний проєкт.
- [ ] `.gitignore` та `.env.example`.
- [ ] Домен і хостинг.
- [ ] Supabase: проєкт, база даних, Auth і RLS.
- [ ] Google Cloud: OAuth-клієнт, Gmail API, налаштування consent screen.
- [ ] Telegram BotFather: бот і серверний токен.
- [ ] Meta Developers: WhatsApp Business Platform, номер, шаблони та API-доступ.
- [ ] Stripe: акаунт, тариф €1,99, Checkout і webhooks.
- [ ] HTTPS, логи, моніторинг і резервні копії.
- [ ] Privacy Policy, Terms, правила зберігання та видалення даних.

Не потрібно створювати всі акаунти до першого запуску верстки. Спочатку frontend, потім Supabase і Telegram, далі Gmail, Stripe та WhatsApp.

---

## 8. Дані та таблиці PostgreSQL

Мінімальний початковий набір:

| Таблиця | Призначення |
|---|---|
| `users` | ID, email акаунта, дата створення |
| `mailboxes` | Провайдер, адреса, зашифровані токени, статус |
| `subscriptions` | Stripe customer ID, subscription ID, статус, період дії |
| `notification_channels` | Telegram chat ID або WhatsApp-одержувач, налаштування |
| `processed_messages` | ID листа, скринька, дата обробки |
| `notification_logs` | Канал, статус доставки, код помилки, час |

Правила:
- Увімкнути RLS і перевіряти власника кожного запису.
- Не зберігати OAuth-токени у відкритому вигляді.
- Не зберігати повний текст листів, якщо він не потрібен.
- Відкликати доступ і видаляти токени після від'єднання скриньки, де це підтримується.
- Перевіряти статус підписки на сервері, а не довіряти frontend.

---

## 9. Орієнтовні витрати

Попередній бюджет базової інфраструктури для раннього MVP:

| Стаття | Орієнтир на місяць |
|---|---:|
| VPS | €5–15 |
| PostgreSQL/Supabase | €0–25 |
| Домен | €1–2 у перерахунку |
| Логи, моніторинг, резервні копії | €0–15 |
| WhatsApp Business Platform | Залежить від країни, категорії та обсягу повідомлень |
| Stripe | Комісія з кожного платежу |

Орієнтир €10–60 на місяць стосується базової інфраструктури за ощадливого налаштування. Він не включає змінні витрати WhatsApp, юридичні послуги, податки та роботу розробника. Перевірити актуальні тарифи перед запуском.

### Приклад економіки

Для ілюстрації: якщо ціна €1,99 включає німецький ПДВ 19%, а Stripe застосовує стандартний тариф картки ЄЕЗ 1,5% + €0,25:

- Оплата користувача: €1,99.
- Частина ПДВ у ціні: приблизно €0,32.
- Комісія Stripe: приблизно €0,28.
- Залишається близько €1,39 до інших витрат.

Це спрощений приклад. Реальні податкові зобов'язання залежать від країни та статусу бізнесу; платіжні тарифи треба перевірити перед запуском.

| Платних користувачів | Місячний оборот |
|---:|---:|
| 100 | €199 |
| 500 | €995 |
| 1 000 | €1 990 |
| 5 000 | €9 950 |

Оборот не дорівнює прибутку.

### Контроль витрат WhatsApp

- Не обіцяти необмежену доставку за €1,99.
- Перевірити офіційні тарифи Meta для цільових країн і категорій шаблонів.
- Встановити денні або місячні ліміти WhatsApp.
- Дозволити користувачу вибирати Telegram як альтернативу.
- Відстежувати собівартість доставки на одного платного користувача.

---

## 10. План запуску на 6 тижнів

### Тиждень 1 — технічна перевірка

- Створити тестового Telegram-бота.
- Перевірити доступ до Gmail API та вимоги Google OAuth.
- Перевірити доступність WhatsApp Cloud API й правила шаблонів.
- Оцінити змінну собівартість WhatsApp.
- Затвердити дизайн і межі MVP.

### Тиждень 2 — акаунти та пошта

- Реєстрація та авторизація.
- База даних і RLS.
- Gmail OAuth.
- Зберігання токенів.
- Виявлення нових листів і запобігання дублюванню.

### Тиждень 3 — канали

- Telegram-підключення.
- WhatsApp-підключення.
- Налаштування каналів для кожної скриньки.
- Статуси доставки й повторні спроби.

### Тиждень 4 — Stripe

- Checkout.
- Підписка €1,99.
- Webhooks.
- Billing Portal.
- Обробка невдалих платежів і скасування.
- Серверний контроль доступу.

### Тиждень 5 — безпека та QA

- Ізоляція даних користувачів.
- Шифрування токенів.
- Перевірка видалення даних.
- Перевірка повторних подій і дубльованих сповіщень.
- Тестування витрат WhatsApp.
- Резервні копії та моніторинг.

### Тиждень 6 — закритий запуск

- 20–50 тестувальників.
- Вимірювання затримки доставки.
- Перевірка успішності підключення пошти.
- Вимірювання витрат на користувача.
- Аналіз конверсії у платну підписку.
- Виправлення проблем перед публічним запуском.

Терміни орієнтовні. OAuth-перевірки Google і погодження Meta можуть зайняти додатковий час.

---

## 11. GDPR та готовність до публічного запуску

Перед публічним запуском підготувати:

- Privacy Policy.
- Terms of Service.
- Опис цілей обробки даних і строків зберігання.
- Процедуру видалення акаунта та відкликання поштового доступу.
- Договори з постачальниками обробки даних, де потрібно.
- Перевірку міжнародних передач даних, якщо актуально.
- Налаштування ПДВ, рахунків і повернень.
- Контакт підтримки для запитів щодо приватності та платежів.

Це технічний і продуктовий чекліст, а не юридична консультація.

---

## 12. Рекомендований MVP

Перший реально працездатний реліз:

1. Реєстрація користувача.
2. Підключення Gmail через OAuth.
3. Обробка метаданих нових листів.
4. Сповіщення через Telegram.
5. Одна підписка Stripe за €1,99/місяць.
6. Максимум 3 поштові скриньки.
7. Налаштування, від'єднання та видалення даних.

Після перевірки попиту:
- Додати WhatsApp Cloud API.
- Додати Outlook/Microsoft Graph.
- Додати інші сумісні поштові провайдери.
- Розглянути додаткові платні ліміти, якщо WhatsApp робить базовий тариф збитковим.

## 13. Основні рішення, які ще потрібно визначити

- [ ] Візуальний стиль: мінімалістичний світлий, темний або схожий на Google Workspace.
- [ ] Перший поштовий провайдер: Gmail, Gmail + Outlook, IMAP для сумісної університетської пошти або спочатку лише верстка.
- [ ] Чи буде 7-денний безкоштовний тест.
- [ ] Ліміт WhatsApp-повідомлень у базовому тарифі.
- [ ] Чи потрібен окремий backend у цьому ж репозиторії або окрема папка/workspace.

## 14. Загальна рекомендація

Почати з верстки та тестових даних. Потім додати Supabase і Telegram, після цього Gmail OAuth та Stripe. WhatsApp підключати після перевірки офіційного доступу, шаблонів і економіки.

Не реалізовувати все одним запитом Claude Code. Працювати поетапно, перевіряти build і навігацію після кожного кроку та робити Git-коміт після завершення етапу.
