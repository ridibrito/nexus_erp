import { supabase } from '../supabase'
import { Pipeline, PipelineEtapa } from './types'

export const pipelinesAPI = {
  // Listar pipelines (RLS fará o isolamento)
  async listar(): Promise<Pipeline[]> {
    const { data, error } = await supabase
      .from('pipelines')
      .select('*')
      .order('nome')

    if (error) throw error
    return data || []
  },

  // Buscar pipeline com etapas
  async buscarComEtapas(id: string): Promise<{ pipeline: Pipeline; etapas: PipelineEtapa[] } | null> {
    try {
      const { data: pipeline, error: pipelineError } = await supabase
        .from('pipelines')
        .select('*')
        .eq('id', id)
        .single()

      if (pipelineError) throw pipelineError

      const { data: etapas, error: etapasError } = await supabase
        .from('pipeline_etapas')
        .select('*')
        .eq('pipeline_id', id)
        .order('ordem')

      if (etapasError) throw etapasError

      return {
        pipeline,
        etapas: etapas || []
      }
    } catch (error) {
      console.error('Erro em buscarComEtapas:', error)
      throw error
    }
  },

  // Criar pipeline (RLS garantirá empresa_id correto)
  async criar(pipeline: Omit<Pipeline, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>): Promise<Pipeline> {
    const { data, error } = await supabase
      .from('pipelines')
      .insert(pipeline)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar pipeline
  async atualizar(id: string, pipeline: Partial<Pipeline>): Promise<Pipeline> {
    const { data, error } = await supabase
      .from('pipelines')
      .update(pipeline)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar pipeline
  async deletar(id: string): Promise<void> {
    const { error } = await supabase
      .from('pipelines')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
