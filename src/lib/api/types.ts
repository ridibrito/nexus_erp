export interface Cliente {
  id: string
  empresa_id: string
  tipo: 'pessoa_fisica' | 'pessoa_juridica'
  nome_fant?: string
  nome_fantasia?: string
  razao_social?: string
  nome?: string
  cpf?: string
  cnpj?: string
  inscricao_estadual?: string
  email?: string
  telefone?: string
  endereco?: any
  observacoes?: string
  status?: 'ativo' | 'inativo' | 'prospecto'
  empresa_vinculada_id?: string
  created_at: string
  updated_at?: string
}

export interface Contato {
  id: string
  empresa_id: string
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
  empresa_id: string
  nome: string
  descricao?: string
  cor: string
  created_at: string
  updated_at: string
}

export interface PipelineEtapa {
  id: string
  pipeline_id: string
  empresa_id: string
  nome: string
  descricao?: string
  ordem: number
  cor: string
  created_at: string
  updated_at: string
}

export interface Negocio {
  id: string
  empresa_id: string
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
  empresa_id: string
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
  empresa_id: string
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
  empresa_id: string
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
  empresa_id: string
  nome: string
  tipo: 'receita' | 'despesa'
  descricao?: string
  cor: string
  created_at: string
  updated_at: string
}

export interface FormaPagamento {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  created_at: string
  updated_at: string
}

export interface CondicaoPagamento {
  id: string
  empresa_id: string
  nome: string
  descricao?: string
  dias_vencimento: number
  created_at: string
  updated_at: string
}
