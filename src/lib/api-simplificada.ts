import { supabase } from './supabase'

// =====================================================
// API SIMPLIFICADA - Empresas e Usuários
// =====================================================

// Tipos simplificados
export interface Empresa {
  id: string
  nome: string
  razao_social?: string
  nome_fantasia?: string
  cnpj?: string
  inscricao_estadual?: string
  email?: string
  telefone?: string
  endereco?: any
  avatar_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Usuario {
  id: string
  empresa_id: string
  auth_user_id?: string
  nome: string
  email: string
  cargo?: string
  telefone?: string
  avatar_url?: string
  role: 'admin' | 'membro' | 'usuario'
  is_active: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// FUNÇÕES DA EMPRESA
// =====================================================

export async function getCurrentEmpresa(): Promise<Empresa | null> {
  try {
    // Buscar empresa do usuário atual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('empresa_id')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!usuario) return null

    const { data: empresa } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', usuario.empresa_id)
      .eq('is_active', true)
      .single()

    return empresa
  } catch (error) {
    console.error('Erro ao buscar empresa atual:', error)
    return null
  }
}

export async function getEmpresaById(id: string): Promise<Empresa | null> {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar empresa:', error)
    return null
  }
}

export async function updateEmpresa(id: string, dados: Partial<Empresa>): Promise<Empresa | null> {
  try {
    const { data, error } = await supabase
      .from('empresas')
      .update({ ...dados, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error)
    return null
  }
}

// =====================================================
// FUNÇÕES DOS USUÁRIOS
// =====================================================

export async function getUsuariosEmpresa(empresaId: string): Promise<Usuario[]> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('is_active', true)
      .order('nome')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar usuários:', error)
    return []
  }
}

export async function getUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return null
  }
}

export async function createUsuario(dados: Omit<Usuario, 'id' | 'created_at' | 'updated_at'>): Promise<Usuario | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert(dados)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return null
  }
}

export async function updateUsuario(id: string, dados: Partial<Usuario>): Promise<Usuario | null> {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ ...dados, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return null
  }
}

export async function deleteUsuario(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('usuarios')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return false
  }
}

// =====================================================
// FUNÇÕES DE AUTENTICAÇÃO SIMPLIFICADA
// =====================================================

export async function getCurrentUser(): Promise<Usuario | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', user.id)
      .eq('is_active', true)
      .single()

    return usuario
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error)
    return null
  }
}

// =====================================================
// FUNÇÕES DE DADOS RELACIONADOS
// =====================================================

export async function getClientesEmpresa(empresaId: string) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome_fantasia')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar clientes:', error)
    return []
  }
}

export async function getNegociosEmpresa(empresaId: string) {
  try {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(nome_fantasia),
        contato:contatos(nome),
        pipeline:pipelines(nome),
        etapa:pipeline_etapas(nome)
      `)
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar negócios:', error)
    return []
  }
}

export async function getPipelinesEmpresa(empresaId: string) {
  try {
    const { data, error } = await supabase
      .from('pipelines')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('nome')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar pipelines:', error)
    return []
  }
} 