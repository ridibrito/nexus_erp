// Script para testar upload de avatar
// Execute com: node test-avatar-upload.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testAvatarUpload() {
  console.log('🧪 Testando upload de avatar...\n')

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

    // Verificar bucket avatars
    console.log('\n📦 Verificando bucket avatars...')
    
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.log('❌ Erro ao listar buckets:', bucketError.message)
      return
    }

    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (!avatarsBucket) {
      console.log('❌ Bucket "avatars" não encontrado!')
      console.log('📝 Crie o bucket manualmente no Supabase Dashboard:')
      console.log('   1. Vá para Storage no Supabase')
      console.log('   2. Clique em "New bucket"')
      console.log('   3. Nome: avatars')
      console.log('   4. Público: true')
      console.log('   5. Execute o script configurar-avatar-bucket.sql')
      return
    }

    console.log('✅ Bucket "avatars" encontrado!')
    console.log('📊 Buckets disponíveis:', buckets.map(b => b.name))

    // Verificar avatar atual
    console.log('\n👤 Avatar atual do usuário:')
    console.log('- URL:', authData.user.user_metadata?.avatar_url || 'Nenhum')
    console.log('- Metadata:', authData.user.user_metadata)

    // Listar arquivos no bucket (se houver)
    console.log('\n📁 Arquivos no bucket avatars:')
    
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 10 })

    if (filesError) {
      console.log('❌ Erro ao listar arquivos:', filesError.message)
    } else {
      console.log('📄 Arquivos encontrados:', files.length)
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 0} bytes)`)
      })
    }

    console.log('\n✅ Teste concluído!')
    console.log('📝 Para testar o upload:')
    console.log('   1. Acesse: http://localhost:3000/dashboard/perfil')
    console.log('   2. Clique em "Upload" no componente de avatar')
    console.log('   3. Selecione uma imagem')
    console.log('   4. Verifique se o upload funciona')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testAvatarUpload() 