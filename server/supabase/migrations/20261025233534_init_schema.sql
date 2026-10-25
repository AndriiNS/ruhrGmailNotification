-- MailPing initial schema.
-- Principles: RLS on every table; the browser (anon/authenticated) gets the minimum it needs;
-- everything that changes business state (mailboxes, subscriptions, channels, logs) is written
-- only by the server with the service role. Secrets (OAuth tokens) are never readable by clients.

-- Shared trigger: keep updated_at current. SECURITY INVOKER, fixed search_path.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

------------------------------------------------------------------------------
-- user_preferences: one row per user, editable by the owner.
------------------------------------------------------------------------------
create table public.user_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  include_subject boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_preferences enable row level security;
create trigger user_preferences_updated_at before update on public.user_preferences
  for each row execute function public.set_updated_at();

create policy "preferences_select_own" on public.user_preferences for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "preferences_insert_own" on public.user_preferences for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "preferences_update_own" on public.user_preferences for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

revoke all on public.user_preferences from anon, authenticated;
grant select, insert on public.user_preferences to authenticated;
grant update (include_subject) on public.user_preferences to authenticated;

------------------------------------------------------------------------------
-- mailboxes: connected email accounts (max 3 per user, enforced here as well as in the server).
------------------------------------------------------------------------------
create table public.mailboxes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  provider text not null check (provider in ('gmail')),
  address text not null,
  status text not null default 'connected' check (status in ('connected', 'needs_reconnect', 'error')),
  channels text[] not null default '{telegram}' check (channels <@ array['telegram', 'whatsapp']),
  history_id text, -- Gmail polling checkpoint, server-only
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index mailboxes_user_provider_address_key on public.mailboxes (user_id, provider, lower(address));
alter table public.mailboxes enable row level security;
create trigger mailboxes_updated_at before update on public.mailboxes
  for each row execute function public.set_updated_at();

create function public.enforce_mailbox_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Serialize concurrent inserts per user so the limit cannot be raced.
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if (select count(*) from public.mailboxes where user_id = new.user_id) >= 3 then
    raise exception 'mailbox_limit_reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger mailboxes_limit before insert on public.mailboxes
  for each row execute function public.enforce_mailbox_limit();

create policy "mailboxes_select_own" on public.mailboxes for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.mailboxes from anon, authenticated;
grant select (id, user_id, provider, address, status, channels, created_at, updated_at)
  on public.mailboxes to authenticated; -- history_id stays server-only

------------------------------------------------------------------------------
-- mailbox_credentials: encrypted OAuth refresh tokens. No client access at all.
------------------------------------------------------------------------------
create table public.mailbox_credentials (
  mailbox_id uuid primary key references public.mailboxes (id) on delete cascade,
  refresh_token_encrypted text not null, -- encrypted by the server before it is stored
  scope text,
  updated_at timestamptz not null default now()
);
alter table public.mailbox_credentials enable row level security; -- no policies = no client access
revoke all on public.mailbox_credentials from anon, authenticated;

------------------------------------------------------------------------------
-- telegram_connections: one Telegram chat per user.
------------------------------------------------------------------------------
create table public.telegram_connections (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'connected', 'error')),
  chat_id bigint,
  chat_name text,
  link_token_hash text, -- hash of the one-time /start token, server-only
  link_expires_at timestamptz,
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.telegram_connections enable row level security;
create trigger telegram_connections_updated_at before update on public.telegram_connections
  for each row execute function public.set_updated_at();

create policy "telegram_select_own" on public.telegram_connections for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.telegram_connections from anon, authenticated;
grant select (user_id, status, chat_name, connected_at) on public.telegram_connections to authenticated;

------------------------------------------------------------------------------
-- subscriptions: mirror of Stripe state, written only by the server from verified webhooks.
-- No row means "not subscribed".
------------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  status text not null check (status in ('active', 'canceling', 'payment_required', 'expired')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

create policy "subscriptions_select_own" on public.subscriptions for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.subscriptions from anon, authenticated;
grant select (user_id, status, current_period_end, updated_at) on public.subscriptions to authenticated;

-- Webhook idempotency: each Stripe event is processed once. Server-only.
create table public.stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);
alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;

------------------------------------------------------------------------------
-- notification_log: delivery results and de-duplication. Deliberately stores NO sender, subject
-- or body: only the Gmail message id (needed to avoid duplicates) and the outcome.
------------------------------------------------------------------------------
create table public.notification_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  mailbox_id uuid not null references public.mailboxes (id) on delete cascade,
  gmail_message_id text not null,
  channel text not null check (channel in ('telegram', 'whatsapp')),
  status text not null check (status in ('delivered', 'failed')),
  error_code text,
  created_at timestamptz not null default now(),
  unique (mailbox_id, gmail_message_id, channel)
);
create index notification_log_user_created_idx on public.notification_log (user_id, created_at desc);
alter table public.notification_log enable row level security;

create policy "notification_log_select_own" on public.notification_log for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.notification_log from anon, authenticated;
grant select (id, mailbox_id, channel, status, error_code, created_at) on public.notification_log to authenticated;
