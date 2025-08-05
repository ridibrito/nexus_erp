import { supabase, testSupabaseConnection } from './supabase'

export async function checkSupabaseSetup() {
  console.log('🔍 Verificando configuração do Supabase...')
  
  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL não está definida')
    return false
  }
  
  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
    return false
  }
  
  console.log('✅ Variáveis de ambiente configuradas')
  
  // Testar conexão
  const isConnected = await testSupabaseConnection()
  
  if (isConnected) {
    console.log('✅ Conexão com Supabase estabelecida')
    return true
  } else {
    console.error('❌ Falha na conexão com Supabase')
    return false
  }
}

export async function testDatabaseTables() {
  try {
    console.log('🔍 Testando tabelas do banco de dados...')
    
    // Testar tabela empresas
    const { data: empresas, error: empresasError } = await supabase
      .from('empresas')
      .select('count')
      .limit(1)
    
    if (empresasError) {
      console.error('❌ Erro ao acessar tabela empresas:', empresasError)
      return false
    }
    
    console.log('✅ Tabela empresas acessível')
    
    // Testar tabela clientes
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('count')
      .limit(1)
    
    if (clientesError) {
      console.error('❌ Erro ao acessar tabela clientes:', clientesError)
      return false
    }
    
    console.log('✅ Tabela clientes acessível')
    
    // Testar tabela cobrancas
    const { data: cobrancas, error: cobrancasError } = await supabase
      .from('cobrancas')
      .select('count')
      .limit(1)
    
    if (cobrancasError) {
      console.error('❌ Erro ao acessar tabela cobrancas:', cobrancasError)
      return false
    }
    
    console.log('✅ Tabela cobrancas acessível')
    
    console.log('✅ Todas as tabelas estão acessíveis')
    return true
    
  } catch (error) {
    console.error('❌ Erro inesperado ao testar tabelas:', error)
    return false
  }
}

export async function runFullCheck() {
  console.log('🚀 Iniciando verificação completa do Supabase...')
  
  const setupOk = await checkSupabaseSetup()
  if (!setupOk) {
    console.error('❌ Configuração do Supabase falhou')
    return false
  }
  
  const tablesOk = await testDatabaseTables()
  if (!tablesOk) {
    console.error('❌ Teste das tabelas falhou')
    return false
  }
  
  console.log('✅ Verificação completa concluída com sucesso!')
  return true
} 