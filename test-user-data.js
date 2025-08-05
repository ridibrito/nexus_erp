// Script para testar dados do usuário
// Execute com: node test-user-data.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testUserData() {
  console.log('🧪 Testando dados do usuário...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Variáveis de ambiente não configuradas!')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Fazer login
  const email = 'ricardo@coruss.com.br'
  const password = '123456'

  console.log('🔐 Fazendo login...')
  
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

    console.log('✅ Login bem-sucedido!')
    console.log('👤 Usuário:', authData.user.email)
    console.log('🆔 ID:', authData.user.id)

    // Verificar dados do usuário
    console.log('\n📊 Dados do usuário:')
    console.log('- Email:', authData.user.email)
    console.log('- Nome:', authData.user.user_metadata?.name || 'Não definido')
    console.log('- Empresa:', authData.user.user_metadata?.company_name || 'Não definido')
    console.log('- CNPJ:', authData.user.user_metadata?.cnpj || 'Não definido')
    console.log('- Avatar:', authData.user.user_metadata?.avatar_url || 'Não definido')
    console.log('- Data de criação:', authData.user.created_at)
    console.log('- Último login:', authData.user.last_sign_in_at)
    console.log('- Email confirmado:', authData.user.email_confirmed_at ? 'Sim' : 'Não')

    // Verificar metadata completa
    console.log('\n📋 Metadata completa:')
    console.log(JSON.stringify(authData.user.user_metadata, null, 2))

    // Testar atualização de dados
    console.log('\n🔄 Testando atualização de dados...')
    
    const testData = {
      name: 'Ricardo Silva',
      company_name: 'Coruss Ltda',
      cnpj: '12.345.678/0001-90'
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: testData
    })

    if (updateError) {
      console.log('❌ Erro ao atualizar dados:', updateError.message)
    } else {
      console.log('✅ Dados atualizados com sucesso!')
      
      // Buscar dados atualizados
      const { data: updatedUser } = await supabase.auth.getUser()
      console.log('\n📊 Dados atualizados:')
      console.log('- Nome:', updatedUser.user.user_metadata?.name)
      console.log('- Empresa:', updatedUser.user.user_metadata?.company_name)
      console.log('- CNPJ:', updatedUser.user.user_metadata?.cnpj)
    }

    console.log('\n✅ Teste concluído!')
    console.log('📝 Para testar na interface:')
    console.log('   1. Acesse: http://localhost:3000/dashboard/perfil')
    console.log('   2. Verifique se os dados aparecem corretamente')
    console.log('   3. Teste alterar os dados e salvar')
    console.log('   4. Teste alterar a senha')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testUserData() 