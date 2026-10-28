// Database access for telegram_connections, using the service-role client (bypasses RLS).
// Only a hash of the one-time link token is stored.
export function createTelegramRepo(supabase) {
  const table = () => supabase.from('telegram_connections')
  const check = (error) => {
    if (error) throw new Error(`db_error:${error.code || 'unknown'}`)
  }
  return {
    async saveLink(userId, tokenHash, expiresAt) {
      const { error } = await table().upsert(
        { user_id: userId, status: 'pending', chat_id: null, chat_name: null, connected_at: null, link_token_hash: tokenHash, link_expires_at: expiresAt },
        { onConflict: 'user_id' },
      )
      check(error)
    },
    async findPendingByHash(tokenHash) {
      const { data, error } = await table()
        .select('user_id')
        .eq('link_token_hash', tokenHash)
        .eq('status', 'pending')
        .gt('link_expires_at', new Date().toISOString())
        .maybeSingle()
      check(error)
      return data?.user_id ?? null
    },
    // Returns 'ok', 'gone' (token already used) or 'chat_taken' (chat belongs to another account).
    async markConnected(userId, tokenHash, { chatId, chatName }) {
      const { data, error } = await table()
        .update({ status: 'connected', chat_id: chatId, chat_name: chatName, connected_at: new Date().toISOString(), link_token_hash: null, link_expires_at: null })
        .eq('user_id', userId)
        .eq('link_token_hash', tokenHash)
        .select('user_id')
      if (error?.code === '23505') return 'chat_taken'
      check(error)
      return data.length ? 'ok' : 'gone'
    },
    async get(userId) {
      const { data, error } = await table().select('status, chat_id').eq('user_id', userId).maybeSingle()
      check(error)
      return data
    },
    async markError(userId) {
      const { error } = await table().update({ status: 'error' }).eq('user_id', userId)
      check(error)
    },
    async remove(userId) {
      const { error } = await table().delete().eq('user_id', userId)
      check(error)
    },
  }
}
