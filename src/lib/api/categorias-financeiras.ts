import { supabase } from '../supabase'
import { CategoriaFinanceira } from './types'
import { getCurrentEmpresa } from './utils'

export const categoriasFinanceirasAPI = {
  // Listar categorias
  async listar(): Promise<CategoriaFinanceira[]> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('categorias_financeiras')
      .select('*')
      .eq('empresa_id', empresa_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Criar categoria
  async criar(categoria: Omit<CategoriaFinanceira, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<CategoriaFinanceira> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('categorias_financeiras')
      .insert({
        ...categoria,
        empresa_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar categoria
  async atualizar(id: string, categoria: Partial<CategoriaFinanceira>): Promise<CategoriaFinanceira> {
    const { data, error } = await supabase
      .from('categorias_financeiras')
      .update(categoria)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar categoria
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('categorias_financeiras')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
