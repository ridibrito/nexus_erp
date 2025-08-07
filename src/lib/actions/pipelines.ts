'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '../supabase'

export async function criarPipeline(formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const cor = formData.get('cor') as string

  if (!nome) {
    throw new Error('Nome do pipeline é obrigatório')
  }

  try {
    // Criar pipeline
    const { data: pipeline, error: pipelineError } = await supabase
      .from('pipelines')
      .insert({
        nome,
        descricao,
        cor: cor || '#3B82F6'
      })
      .select()
      .single()

    if (pipelineError) throw pipelineError

    // Criar etapas padrão
    const etapasPadrao = [
      { nome: 'Prospecção', ordem: 1, cor: '#6B7280' },
      { nome: 'Qualificação', ordem: 2, cor: '#F59E0B' },
      { nome: 'Proposta', ordem: 3, cor: '#10B981' },
      { nome: 'Negociação', ordem: 4, cor: '#3B82F6' },
      { nome: 'Fechado', ordem: 5, cor: '#8B5CF6' }
    ]

    for (const etapa of etapasPadrao) {
      await supabase
        .from('pipeline_etapas')
        .insert({
          pipeline_id: pipeline.id,
          ...etapa
        })
    }

    revalidatePath('/configuracoes')
    return { success: true, data: pipeline }
  } catch (error) {
    console.error('Erro ao criar pipeline:', error)
    return { success: false, error: 'Erro ao criar pipeline' }
  }
}

export async function atualizarPipeline(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const descricao = formData.get('descricao') as string
  const cor = formData.get('cor') as string

  try {
    const { data, error } = await supabase
      .from('pipelines')
      .update({
        nome,
        descricao,
        cor
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/configuracoes')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar pipeline:', error)
    return { success: false, error: 'Erro ao atualizar pipeline' }
  }
}

export async function deletarPipeline(id: string) {
  try {
    // Deletar etapas primeiro
    await supabase
      .from('pipeline_etapas')
      .delete()
      .eq('pipeline_id', id)

    // Deletar pipeline
    const { error } = await supabase
      .from('pipelines')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/configuracoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar pipeline:', error)
    return { success: false, error: 'Erro ao deletar pipeline' }
  }
}

export async function atualizarEtapas(pipeline_id: string, etapas: any[]) {
  try {
    // Deletar etapas existentes
    await supabase
      .from('pipeline_etapas')
      .delete()
      .eq('pipeline_id', pipeline_id)

    // Inserir novas etapas
    for (const etapa of etapas) {
      await supabase
        .from('pipeline_etapas')
        .insert({
          pipeline_id,
          nome: etapa.nome,
          ordem: etapa.ordem,
          cor: etapa.cor
        })
    }

    revalidatePath('/configuracoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar etapas:', error)
    return { success: false, error: 'Erro ao atualizar etapas' }
  }
}
