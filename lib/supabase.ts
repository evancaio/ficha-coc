import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http')
)

// Usa valores placeholder seguros durante o build caso as variáveis de ambiente ainda não estejam configuradas no Vercel
export const supabase = createClient(
    isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
    isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
)
