// Script para testar configurações
// Execute com: node test-configuracoes.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

async function testConfiguracoes() {
  console.log('🧪 Testando configurações...\n')

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

    // Verificar dados atuais
    console.log('\n📊 Dados atuais do usuário:')
    console.log('- Email:', authData.user.email)
    console.log('- Nome:', authData.user.user_metadata?.name || 'Não definido')
    console.log('- Empresa:', authData.user.user_metadata?.company_name || 'Não definido')
    console.log('- CNPJ:', authData.user.user_metadata?.cnpj || 'Não definido')
    console.log('- Razão Social:', authData.user.user_metadata?.razao_social || 'Não definido')
    console.log('- Nome Fantasia:', authData.user.user_metadata?.nome_fantasia || 'Não definido')

    // Testar atualização de dados da empresa
    console.log('\n🔄 Testando atualização de dados da empresa...')
    
    const empresaData = {
      razao_social: 'Nexus ERP Ltda',
      nome_fantasia: 'Nexus ERP',
      cnpj: '12.345.678/0001-90',
      inscricao_estadual: '123.456.789.012',
      email_empresa: 'contato@nexuserp.com.br',
      telefone: '(11) 99999-9999',
      endereco: 'Rua das Tecnologias, 123 - São Paulo/SP - CEP: 01234-567'
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: empresaData
    })

    if (updateError) {
      console.log('❌ Erro ao atualizar dados da empresa:', updateError.message)
    } else {
      console.log('✅ Dados da empresa atualizados com sucesso!')
      
      // Buscar dados atualizados
      const { data: updatedUser } = await supabase.auth.getUser()
      console.log('\n📊 Dados atualizados:')
      console.log('- Razão Social:', updatedUser.user.user_metadata?.razao_social)
      console.log('- Nome Fantasia:', updatedUser.user.user_metadata?.nome_fantasia)
      console.log('- CNPJ:', updatedUser.user.user_metadata?.cnpj)
      console.log('- Inscrição Estadual:', updatedUser.user.user_metadata?.inscricao_estadual)
      console.log('- Email Empresa:', updatedUser.user.user_metadata?.email_empresa)
      console.log('- Telefone:', updatedUser.user.user_metadata?.telefone)
      console.log('- Endereço:', updatedUser.user.user_metadata?.endereco)
    }

    // Testar configurações de pagamento
    console.log('\n💳 Testando configurações de pagamento...')
    
    const pagamentoData = {
      gateway_config: {
        gateway: 'stripe',
        chave_publica: 'pk_test_123456789',
        chave_secreta: 'sk_test_123456789',
        webhook_url: 'https://seu-dominio.com/webhook',
        modo: 'sandbox'
      }
    }

    const { error: pagamentoError } = await supabase.auth.updateUser({
      data: pagamentoData
    })

    if (pagamentoError) {
      console.log('❌ Erro ao atualizar dados de pagamento:', pagamentoError.message)
    } else {
      console.log('✅ Dados de pagamento atualizados com sucesso!')
    }

    // Testar configurações de integração
    console.log('\n🔌 Testando configurações de integração...')
    
    const integracaoData = {
      integracoes_config: {
        email_smtp: 'smtp.gmail.com',
        email_porta: '587',
        email_usuario: 'contato@nexuserp.com.br',
        email_senha: 'senha123',
        whatsapp_token: 'token_whatsapp_123',
        telegram_bot: 'bot_telegram_123'
      }
    }

    const { error: integracaoError } = await supabase.auth.updateUser({
      data: integracaoData
    })

    if (integracaoError) {
      console.log('❌ Erro ao atualizar dados de integração:', integracaoError.message)
    } else {
      console.log('✅ Dados de integração atualizados com sucesso!')
    }

    // Testar configurações de segurança
    console.log('\n🔒 Testando configurações de segurança...')
    
    const segurancaData = {
      seguranca_config: {
        backup_automatico: 'diario',
        sessao_timeout: 30,
        autenticacao_2fa: true,
        notificacoes_email: true,
        login_attempts: 3,
        password_expiry: 90
      }
    }

    const { error: segurancaError } = await supabase.auth.updateUser({
      data: segurancaData
    })

    if (segurancaError) {
      console.log('❌ Erro ao atualizar dados de segurança:', segurancaError.message)
    } else {
      console.log('✅ Dados de segurança atualizados com sucesso!')
    }

    console.log('\n✅ Teste concluído!')
    console.log('📝 Para testar na interface:')
    console.log('   1. Acesse: http://localhost:3000/dashboard/configuracoes')
    console.log('   2. Navegue pelas abas: Empresa, Pagamentos, Integrações, Permissões, Segurança')
    console.log('   3. Verifique se os dados aparecem corretamente')
    console.log('   4. Teste alterar os dados e salvar')

  } catch (error) {
    console.log('❌ Erro inesperado:', error.message)
  }
}

testConfiguracoes() 