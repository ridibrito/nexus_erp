'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface UsuarioComPerfil {
  id: string
  auth_user_id: string
  nome: string
  email: string
  cargo: string
  telefone?: string
  avatar_url?: string
  name?: string
  empresa_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function buscarUsuariosComPerfil(empresaId: string): Promise<UsuarioComPerfil[]> {
  try {
    const supabase = createClient()
    
    // Buscar usuários da empresa
    const { data: usuarios, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('is_active', true)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      throw error
    }

    // Buscar dados de perfil do Supabase Auth para cada usuário
    const usuariosComPerfil = await Promise.all(
      (usuarios || []).map(async (usuario) => {
        try {
          // Como não temos acesso admin, vamos usar os dados da tabela usuarios
          // e tentar buscar dados do usuário atual se for o mesmo
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user && usuario.auth_user_id === session.user.id) {
            // Se for o usuário atual, usar os dados da sessão
            return {
              ...usuario,
              avatar_url: session.user.user_metadata?.avatar_url || usuario.avatar_url || null,
              name: session.user.user_metadata?.name || usuario.nome,
              email: session.user.email || usuario.email
            }
          } else {
            // Para outros usuários, usar dados da tabela
            return {
              ...usuario,
              avatar_url: usuario.avatar_url || null,
              name: usuario.nome,
              email: usuario.email
            }
          }
        } catch (error) {
          console.error(`Erro ao buscar perfil do usuário ${usuario.id}:`, error)
          return {
            ...usuario,
            avatar_url: usuario.avatar_url || null,
            name: usuario.nome,
            email: usuario.email
          }
        }
      })
    )

    return usuariosComPerfil
  } catch (error) {
    console.error('Erro ao buscar usuários com perfil:', error)
    throw error
  }
}

export async function atualizarUsuario(usuarioId: string, dados: Partial<UsuarioComPerfil>) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('usuarios')
      .update(dados)
      .eq('id', usuarioId)

    if (error) throw error

    revalidatePath('/configuracoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
    return { success: false, error: 'Erro ao atualizar usuário' }
  }
}

export async function alterarStatusUsuario(usuarioId: string, novoStatus: boolean) {
  try {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('usuarios')
      .update({ is_active: novoStatus })
      .eq('id', usuarioId)

    if (error) throw error

    revalidatePath('/configuracoes')
    return { success: true }
  } catch (error) {
    console.error('Erro ao alterar status do usuário:', error)
    return { success: false, error: 'Erro ao alterar status do usuário' }
  }
}
