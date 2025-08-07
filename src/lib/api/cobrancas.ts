import { supabase } from '../supabase'
import { Cobranca } from './types'
import { getCurrentEmpresa } from './utils'

export const cobrancasAPI = {
  // Listar cobranças
  async listar(): Promise<Cobranca[]> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('cobrancas')
      .select(`
        *,
        cliente:clientes(nome_fant, nome, tipo),
        contato:contatos(nome)
      `)
      .eq('empresa_id', empresa_id)
      .order('data_vencimento', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar cobrança
  async buscar(id: string): Promise<Cobranca | null> {
    const { data, error } = await supabase
      .from('cobrancas')
      .select(`
        *,
        cliente:clientes(*),
        contato:contatos(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar cobrança
  async criar(cobranca: Omit<Cobranca, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Cobranca> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('cobrancas')
      .insert({
        ...cobranca,
        empresa_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar cobrança
  async atualizar(id: string, cobranca: Partial<Cobranca>): Promise<Cobranca> {
    const { data, error } = await supabase
      .from('cobrancas')
      .update(cobranca)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar cobrança
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('cobrancas')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
