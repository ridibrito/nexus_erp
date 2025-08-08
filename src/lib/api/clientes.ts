import { supabase } from '../supabase'
import { Cliente } from './types'

export async function listarClientes() {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('nome')

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao listar clientes:', error)
    return { success: false, error: 'Erro ao listar clientes' }
  }
}

export async function buscarCliente(id: string) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return { success: false, error: 'Erro ao buscar cliente' }
  }
}
