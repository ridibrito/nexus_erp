'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from '../supabase'
import { Cliente } from '../api/types'

export async function criarCliente(formData: FormData) {
  const tipo = formData.get('tipo') as 'pessoa_fisica' | 'pessoa_juridica'
  const nome_fant = formData.get('nome_fant') as string
  const nome = formData.get('nome') as string
  const cpf = formData.get('cpf') as string
  const cnpj = formData.get('cnpj') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string

  // Validação
  if (tipo === 'pessoa_juridica' && !nome_fant) {
    throw new Error('Nome fantasia é obrigatório para pessoa jurídica')
  }
  if (tipo === 'pessoa_fisica' && !nome) {
    throw new Error('Nome é obrigatório para pessoa física')
  }

  try {
    const { data, error } = await supabase
      .from('clientes')
      .insert({
        tipo,
        nome_fant: tipo === 'pessoa_juridica' ? nome_fant : null,
        nome: tipo === 'pessoa_fisica' ? nome : null,
        cpf: tipo === 'pessoa_fisica' ? cpf : null,
        cnpj: tipo === 'pessoa_juridica' ? cnpj : null,
        email,
        telefone
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath('/clientes')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
    return { success: false, error: 'Erro ao criar cliente' }
  }
}

export async function atualizarCliente(id: string, formData: FormData) {
  const tipo = formData.get('tipo') as 'pessoa_fisica' | 'pessoa_juridica'
  const nome_fant = formData.get('nome_fant') as string
  const nome = formData.get('nome') as string
  const cpf = formData.get('cpf') as string
  const cnpj = formData.get('cnpj') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string

  try {
    const { data, error } = await supabase
      .from('clientes')
      .update({
        tipo,
        nome_fant: tipo === 'pessoa_juridica' ? nome_fant : null,
        nome: tipo === 'pessoa_fisica' ? nome : null,
        cpf: tipo === 'pessoa_fisica' ? cpf : null,
        cnpj: tipo === 'pessoa_juridica' ? cnpj : null,
        email,
        telefone
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/clientes')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
    return { success: false, error: 'Erro ao atualizar cliente' }
  }
}

export async function deletarCliente(id: string) {
  try {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/clientes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar cliente:', error)
    return { success: false, error: 'Erro ao deletar cliente' }
  }
}
