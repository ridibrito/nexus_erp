import { supabase } from '../supabase'
import { Cliente } from './types'

export const clientesAPI = {
  // Listar clientes (RLS fará o isolamento)
  async listar(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
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
