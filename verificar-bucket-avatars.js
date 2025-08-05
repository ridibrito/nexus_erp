// Script para verificar bucket avatars
// Execute com: node verificar-bucket-avatars.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function verificarBucketAvatars() {
  console.log('🔍 Verificando bucket avatars...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Variáveis de ambiente não configuradas!')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // 1. Verificar se o bucket existe
    console.log('📦 Verificando buckets disponíveis...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.log('❌ Erro ao listar buckets:', bucketError.message)
      return
    }

    console.log('📊 Buckets encontrados:', buckets.map(b => b.name))
    
    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars')
    
    if (!avatarsBucket) {
      console.log('❌ Bucket "avatars" não encontrado!')
      console.log('\n📝 Para criar o bucket:')
      console.log('   1. Vá para Storage no Supabase Dashboard')
      console.log('   2. Clique em "New bucket"')
      console.log('   3. Nome: avatars')
      console.log('   4. Público: true')
      console.log('   5. Execute o script configurar-avatar-bucket.sql')
      return
    }

    console.log('✅ Bucket "avatars" encontrado!')
    console.log('📋 Configurações do bucket:')
    console.log('- Nome:', avatarsBucket.name)
    console.log('- Público:', avatarsBucket.public)
    console.log('- ID:', avatarsBucket.id)

    // 2. Verificar políticas RLS
    console.log('\n🔒 Verificando políticas RLS...')
    
    // Tentar listar arquivos para testar permissões
    const { data: files, error: filesError } = await supabase.storage
      .from('avatars')
      .list('', { limit: 10 })

    if (filesError) {
      console.log('❌ Erro ao listar arquivos:', filesError.message)
      console.log('💡 Isso pode indicar problemas com políticas RLS')
      console.log('📝 Execute o script configurar-avatar-bucket.sql')
    } else {
      console.log('✅ Políticas RLS funcionando!')
      console.log('📄 Arquivos no bucket:', files.length)
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 0} bytes)`)
      })
    }

    // 3. Testar upload (se houver usuário logado)
    console.log('\n🧪 Testando permissões de upload...')
    
    // Fazer login para testar
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'ricardo@coruss.com.br',
      password: '123456'
    })

    if (authError) {
      console.log('❌ Erro no login:', authError.message)
      return
    }

    if (authData.user) {
      console.log('✅ Login bem-sucedido!')
      console.log('👤 Usuário:', authData.user.email)
      console.log('🆔 ID:', authData.user.id)

      // Testar upload de arquivo pequeno
      const testFile = new Blob(['test'], { type: 'text/plain' })
      const fileName = `${authData.user.id}/test-${Date.now()}.txt`
      
      console.log('📤 Testando upload...')
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, testFile)

      if (uploadError) {
        console.log('❌ Erro no upload de teste:', uploadError.message)
        console.log('💡 Verifique as políticas RLS no script configurar-avatar-bucket.sql')
      } else {
        console.log('✅ Upload de teste bem-sucedido!')
        
        // Remover arquivo de teste
        await supabase.storage
          .from('avatars')
          .remove([fileName])
        console.log('🗑️ Arquivo de teste removido')
      }
    }

    console.log('\n✅ Verificação concluída!')
    console.log('📝 Se tudo estiver OK, o upload de avatar deve funcionar')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

verificarBucketAvatars() 