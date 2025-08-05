export interface Empresa {
  id: string
  user_id: string
  razao_social: string
  cnpj: string
  inscricao_municipal?: string
  endereco?: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  certificado_path?: string
  created_at: string
}

export interface Cliente {
  id: string
  empresa_id: string
  nome_razao_social: string
  cpf_cnpj?: string
  email?: string
  endereco?: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    uf: string
    cep: string
  }
  created_at: string
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
  nfse_status?: 'solicitada' | 'emitida' | 'erro'
  nfse_id?: string
  nfse_url_pdf?: string
  created_at: string
  cliente?: Cliente
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
}

export interface DashboardData {
  faturamentoMes: number
  contasReceber: number
  totalDespesas: number
  lucroLiquido: number
  receitasUltimos30Dias: Array<{
    data: string
    receitas: number
    despesas: number
  }>
  despesasPorCategoria: Array<{
    categoria: string
    valor: number
  }>
}

export interface StripeIntegration {
  connected: boolean
  account_id?: string
  charges_enabled?: boolean
  payouts_enabled?: boolean
}

export interface NFSeData {
  numero: string
  codigo_verificacao: string
  url_pdf: string
  xml: string
} 