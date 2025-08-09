import { supabase } from '@/lib/supabase'

export interface Usuario {
  id: string
  email: string
  nome?: string
  avatar_url?: string
  empresa_id: string
  created_at: string
  updated_at: string
}

export const usuariosAPI = {
  async listar(): Promise<Usuario[]> {
    console.log('=== INICIANDO usuariosAPI.listar() ===')
    try {
      console.log('Chamando supabase.from("usuarios").select("*")...')
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('nome', { ascending: true })

      console.log('Resposta do Supabase:', { data, error })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        // Se a tabela não existe ou há outro erro, retornar array vazio
        if (error.message.includes('does not exist') || error.message.includes('relation')) {
          console.log('Tabela usuarios não encontrada, retornando array vazio')
          return []
        }
        throw error
      }

      console.log('Usuários encontrados:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('Primeiro usuário:', data[0])
      }

      return data || []
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      console.log('Tipo do erro:', typeof error)
      console.log('Erro é instância de Error?', error instanceof Error)
      console.log('Mensagem do erro:', error instanceof Error ? error.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(error, null, 2))
      // Em caso de erro, retornar array vazio em vez de lançar erro
      return []
    }
  },

  async listarComPerfil(empresaId: string): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', empresaId)
        .eq('is_active', true)
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        throw error
      }

      // Buscar dados de perfil do Supabase Auth para cada usuário
      const usuariosComPerfil = await Promise.all(
        (data || []).map(async (usuario) => {
          try {
            // Buscar dados do usuário no Supabase Auth usando a sessão atual
            const { data: { session } } = await supabase.auth.getSession()
            
            if (session?.user && usuario.auth_user_id === session.user.id) {
              // Se for o usuário atual, usar os dados da sessão
              return {
                ...usuario,
                avatar_url: session.user.user_metadata?.avatar_url || null,
                name: session.user.user_metadata?.name || usuario.nome,
                email: session.user.email || usuario.email
              }
            } else {
              // Para outros usuários, tentar buscar dados básicos da tabela
              // Como não temos acesso admin, vamos usar os dados da tabela usuarios
              return {
                ...usuario,
                avatar_url: usuario.avatar_url || null,
                name: usuario.nome,
                email: usuario.email
              }
            }
          } catch (error) {
            console.error(`Erro ao buscar perfil do usuário ${usuario.id}:`, error)
            return usuario
          }
        })
      )

      return usuariosComPerfil
    } catch (error) {
      console.error('Erro ao listar usuários com perfil:', error)
      throw error
    }
  },

  async buscarPorId(id: string): Promise<Usuario | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar usuário:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error)
      throw error
    }
  },

  async buscarPorEmpresa(empresaId: string): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('empresa_id', empresaId)
        .order('nome', { ascending: true })

      if (error) {
        console.error('Erro ao buscar usuários da empresa:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar usuários por empresa:', error)
      throw error
    }
  }
}
