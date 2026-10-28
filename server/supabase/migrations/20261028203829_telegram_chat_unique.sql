-- One Telegram chat can be connected to only one MailPing account.
create unique index telegram_connections_chat_id_key
  on public.telegram_connections (chat_id)
  where chat_id is not null;
