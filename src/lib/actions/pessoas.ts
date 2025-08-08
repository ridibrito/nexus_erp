'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '../supabase'

export async function criarPessoa(formData: FormData) {
  const nome = formData.get('nome') as string
  const telefone = formData.get('telefone') as string
  const cargo = formData.get('cargo') as string
  const email = formData.get('email') as string
  const outras_informacoes = formData.get('outras_informacoes') as string
  const empresa_id = formData.get('empresa_id') as string

  // Validação
  if (!nome) {
    throw new Error('Nome é obrigatório')
  }

  try {
    const pessoaData: any = {
      nome,
      cargo,
      email,
      outras_informacoes,
      status: 'ativo'
    }

    // Processar telefones se fornecidos
    if (telefone) {
      try {
        const telefones = JSON.parse(telefone)
        if (Array.isArray(telefones) && telefones.length > 0) {
          // Usar o primeiro telefone como telefone principal
          pessoaData.telefone = telefones[0].numero
        }
      } catch (error) {
        // Se não for JSON válido, usar como string simples
        pessoaData.telefone = telefone
      }
    }

    // Adicionar empresa_id apenas se foi selecionada
    if (empresa_id && empresa_id !== '') {
      pessoaData.empresa_id = empresa_id
    }

    const { data, error } = await supabase
      .from('pessoas')
      .insert(pessoaData)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/pessoas')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao criar pessoa:', error)
    return { success: false, error: 'Erro ao criar pessoa' }
  }
}

export async function atualizarPessoa(id: string, formData: FormData) {
  const nome = formData.get('nome') as string
  const telefone = formData.get('telefone') as string
  const cargo = formData.get('cargo') as string
  const email = formData.get('email') as string
  const outras_informacoes = formData.get('outras_informacoes') as string
  const empresa_id = formData.get('empresa_id') as string

  try {
    const pessoaData: any = {
      nome,
      cargo,
      email,
      outras_informacoes
    }

    // Processar telefones se fornecidos
    if (telefone) {
      try {
        const telefones = JSON.parse(telefone)
        if (Array.isArray(telefones) && telefones.length > 0) {
          // Usar o primeiro telefone como telefone principal
          pessoaData.telefone = telefones[0].numero
        }
      } catch (error) {
        // Se não for JSON válido, usar como string simples
        pessoaData.telefone = telefone
      }
    }

    // Adicionar empresa_id apenas se foi selecionada
    if (empresa_id && empresa_id !== '') {
      pessoaData.empresa_id = empresa_id
    } else {
      pessoaData.empresa_id = null
    }

    const { data, error } = await supabase
      .from('pessoas')
      .update(pessoaData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/pessoas')
    return { success: true, data }
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error)
    return { success: false, error: 'Erro ao atualizar pessoa' }
  }
}

export async function deletarPessoa(id: string) {
  try {
    const { error } = await supabase
      .from('pessoas')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/pessoas')
    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar pessoa:', error)
    return { success: false, error: 'Erro ao deletar pessoa' }
  }
}

export async function buscarEmpresas(termo?: string) {
  try {
    let query = supabase
      .from('empresas')
      .select('id, nome, razao_social, cnpj')
      .eq('status', 'ativo')
      .order('nome')

    if (termo) {
      query = query.or(`nome.ilike.%${termo}%,razao_social.ilike.%${termo}%,cnpj.ilike.%${termo}%`)
    }

    const { data, error } = await query.limit(10)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar empresas:', error)
    return { success: false, error: 'Erro ao buscar empresas' }
  }
}
