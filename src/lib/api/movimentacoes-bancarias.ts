import { supabase } from '../supabase'
import { MovimentacaoBancaria } from './types'
import { getCurrentEmpresa } from './utils'

export const movimentacoesBancariasAPI = {
  // Listar movimentações bancárias
  async listar(): Promise<MovimentacaoBancaria[]> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('movimentacoes_bancarias')
      .select('*')
      .eq('empresa_id', empresa_id)
      .order('data_movimentacao', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar movimentação bancária
  async buscar(id: string): Promise<MovimentacaoBancaria | null> {
    const { data, error } = await supabase
      .from('movimentacoes_bancarias')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar movimentação bancária
  async criar(movimentacao: Omit<MovimentacaoBancaria, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<MovimentacaoBancaria> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('movimentacoes_bancarias')
      .insert({
        ...movimentacao,
        empresa_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar movimentação bancária
  async atualizar(id: string, movimentacao: Partial<MovimentacaoBancaria>): Promise<MovimentacaoBancaria> {
    const { data, error } = await supabase
      .from('movimentacoes_bancarias')
      .update(movimentacao)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar movimentação bancária
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('movimentacoes_bancarias')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
