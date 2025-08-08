interface CNPJData {
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  cnae_fiscal: {
    codigo: string
    descricao: string
  }
  cnae_secundario?: Array<{
    codigo: string
    descricao: string
  }>
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  municipio: string
  uf: string
  cep: string
  email?: string
  telefone?: string
  porte: {
    codigo: string
    descricao: string
  }
  natureza_juridica: {
    codigo: string
    descricao: string
  }
  situacao_cadastral: string
  data_situacao_cadastral: string
  motivo_situacao_cadastral?: string
  inscricao_municipal?: string
  inscricao_estadual?: string
  capital_social?: number
  quadro_socios?: Array<{
    nome: string
    qualificacao: string
    pais_origem?: string
    nome_pais_origem?: string
    participacao_societaria?: string
    faixa_etaria?: string
    data_entrada_sociedade?: string
    cpf_cnpj_socio?: string
    representante_legal?: boolean
    desconto_folha_beneficios?: string
  }>
  quadro_administradores?: Array<{
    nome: string
    qualificacao: string
    pais_origem?: string
    nome_pais_origem?: string
    nome_representante_legal?: string
    faixa_etaria?: string
  }>
  estabelecimentos?: Array<{
    cnpj: string
    razao_social: string
    nome_fantasia?: string
    cnae_fiscal: {
      codigo: string
      descricao: string
    }
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    municipio: string
    uf: string
    cep: string
    email?: string
    telefone?: string
    situacao_cadastral: string
    data_situacao_cadastral: string
    inscricao_municipal?: string
    inscricao_estadual?: string
  }>
}

export async function buscarCNPJ(cnpj: string): Promise<CNPJData | null> {
  try {
    // Remove caracteres especiais do CNPJ
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos')
    }

    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CNPJ não encontrado na Receita Federal')
      }
      throw new Error(`Erro na consulta: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error)
    throw error
  }
}

export function formatarCNPJ(cnpj: string): string {
  // Remove caracteres especiais
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
  
  // Aplica máscara: XX.XXX.XXX/XXXX-XX
  return cnpjLimpo.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function validarCNPJ(cnpj: string): boolean {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
  
  if (cnpjLimpo.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpjLimpo)) return false
  
  // Validação do primeiro dígito verificador
  let soma = 0
  let peso = 2
  
  for (let i = 11; i >= 0; i--) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso
    peso = peso === 9 ? 2 : peso + 1
  }
  
  let digito = 11 - (soma % 11)
  if (digito > 9) digito = 0
  
  if (parseInt(cnpjLimpo.charAt(12)) !== digito) return false
  
  // Validação do segundo dígito verificador
  soma = 0
  peso = 2
  
  for (let i = 12; i >= 0; i--) {
    soma += parseInt(cnpjLimpo.charAt(i)) * peso
    peso = peso === 9 ? 2 : peso + 1
  }
  
  digito = 11 - (soma % 11)
  if (digito > 9) digito = 0
  
  return parseInt(cnpjLimpo.charAt(13)) === digito
}
