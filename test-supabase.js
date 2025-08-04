const { createClient } = require('@supabase/supabase-js')

// Substitua pelas suas credenciais
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'sua_url_aqui'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua_chave_aqui'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSupabase() {
  console.log('🔍 Testando conexão com Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey ? 'Configurada' : 'Não configurada')

  try {
    // Teste 1: Conexão básica
    console.log('\n1. Testando conexão básica...')
    const { data, error } = await supabase
      .from('empresas')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão:', error.message)
      return
    }
    console.log('✅ Conexão básica funcionando')

    // Teste 2: Verificar tabelas
    console.log('\n2. Verificando tabelas...')
    const tables = ['empresas', 'clientes', 'cobrancas', 'contas_a_pagar', 'integracoes']
    
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.error(`❌ Tabela ${table}:`, tableError.message)
      } else {
        console.log(`✅ Tabela ${table}: OK`)
      }
    }

    // Teste 3: Testar autenticação
    console.log('\n3. Testando autenticação...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message)
    } else {
      console.log('✅ Autenticação funcionando')
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testSupabase() 