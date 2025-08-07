import { supabase } from '../supabase'
import { Contato } from './types'
import { getCurrentEmpresa } from './utils'

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
  async criar(contato: Omit<Contato, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Contato> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('contatos')
      .insert({
        ...contato,
        empresa_id
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
