import { supabase } from '@/lib/supabase'

export interface Usuario {
  id: string
  email: string
  nome?: string
  avatar_url?: string
  empresa_id: string
  created_at: string
  updated_at: string
}

export const usuariosAPI = {
  async listar(): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        // Se a tabela não existe ou há outro erro, retornar array vazio
        if (error.message.includes('does not exist') || error.message.includes('relation')) {
          console.log('Tabela usuarios não encontrada, retornando array vazio')
          return []
        }
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      // Em caso de erro, retornar array vazio em vez de lançar erro
      return []
    }
  },

  async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar usuário:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      throw error
    }
  },

  async buscarPorEmpresa(empresaId: string): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários da empresa:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar usuários por empresa:', error)
      throw error
    }
  }
}
