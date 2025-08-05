// Script para testar login e redirecionamento
// Execute com: node test-login.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testLogin() {
  console.log('🧪 Testando login e redirecionamento...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Variáveis de ambiente não configuradas!')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Testar login
  const email = 'teste@exemplo.com' // Substitua pelo e-mail que você cadastrou
  const password = '123456' // Substitua pela senha que você usou

  console.log('🔐 Tentando fazer login...')
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.log('❌ Erro no login:', error.message)
      return
    }

    if (data.user) {
      console.log('✅ Login bem-sucedido!')
      console.log('👤 Usuário:', data.user.email)
      console.log('🆔 ID:', data.user.id)
      
      // Verificar sessão
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('🔑 Sessão ativa:', !!sessionData.session)
      
      // Verificar perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.log('⚠️  Erro ao buscar perfil:', profileError.message)
      } else {
        console.log('📋 Perfil encontrado:', profile)
      }
      
      console.log('\n✅ Login funcionando corretamente!')
      console.log('📝 Agora teste no navegador:')
      console.log('1. Acesse: http://localhost:3000/auth/login')
      console.log('2. Use as mesmas credenciais')
      console.log('3. Verifique se é redirecionado para o dashboard')
      
    } else {
      console.log('❌ Nenhum usuário retornado')
    }

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testLogin() 