import { supabase } from '../supabase'
import { FormaPagamento } from './types'
import { getCurrentEmpresa } from './utils'

export const formasPagamentoAPI = {
  // Listar formas de pagamento
  async listar(): Promise<FormaPagamento[]> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('formas_pagamento')
      .select('*')
      .eq('empresa_id', empresa_id)
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Criar forma de pagamento
  async criar(forma: Omit<FormaPagamento, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<FormaPagamento> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('formas_pagamento')
      .insert({
        ...forma,
        empresa_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar forma de pagamento
  async atualizar(id: string, forma: Partial<FormaPagamento>): Promise<FormaPagamento> {
    const { data, error } = await supabase
      .from('formas_pagamento')
      .update(forma)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar forma de pagamento
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('formas_pagamento')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
