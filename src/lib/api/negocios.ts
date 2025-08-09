import { supabase } from '../supabase'
import { Negocio } from './types'
import { getCurrentEmpresa } from './utils'

export const negociosAPI = {
  // Listar negócios (RLS fará o isolamento)
  async listar(): Promise<Negocio[]> {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(nome_fant, nome, tipo),
        contato:contatos(nome),
        pipeline:pipelines(nome),
        etapa:pipeline_etapas(nome)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Listar negócios por pipeline
  async listarPorPipeline(pipeline_id: string): Promise<Negocio[]> {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(nome_fant, nome, tipo),
        contato:contatos(nome),
        pipeline:pipelines(nome),
        etapa:pipeline_etapas(nome)
      `)
      .eq('pipeline_id', pipeline_id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Buscar negócio
  async buscar(id: string): Promise<Negocio | null> {
    const { data, error } = await supabase
      .from('negocios')
      .select(`
        *,
        cliente:clientes(*),
        contato:contatos(*),
        pipeline:pipelines(*),
        etapa:pipeline_etapas(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar negócio
  async criar(negocio: Omit<Negocio, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Negocio> {
    const empresa_id = await getCurrentEmpresa()
    if (!empresa_id) throw new Error('Empresa não encontrada')

    const { data, error } = await supabase
      .from('negocios')
      .insert({
        ...negocio,
        empresa_id
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar negócio
  async atualizar(id: string, negocio: Partial<Negocio>): Promise<Negocio> {
    const { data, error } = await supabase
      .from('negocios')
      .update(negocio)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Mover negócio para outra etapa
  async moverParaEtapa(id: string, etapa_id: string): Promise<Negocio> {
    const { data, error } = await supabase
      .from('negocios')
      .update({ etapa_id })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar negócio
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
