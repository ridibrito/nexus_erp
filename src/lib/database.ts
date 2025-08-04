import { supabase } from './supabase'

// Tipos para o banco de dados
export interface Empresa {
  id: string
  user_id: string
  razao_social: string
  cnpj: string
  inscricao_municipal?: string
  endereco?: any
  certificado_path?: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: string
  empresa_id: string
  nome_razao_social: string
  cpf_cnpj?: string
  email?: string
  endereco?: any
  created_at: string
  updated_at: string
}

export interface Cobranca {
  id: string
  cliente_id: string
  empresa_id: string
  valor: number
  descricao?: string
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada'
  data_vencimento: string
  data_pagamento?: string
  stripe_invoice_id?: string
  stripe_hosted_invoice_url?: string
  nfse_status?: string
  nfse_id?: string
  nfse_url_pdf?: string
  created_at: string
  updated_at: string
}

export interface ContaAPagar {
  id: string
  empresa_id: string
  descricao: string
  valor: number
  categoria?: string
  data_vencimento: string
  status: 'a_pagar' | 'paga'
  data_pagamento?: string
  created_at: string
  updated_at: string
}

// Funções para buscar dados do dashboard
export async function getDashboardData(userId: string) {
  try {
    // Buscar empresa do usuário
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (empresaError) throw empresaError

    // Buscar métricas financeiras
    const { data: cobrancas, error: cobrancasError } = await supabase
      .from('cobrancas')
      .select('*')
      .eq('empresa_id', empresa.id)

    if (cobrancasError) throw cobrancasError

    // Buscar contas a pagar
    const { data: contasAPagar, error: contasError } = await supabase
      .from('contas_a_pagar')
      .select('*')
      .eq('empresa_id', empresa.id)

    if (contasError) throw contasError

    // Calcular métricas
    const faturamentoMes = cobrancas
      ?.filter(c => c.status === 'paga' && 
        new Date(c.data_pagamento!).getMonth() === new Date().getMonth())
      .reduce((sum, c) => sum + c.valor, 0) || 0

    const contasReceber = cobrancas
      ?.filter(c => c.status === 'pendente')
      .reduce((sum, c) => sum + c.valor, 0) || 0

    const totalDespesas = contasAPagar
      ?.filter(c => c.status === 'paga' && 
        new Date(c.data_pagamento!).getMonth() === new Date().getMonth())
      .reduce((sum, c) => sum + c.valor, 0) || 0

    const lucroLiquido = faturamentoMes - totalDespesas

    // Buscar cobranças recentes
    const cobrancasRecentes = cobrancas
      ?.filter(c => c.status === 'pendente')
      .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
      .slice(0, 5) || []

    return {
      empresa,
      metrics: {
        faturamentoMes,
        contasReceber,
        totalDespesas,
        lucroLiquido
      },
      cobrancasRecentes,
      contasAPagar: contasAPagar || []
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    throw error
  }
}

// Funções para clientes
export async function getClientes(empresaId: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createCliente(cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funções para cobranças
export async function getCobrancas(empresaId: string) {
  const { data, error } = await supabase
    .from('cobrancas')
    .select(`
      *,
      clientes (
        nome_razao_social,
        cpf_cnpj
      )
    `)
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createCobranca(cobranca: Omit<Cobranca, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('cobrancas')
    .insert(cobranca)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCobranca(id: string, updates: Partial<Cobranca>) {
  const { data, error } = await supabase
    .from('cobrancas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Funções para empresa
export async function getEmpresa(userId: string) {
  const { data, error } = await supabase
    .from('empresas')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateEmpresa(id: string, updates: Partial<Empresa>) {
  const { data, error } = await supabase
    .from('empresas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
} 