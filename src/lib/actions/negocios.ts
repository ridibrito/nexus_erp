'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '../supabase'

export async function criarNegocio(formData: FormData) {
  const titulo = formData.get('titulo') as string
  const descricao = formData.get('descricao') as string
  const cliente_id = formData.get('cliente_id') as string
  const pipeline_id = formData.get('pipeline_id') as string
  const etapa_id = formData.get('etapa_id') as string
  const valor = parseFloat(formData.get('valor') as string) || 0
  const probabilidade = parseInt(formData.get('probabilidade') as string) || 0
  const data_prevista_fechamento = formData.get('data_prevista_fechamento') as string
  const observacoes = formData.get('observacoes') as string

  if (!titulo || !pipeline_id || !etapa_id) {
    throw new Error('Título, pipeline e etapa são obrigatórios')
  }

  try {
    const { data, error } = await supabase
      .from('negocios')
      .insert({
        titulo,
        descricao,
        cliente_id: cliente_id || null,
        pipeline_id,
        etapa_id,
        valor,
        probabilidade,
        data_prevista_fechamento: data_prevista_fechamento || null,
        observacoes
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/negocios')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar negócio:', error)
    return { success: false, error: 'Erro ao criar negócio' }
  }
}

export async function atualizarNegocio(id: string, formData: FormData) {
  const titulo = formData.get('titulo') as string
  const descricao = formData.get('descricao') as string
  const cliente_id = formData.get('cliente_id') as string
  const pipeline_id = formData.get('pipeline_id') as string
  const etapa_id = formData.get('etapa_id') as string
  const valor = parseFloat(formData.get('valor') as string) || 0
  const probabilidade = parseInt(formData.get('probabilidade') as string) || 0
  const data_prevista_fechamento = formData.get('data_prevista_fechamento') as string
  const observacoes = formData.get('observacoes') as string

  try {
    const { data, error } = await supabase
      .from('negocios')
      .update({
        titulo,
        descricao,
        cliente_id: cliente_id || null,
        pipeline_id,
        etapa_id,
        valor,
        probabilidade,
        data_prevista_fechamento: data_prevista_fechamento || null,
        observacoes
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/negocios')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar negócio:', error)
    return { success: false, error: 'Erro ao atualizar negócio' }
  }
}

export async function moverNegocio(id: string, etapa_id: string) {
  try {
    const { data, error } = await supabase
      .from('negocios')
      .update({ etapa_id })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/negocios')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao mover negócio:', error)
    return { success: false, error: 'Erro ao mover negócio' }
  }
}

export async function deletarNegocio(id: string) {
  try {
    const { error } = await supabase
      .from('negocios')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/negocios')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar negócio:', error)
    return { success: false, error: 'Erro ao deletar negócio' }
  }
}
