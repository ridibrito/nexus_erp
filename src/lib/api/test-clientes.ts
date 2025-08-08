import { supabase } from '../supabase'

export async function testClientesAPI() {
  try {
    console.log('🧪 Testando API de clientes...')
    
    // Testar conexão
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Erro ao obter sessão:', sessionError)
      return false
    }
    
    console.log('✅ Sessão obtida:', sessionData.session?.user?.email)
    
    // Testar listagem de clientes
    const { data: clientes, error: listError } = await supabase
      .from('clientes')
      .select('*')
      .limit(5)
    
    if (listError) {
      console.error('❌ Erro ao listar clientes:', listError)
      return false
    }
    
    console.log('✅ Listagem de clientes funcionando:', clientes?.length || 0, 'clientes encontrados')
    
    return true
  } catch (error) {
    console.error('❌ Erro inesperado:', error)
    return false
  }
}
