import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

// =====================================================
// TIPOS BASE
// =====================================================

export interface Workspace {
  id: string
  nome: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  workspace_id: string
  nome_fant: string
  nome_fantasia?: string
  razao_social?: string
  cnpj?: string
  inscricao_estadual?: string
  email?: string
  telefone?: string
  endereco?: any
  observacoes?: string
  status?: 'ativo' | 'inativo' | 'prospecto'
  created_at: string
  updated_at?: string
}

export interface Contato {
  id: string
  workspace_id: string
  cliente_id: string
  nome: string
  email?: string
  telefone?: string
  cargo?: string
  is_contato_principal: boolean
  is_contato_cobranca: boolean
  created_at: string
  updated_at: string
}

export interface Pipeline {
  id: string
  workspace_id: string
  nome: string
  descricao?: string
  cor: string
  created_at: string
  updated_at: string
}

export interface PipelineEtapa {
  id: string
  pipeline_id: string
  nome: string
  descricao?: string
  ordem: number
  cor: string
  created_at: string
  updated_at: string
}

export interface Negocio {
  id: string
  workspace_id: string
  cliente_id?: string
  pipeline_id: string
  etapa_id: string
  titulo: string
  descricao?: string
  valor?: number
  probabilidade?: number
  data_prevista_fechamento?: string
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Cobranca {
  id: string
  workspace_id: string
  cliente_id: string
  contato_id?: string
  negocio_id?: string
  numero_nota?: string
  valor: number
  descricao?: string
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada'
  data_emissao: string
  data_vencimento: string
  data_pagamento?: string
  forma_pagamento?: string
  stripe_invoice_id?: string
  stripe_hosted_invoice_url?: string
  nfse_status?: 'pendente' | 'solicitada' | 'emitida' | 'erro'
  nfse_id?: string
  nfse_url_pdf?: string
  created_at: string
  updated_at: string
}

export interface Despesa {
  id: string
  workspace_id: string
  descricao: string
  valor: number
  categoria_id?: string
  fornecedor?: string
  data_vencimento: string
  status: 'a_pagar' | 'paga' | 'cancelada'
  data_pagamento?: string
  forma_pagamento?: string
  created_at: string
  updated_at: string
}

export interface MovimentacaoBancaria {
  id: string
  workspace_id: string
  conta_bancaria_id?: string
  tipo: 'entrada' | 'saida'
  descricao: string
  valor: number
  data_movimentacao: string
  categoria_id?: string
  cobranca_id?: string
  conta_pagar_id?: string
  created_at: string
  updated_at: string
}

export interface CategoriaFinanceira {
  id: string
  workspace_id: string
  nome: string
  tipo: 'receita' | 'despesa'
  descricao?: string
  cor: string
  created_at: string
  updated_at: string
}

export interface FormaPagamento {
  id: string
  workspace_id: string
  nome: string
  descricao?: string
  created_at: string
  updated_at: string
}

export interface CondicaoPagamento {
  id: string
  workspace_id: string
  nome: string
  descricao?: string
  dias_vencimento: number
  created_at: string
  updated_at: string
}

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

async function getCurrentWorkspace(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Primeiro, tente buscar na tabela membros
    try {
      const { data: membros } = await supabase
        .from('membros')
        .select('workspace_id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (membros?.workspace_id) {
        return membros.workspace_id
      }
    } catch (error) {
      console.log('Tabela membros não encontrada, tentando alternativa...')
    }

    // Se não encontrar na tabela membros, tente buscar na tabela workspaces
    try {
      const { data: workspaces } = await supabase
        .from('workspaces')
        .select('id')
        .limit(1)
        .single()

      if (workspaces?.id) {
        return workspaces.id
      }
    } catch (error) {
      console.log('Nenhum workspace encontrado')
    }

    // Se ainda não encontrar, use um workspace padrão (para desenvolvimento)
    console.log('Usando workspace padrão para desenvolvimento')
    return 'default-workspace-id'
  } catch (error) {
    console.error('Erro ao obter workspace:', error)
    return 'default-workspace-id'
  }
}

// =====================================================
// CRUD CLIENTES
// =====================================================

