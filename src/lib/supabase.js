import { createClient } from '@supabase/supabase-js'
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './config'

let client
export const getClient = () => (client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY))
