'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function criarCliente(formData: FormData) {
  // Criar cliente Supabase com cookies explícitos
  const cookieStore = await cookies()
  const supabase = createClient()
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    console.log('🔍 Verificando autenticação...')
    console.log('👤 User:', user)
    console.log('❌ Auth Error:', authError)
    console.log('🍪 Cookies disponíveis:', cookieStore.getAll().map(c => c.name))
    
    // Se não há usuário mas também não há erro, tentar obter sessão
    if (!user && !authError) {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('🔍 Tentando obter sessão...')
      console.log('📋 Session:', session)
      console.log('❌ Session Error:', sessionError)
      
      if (session?.user) {
        console.log('✅ Usuário encontrado via sessão:', session.user.id)
        // Continuar com o usuário da sessão
      } else {
        console.error('❌ Nenhuma sessão válida encontrada')
        return { success: false, error: 'Usuário não autenticado' }
      }
    }
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError)
      return { success: false, error: `Erro de autenticação: ${authError.message}` }
    }
    
    if (!user) {
      console.error('❌ Usuário não autenticado')
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Extrair dados do formulário
    const tipo = formData.get('tipo') as string
    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string
    const cpf = formData.get('cpf') as string
    const cnpj = formData.get('cnpj') as string
    const endereco = formData.get('endereco') as string

    // Validação básica
    if (!nome || !email) {
      return { success: false, error: 'Nome e email são obrigatórios' }
    }

    // Preparar dados do cliente
    const clienteData: any = {
      empresa_id: '00000000-0000-0000-0000-000000000000', // UUID fixo para teste
      tipo,
      email,
      telefone: telefone || null,
      status: 'ativo'
    }

    // Definir nome baseado no tipo
    if (tipo === 'pessoa_fisica') {
      clienteData.nome = nome
      if (cpf) clienteData.cpf = cpf.replace(/\D/g, '')
    } else {
      clienteData.razao_social = nome
      if (cnpj) clienteData.cnpj = cnpj.replace(/\D/g, '')
    }

    // Adicionar endereço se fornecido
    if (endereco) {
      try {
        clienteData.endereco = JSON.parse(endereco)
      } catch {
        clienteData.endereco = { endereco }
      }
    }

    console.log('📝 Dados do cliente:', clienteData)

    // Inserir cliente
    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert(clienteData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro Supabase:', error)
      return { success: false, error: `Erro ao criar cliente: ${error.message}` }
    }

    console.log('✅ Cliente criado:', cliente)
    revalidatePath('/clientes')
    
    return { success: true, data: cliente }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function atualizarCliente(id: string, formData: FormData) {
  const supabase = createClient()
  const tipo = formData.get('tipo') as 'pessoa_fisica' | 'pessoa_juridica'
  const nome = formData.get('nome') as string
  const cpf = formData.get('cpf') as string
  const cnpj = formData.get('cnpj') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string
  const endereco = formData.get('endereco') as string

  try {
    // Preparar dados do cliente baseado no tipo
    const clienteData: any = {
      tipo,
      email,
      telefone,
      endereco: endereco ? JSON.parse(endereco) : null
    }

    // Adicionar campos específicos do tipo
    if (tipo === 'pessoa_fisica') {
      clienteData.nome = nome
      if (cpf) clienteData.cpf = cpf
    } else {
      clienteData.razao_social = nome
      if (cnpj) clienteData.cnpj = cnpj
    }

    const { data, error } = await supabase
      .from('clientes')
      .update(clienteData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/clientes')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return { success: false, error: 'Erro ao atualizar cliente' }
  }
}

export async function deletarCliente(id: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: `Erro ao deletar cliente: ${error.message}` }
    }

    revalidatePath('/clientes')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function vincularPessoaEmpresa(clienteId: string, pessoaEmpresaId: string, tipo: 'pessoa' | 'empresa') {
  const supabase = createClient()
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('❌ Erro de autenticação:', authError)
      return { success: false, error: 'Usuário não autenticado' }
    }

    console.log('✅ Usuário autenticado:', user.id)

    // Criar vinculação na tabela de relacionamentos
    const { error } = await supabase
      .from('cliente_vinculacoes')
      .insert({
        cliente_id: clienteId,
        vinculado_id: pessoaEmpresaId,
        tipo_vinculacao: tipo,
        created_by: user.id
      })

    if (error) {
      console.error('❌ Erro ao vincular:', error)
      return { success: false, error: `Erro ao vincular: ${error.message}` }
    }

    console.log('✅ Vinculação criada com sucesso')
    revalidatePath(`/clientes/${clienteId}`)
    return { success: true }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function buscarVinculacoes(clienteId: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('cliente_vinculacoes')
      .select(`
        *,
        cliente:clientes!cliente_id(*),
        vinculado:clientes!vinculado_id(*)
      `)
      .eq('cliente_id', clienteId)

    if (error) {
      console.error('❌ Erro ao buscar vinculações:', error)
      return { success: false, error: `Erro ao buscar vinculações: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function criarNegocio(formData: FormData) {
  const supabase = createClient()
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Extrair dados do formulário
    const clienteId = formData.get('cliente_id') as string
    const nome = formData.get('nome') as string
    const valor = formData.get('valor') as string
    const probabilidade = formData.get('probabilidade') as string
    const dataFechamento = formData.get('data_fechamento') as string

    // Validação básica
    if (!nome || !clienteId) {
      return { success: false, error: 'Nome e cliente são obrigatórios' }
    }

    // Preparar dados do negócio
    const negocioData = {
      cliente_id: clienteId,
      nome,
      valor_estimado: valor ? parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')) : 0,
      probabilidade: probabilidade ? parseInt(probabilidade) : 0,
      data_fechamento: dataFechamento || null,
      status: 'ativo',
      created_by: user.id
    }

    console.log('📝 Dados do negócio:', negocioData)

    // Inserir negócio
    const { data: negocio, error } = await supabase
      .from('negocios')
      .insert(negocioData)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro Supabase:', error)
      return { success: false, error: `Erro ao criar negócio: ${error.message}` }
    }

    console.log('✅ Negócio criado:', negocio)
    revalidatePath(`/clientes/${clienteId}`)
    
    return { success: true, data: negocio }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function buscarNegocios(clienteId: string) {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .from('negocios')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar negócios:', error)
      return { success: false, error: `Erro ao buscar negócios: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function buscarClientesParaVincular(tipo: 'pessoa' | 'empresa', termo?: string) {
  const supabase = createClient()
  
  try {
    let query = supabase
      .from('clientes')
      .select('*')
      .order('nome', { ascending: true })

    // Filtrar por tipo
    if (tipo === 'pessoa') {
      query = query.eq('tipo', 'pessoa_fisica')
    } else {
      query = query.eq('tipo', 'pessoa_juridica')
    }

    // Filtrar por termo de busca se fornecido
    if (termo) {
      query = query.or(`nome.ilike.%${termo}%,razao_social.ilike.%${termo}%,nome_fant.ilike.%${termo}%,email.ilike.%${termo}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar clientes:', error)
      return { success: false, error: `Erro ao buscar clientes: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function atualizarClienteDetalhes(clienteId: string, formData: FormData) {
  const supabase = createClient()
  
  try {
    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('❌ Erro de autenticação:', authError)
      return { success: false, error: 'Usuário não autenticado' }
    }

    console.log('✅ Usuário autenticado:', user.id)

    // Extrair dados do formulário
    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string
    const cpf = formData.get('cpf') as string
    const cnpj = formData.get('cnpj') as string
    const razao_social = formData.get('razao_social') as string
    const nome_fant = formData.get('nome_fant') as string
    const observacoes = formData.get('observacoes') as string
    const avatar = formData.get('avatar') as string
    const responsavel_id = formData.get('responsavel_id') as string
    const endereco = formData.get('endereco') as string

    // Validação básica
    if (!nome && !razao_social) {
      return { success: false, error: 'Nome é obrigatório' }
    }

    if (!email) {
      return { success: false, error: 'Email é obrigatório' }
    }

    // Preparar dados do cliente
    const clienteData: any = {
      email,
      telefone: telefone || null,
      observacoes: observacoes || null
    }

    // Adicionar avatar se fornecido
    if (avatar) {
      clienteData.avatar = avatar
    }

    // Adicionar responsável se fornecido
    if (responsavel_id) {
      clienteData.responsavel_id = responsavel_id
    }

    // Adicionar endereço se fornecido
    if (endereco) {
      try {
        const enderecoObj = JSON.parse(endereco)
        clienteData.endereco = enderecoObj
      } catch (error) {
        console.error('❌ Erro ao processar endereço:', error)
        return { success: false, error: 'Formato de endereço inválido' }
      }
    }

    // Adicionar campos específicos do tipo
    const { data: clienteAtual } = await supabase
      .from('clientes')
      .select('tipo')
      .eq('id', clienteId)
      .single()

    if (clienteAtual?.tipo === 'pessoa_fisica') {
      clienteData.nome = nome
      if (cpf) clienteData.cpf = cpf.replace(/\D/g, '')
    } else {
      clienteData.razao_social = razao_social
      if (nome_fant) clienteData.nome_fant = nome_fant
      if (cnpj) clienteData.cnpj = cnpj.replace(/\D/g, '')
    }

    console.log('📝 Dados do cliente para atualizar:', clienteData)

    // Atualizar cliente
    const { data: cliente, error } = await supabase
      .from('clientes')
      .update(clienteData)
      .eq('id', clienteId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro Supabase:', error)
      return { success: false, error: `Erro ao atualizar cliente: ${error.message}` }
    }

    console.log('✅ Cliente atualizado:', cliente)
    revalidatePath(`/clientes/${clienteId}`)
    
    return { success: true, data: cliente }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
