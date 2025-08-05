import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Função para verificar se a conexão está funcionando
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Erro na conexão com Supabase:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Erro inesperado ao testar conexão:', error)
    return false
  }
} 