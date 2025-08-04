// Script para testar conexão com Supabase
// Execute: node test-connection.js

const { createClient } = require('@supabase/supabase-js')

// Substitua pelas suas credenciais
const supabaseUrl = 'https://pnfpcytrpuvhjzrmtbwy.supabase.co' // Substitua pela sua URL
const supabaseKey = 'sua_chave_aqui' // Substitua pela sua chave

console.log('🔍 Testando conexão com Supabase...')
console.log('URL:', supabaseUrl)

if (!supabaseKey || supabaseKey === 'sua_chave_aqui') {
  console.error('❌ Configure a chave do Supabase no script')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
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

    console.log('\n3. Testando autenticação...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message)
    } else {
      console.log('✅ Autenticação funcionando')
    }

    console.log('\n🎉 Teste concluído!')

  } catch (error) {
    console.error('❌ Erro inesperado:', error.message)
  }
}

testConnection() 