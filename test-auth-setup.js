// Script de teste para verificar a configuração da autenticação
// Execute com: node test-auth-setup.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testAuthSetup() {
  console.log('🧪 Testando configuração da autenticação...\n')

  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('📋 Verificando variáveis de ambiente:')
  console.log(`- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Configurado' : '❌ Não configurado'}`)
  console.log(`- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ Configurado' : '❌ Não configurado'}`)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Variáveis de ambiente não configuradas!')
    console.log('Crie um arquivo .env.local com as credenciais do Supabase.')
    return
  }

  // Criar cliente Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('\n🔗 Testando conexão com Supabase...')

  try {
    // Testar conexão básica
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message)
      return
    }

    console.log('✅ Conexão com Supabase estabelecida')

    // Verificar se a tabela profiles existe
    console.log('\n📊 Verificando tabela profiles...')
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.log('❌ Erro ao acessar tabela profiles:', profilesError.message)
      console.log('Execute o schema SQL no Supabase primeiro!')
      return
    }

    console.log('✅ Tabela profiles encontrada')

    // Verificar políticas RLS
    console.log('\n🔒 Verificando políticas RLS...')
    
    const { data: policiesData, error: policiesError } = await supabase
      .rpc('get_user_profile')

    if (policiesError) {
      console.log('⚠️  Função get_user_profile não encontrada (normal se não estiver logado)')
    } else {
      console.log('✅ Função get_user_profile disponível')
    }

    console.log('\n✅ Configuração da autenticação está funcionando!')
    console.log('\n📝 Próximos passos:')
    console.log('1. Execute o projeto com: npm run dev')
    console.log('2. Acesse: http://localhost:3000/auth/register')
    console.log('3. Teste o cadastro de um usuário')
    console.log('4. Teste o login em: http://localhost:3000/auth/login')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testAuthSetup() 