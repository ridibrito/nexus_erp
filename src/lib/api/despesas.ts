import { supabase } from '../supabase'
import { Despesa } from './types'
import { getCurrentEmpresa } from './utils'

export const despesasAPI = {
  // Listar despesas
  async listar(): Promise<Despesa[]> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('despesas')
      .select('*')
      .eq('empresa_id', empresa_id)
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
  async criar(despesa: Omit<Despesa, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Despesa> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('despesas')
      .insert({
        ...despesa,
        empresa_id
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
