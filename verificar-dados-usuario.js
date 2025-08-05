// Script para verificar dados do usuário no Supabase
// Execute com: node verificar-dados-usuario.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verificarDadosUsuario() {
  console.log('🔍 Verificando dados do usuário no Supabase...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Variáveis de ambiente não configuradas!')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Fazer login para obter o ID do usuário
  const email = 'ricardo@coruss.com.br'
  const password = '123456'

  console.log('🔐 Fazendo login para obter dados...')
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.log('❌ Erro no login:', authError.message)
      return
    }

    if (!authData.user) {
      console.log('❌ Nenhum usuário retornado')
      return
    }

    const userId = authData.user.id
    console.log('✅ Login bem-sucedido!')
    console.log('🆔 ID do usuário:', userId)
    console.log('📧 Email:', authData.user.email)

    // Verificar dados na tabela auth.users
    console.log('\n📋 Dados na tabela auth.users:')
    console.log('- ID:', authData.user.id)
    console.log('- Email:', authData.user.email)
    console.log('- Criado em:', authData.user.created_at)
    console.log('- Raw user meta data:', authData.user.user_metadata)

    // Verificar dados na tabela profiles
    console.log('\n📋 Dados na tabela public.profiles:')
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.log('❌ Erro ao buscar perfil:', profileError.message)
      console.log('💡 Isso pode indicar que:')
      console.log('   1. O trigger não foi criado corretamente')
      console.log('   2. O usuário foi criado antes do trigger')
      console.log('   3. Houve erro na criação do perfil')
    } else {
      console.log('✅ Perfil encontrado:')
      console.log('- ID:', profile.id)
      console.log('- Nome:', profile.name)
      console.log('- Empresa:', profile.company_name)
      console.log('- CNPJ:', profile.cnpj)
      console.log('- Criado em:', profile.created_at)
      console.log('- Atualizado em:', profile.updated_at)
    }

    // Verificar se o trigger existe
    console.log('\n🔧 Verificando trigger...')
    
    const { data: triggers, error: triggerError } = await supabase
      .rpc('get_triggers')

    if (triggerError) {
      console.log('⚠️  Não foi possível verificar triggers (normal)')
    } else {
      console.log('✅ Triggers encontrados:', triggers)
    }

    // Verificar se a função existe
    console.log('\n🔧 Verificando função handle_new_user...')
    
    try {
      const { data: functionTest, error: functionError } = await supabase
        .rpc('handle_new_user_test')
      
      if (functionError) {
        console.log('⚠️  Função não encontrada ou erro:', functionError.message)
      } else {
        console.log('✅ Função handle_new_user existe')
      }
    } catch (error) {
      console.log('⚠️  Não foi possível testar a função')
    }

    console.log('\n📝 Resumo:')
    console.log('1. Tabela auth.users: Contém apenas dados básicos (email, senha, etc.)')
    console.log('2. Tabela public.profiles: Contém dados customizados (nome, empresa, CNPJ)')
    console.log('3. Trigger: Deve criar automaticamente o perfil quando usuário é criado')
    console.log('4. Se o perfil não existe, pode ser necessário recriar o trigger')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

verificarDadosUsuario() 