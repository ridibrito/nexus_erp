import { supabase } from '../supabase'
import { Cliente } from './types'

export const clientesAPI = {
  // Listar clientes (RLS fará o isolamento)
  async listar(): Promise<Cliente[]> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('nome_fant', { ascending: true })

      if (error) {
        console.error('Erro ao listar clientes:', error)
        // Se a tabela não existe ou há outro erro, retornar array vazio
        if (error.message.includes('does not exist') || error.message.includes('relation')) {
          console.log('Tabela clientes não encontrada, retornando array vazio')
          return []
        }
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar clientes:', error)
      // Em caso de erro, retornar array vazio em vez de lançar erro
      return []
    }
  },

  // Buscar cliente por ID
  async buscarPorId(id: string): Promise<Cliente | null> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar cliente:', error)
      return null
    }
  },

  // Criar cliente (RLS garantirá empresa_id correto)
  async criar(cliente: Omit<Cliente, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert(cliente)
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