export const clientesAPI = {
  // Listar clientes
  async listar(): Promise<Cliente[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('nome_fant')

    if (error) throw error
    return data || []
  },

  // Buscar cliente por ID
  async buscar(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar cliente
  async criar(cliente: Omit<Cliente, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('clientes')
      .insert({
        ...cliente,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar cliente
  async atualizar(id: string, cliente: Partial<Cliente>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar cliente
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD CONTATOS
// =====================================================

export const contatosAPI = {
  // Listar contatos por cliente
  async listarPorCliente(cliente_id: string): Promise<Contato[]> {
    const { data, error } = await supabase
      .from('contatos')
      .select('*')
      .eq('cliente_id', cliente_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Criar contato
  async criar(contato: Omit<Contato, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Contato> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('contatos')
      .insert({
        ...contato,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar contato
  async atualizar(id: string, contato: Partial<Contato>): Promise<Contato> {
    const { data, error } = await supabase
      .from('contatos')
      .update(contato)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar contato
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('contatos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD PIPELINES
// =====================================================

export const pipelinesAPI = {
  // Listar pipelines
  async listar(): Promise<Pipeline[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('pipelines')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Buscar pipeline com etapas
  async buscarComEtapas(id: string): Promise<{ pipeline: Pipeline; etapas: PipelineEtapa[] } | null> {
    const { data: pipeline, error: pipelineError } = await supabase
      .from('pipelines')
      .select('*')
      .eq('id', id)
      .single()

    if (pipelineError) throw pipelineError

    const { data: etapas, error: etapasError } = await supabase
      .from('pipeline_etapas')
      .select('*')
      .eq('pipeline_id', id)
      .order('ordem')

    if (etapasError) throw etapasError

    return {
      pipeline,
      etapas: etapas || []
    }
  },

  // Criar pipeline
  async criar(pipeline: Omit<Pipeline, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Pipeline> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('pipelines')
      .insert({
        ...pipeline,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar pipeline
  async atualizar(id: string, pipeline: Partial<Pipeline>): Promise<Pipeline> {
    const { data, error } = await supabase
      .from('pipelines')
      .update(pipeline)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar pipeline
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('pipelines')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD NEGÓCIOS
// =====================================================

export const negociosAPI = {
  // Listar negócios
  async listar(): Promise<Negocio[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(nome_fantasia),
        contato:contatos(nome),
        pipeline:pipelines(nome),
        etapa:pipeline_etapas(nome)
      `)
      .eq('workspace_id', workspace_id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Listar negócios por pipeline
  async listarPorPipeline(pipeline_id: string): Promise<Negocio[]> {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(nome_fantasia),
        contato:contatos(nome),
        pipeline:pipelines(nome),
        etapa:pipeline_etapas(nome)
      `)
      .eq('pipeline_id', pipeline_id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar negócio
  async buscar(id: string): Promise<Negocio | null> {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(*),
        contato:contatos(*),
        pipeline:pipelines(*),
        etapa:pipeline_etapas(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar negócio
  async criar(negocio: Omit<Negocio, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Negocio> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('negocios')
      .insert({
        ...negocio,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar negócio
  async atualizar(id: string, negocio: Partial<Negocio>): Promise<Negocio> {
    const { data, error } = await supabase
      .from('negocios')
      .update(negocio)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mover negócio para outra etapa
  async moverParaEtapa(id: string, etapa_id: string): Promise<Negocio> {
    const { data, error } = await supabase
      .from('negocios')
      .update({ etapa_id })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar negócio
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD COBRANÇAS
// =====================================================

export const cobrancasAPI = {
  // Listar cobranças
  async listar(): Promise<Cobranca[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('cobrancas')
      .select(`
        *,
        cliente:clientes(nome_fantasia),
        contato:contatos(nome)
      `)
      .eq('workspace_id', workspace_id)
      .order('data_vencimento', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar cobrança
  async buscar(id: string): Promise<Cobranca | null> {
    const { data, error } = await supabase
      .from('cobrancas')
      .select(`
        *,
        cliente:clientes(*),
        contato:contatos(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar cobrança
  async criar(cobranca: Omit<Cobranca, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Cobranca> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('cobrancas')
      .insert({
        ...cobranca,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar cobrança
  async atualizar(id: string, cobranca: Partial<Cobranca>): Promise<Cobranca> {
    const { data, error } = await supabase
      .from('cobrancas')
      .update(cobranca)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar cobrança
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('cobrancas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD DESPESAS
// =====================================================

export const despesasAPI = {
  // Listar despesas
  async listar(): Promise<Despesa[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('data_vencimento', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar despesa
  async buscar(id: string): Promise<Despesa | null> {
    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar despesa
  async criar(despesa: Omit<Despesa, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<Despesa> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('despesas')
      .insert({
        ...despesa,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar despesa
  async atualizar(id: string, despesa: Partial<Despesa>): Promise<Despesa> {
    const { data, error } = await supabase
      .from('despesas')
      .update(despesa)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar despesa
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('despesas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD CATEGORIAS FINANCEIRAS
// =====================================================

export const categoriasFinanceirasAPI = {
  // Listar categorias
  async listar(): Promise<CategoriaFinanceira[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('categorias_financeiras')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Criar categoria
  async criar(categoria: Omit<CategoriaFinanceira, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<CategoriaFinanceira> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('categorias_financeiras')
      .insert({
        ...categoria,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar categoria
  async atualizar(id: string, categoria: Partial<CategoriaFinanceira>): Promise<CategoriaFinanceira> {
    const { data, error } = await supabase
      .from('categorias_financeiras')
      .update(categoria)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar categoria
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('categorias_financeiras')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// =====================================================
// CRUD FORMAS DE PAGAMENTO
// =====================================================

export const formasPagamentoAPI = {
  // Listar formas de pagamento
  async listar(): Promise<FormaPagamento[]> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('formas_pagamento')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Criar forma de pagamento
  async criar(forma: Omit<FormaPagamento, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>): Promise<FormaPagamento> {
    const workspace_id = await getCurrentWorkspace()
    if (!workspace_id) throw new Error('Workspace não encontrado')

    const { data, error } = await supabase
      .from('formas_pagamento')
      .insert({
        ...forma,
        workspace_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar forma de pagamento
  async atualizar(id: string, forma: Partial<FormaPagamento>): Promise<FormaPagamento> {
    const { data, error } = await supabase
      .from('formas_pagamento')
      .update(forma)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar forma de pagamento
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('formas_pagamento')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 