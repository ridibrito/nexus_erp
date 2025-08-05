import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

export interface EmpresaData {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string
  email: string
  telefone: string
  endereco: string
}

export interface UserData {
  id: string
  email: string
  name: string
  role: 'admin' | 'membro'
  permissions: {
    financeiro: boolean
    vendas: boolean
    estoque: boolean
    relatorios: boolean
  }
  created_at: string
  last_login?: string
}

export interface ConviteData {
  id: string
  email: string
  nome: string
  role: 'admin' | 'membro'
  permissions: {
    financeiro: boolean
    vendas: boolean
    estoque: boolean
    relatorios: boolean
  }
  token: string
  expires_at: string
  accepted_at?: string
  created_at: string
}

export function useEmpresaData() {
  const { user } = useAuth()
  const [empresaData, setEmpresaData] = useState<EmpresaData>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    email: '',
    telefone: '',
    endereco: ''
  })
  const [users, setUsers] = useState<UserData[]>([])
  const [convites, setConvites] = useState<ConviteData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar dados da empresa
  const loadEmpresaData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      // Buscar dados da empresa usando função SQL
      const { data: empresaData, error: empresaError } = await supabase
        .rpc('get_user_empresa')

      if (empresaError) {
        console.error('Erro ao buscar dados da empresa:', empresaError)
        // Fallback para dados do user_metadata se a função não existir
        const empresaDataFromUser = {
          razao_social: user.user_metadata?.razao_social || '',
          nome_fantasia: user.user_metadata?.nome_fantasia || '',
          cnpj: user.user_metadata?.cnpj || '',
          inscricao_estadual: user.user_metadata?.inscricao_estadual || '',
          email: user.user_metadata?.email_empresa || '',
          telefone: user.user_metadata?.telefone || '',
          endereco: user.user_metadata?.endereco || ''
        }
        setEmpresaData(empresaDataFromUser)
      } else if (empresaData && empresaData.length > 0) {
        const empresa = empresaData[0]
        setEmpresaData({
          razao_social: empresa.razao_social || '',
          nome_fantasia: empresa.nome_fantasia || '',
          cnpj: empresa.cnpj || '',
          inscricao_estadual: empresa.inscricao_estadual || '',
          email: empresa.email || '',
          telefone: empresa.telefone || '',
          endereco: empresa.endereco || ''
        })
      }

      // Buscar usuários do workspace usando função SQL
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_workspace_usuarios')

      if (usersError) {
        console.error('Erro ao buscar usuários:', usersError)
        // Fallback para dados simulados se a função não existir
        const mockUsers: UserData[] = [
          {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.name || 'Administrador',
            role: 'admin',
            permissions: {
              financeiro: true,
              vendas: true,
              estoque: true,
              relatorios: true
            },
            created_at: user.created_at || new Date().toISOString(),
            last_login: new Date().toISOString()
          }
        ]
        setUsers(mockUsers)
      } else if (usersData) {
        const realUsers: UserData[] = usersData.map((u: any) => ({
          id: u.user_id,
          email: u.user_email,
          name: u.user_name || 'Usuário',
          role: u.role,
          permissions: u.permissions || {
            financeiro: false,
            vendas: false,
            estoque: false,
            relatorios: false
          },
          created_at: u.created_at,
          last_login: u.last_login
        }))
        setUsers(realUsers)
      }

      // Buscar convites pendentes
      await loadConvites()

    } catch (err) {
      setError('Erro ao carregar dados da empresa')
      console.error('Erro ao carregar dados da empresa:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar convites
  const loadConvites = async () => {
    if (!user) return

    try {
      const { data: convitesData, error: convitesError } = await supabase
        .from('convites_usuarios')
        .select('*')
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (convitesError) {
        console.error('Erro ao buscar convites:', convitesError)
        setConvites([])
      } else {
        const convitesFormatted: ConviteData[] = convitesData?.map((c: any) => ({
          id: c.id,
          email: c.email,
          nome: c.nome,
          role: c.role,
          permissions: c.permissions || {
            financeiro: false,
            vendas: false,
            estoque: false,
            relatorios: false
          },
          token: c.token,
          expires_at: c.expires_at,
          accepted_at: c.accepted_at,
          created_at: c.created_at
        })) || []
        setConvites(convitesFormatted)
      }
    } catch (err) {
      console.error('Erro ao carregar convites:', err)
      setConvites([])
    }
  }

  // Atualizar dados da empresa
  const updateEmpresaData = async (data: Partial<EmpresaData>) => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)

      // Tentar usar função SQL primeiro
      const { error: sqlError } = await supabase.rpc('update_empresa_data', {
        p_razao_social: data.razao_social,
        p_nome_fantasia: data.nome_fantasia,
        p_cnpj: data.cnpj,
        p_inscricao_estadual: data.inscricao_estadual,
        p_email: data.email,
        p_telefone: data.telefone,
        p_endereco: data.endereco
      })

      if (sqlError) {
        console.error('Erro ao atualizar via SQL:', sqlError)
        // Fallback para user_metadata
        const { error } = await supabase.auth.updateUser({
          data: data
        })

        if (error) {
          throw error
        }
      }

      // Atualizar estado local
      setEmpresaData(prev => ({ ...prev, ...data }))

      return { success: true }
    } catch (err) {
      setError('Erro ao atualizar dados da empresa')
      console.error('Erro ao atualizar dados da empresa:', err)
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }

  // Criar convite para novo usuário
  const criarConvite = async (conviteData: {
    email: string
    nome: string
    role: 'admin' | 'membro'
    permissions: {
      financeiro: boolean
      vendas: boolean
      estoque: boolean
      relatorios: boolean
    }
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data: token, error } = await supabase.rpc('criar_convite_usuario', {
        p_email: conviteData.email,
        p_nome: conviteData.nome,
        p_role: conviteData.role,
        p_permissions: conviteData.permissions
      })

      if (error) {
        throw error
      }

      // Recarregar convites
      await loadConvites()

      return { success: true, token }
    } catch (err) {
      setError('Erro ao criar convite')
      console.error('Erro ao criar convite:', err)
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }

  // Remover usuário do workspace
  const removerUsuario = async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.rpc('remover_usuario_workspace', {
        p_user_id: userId
      })

      if (error) {
        throw error
      }

      // Recarregar usuários
      await loadEmpresaData()

      return { success: true }
    } catch (err) {
      setError('Erro ao remover usuário')
      console.error('Erro ao remover usuário:', err)
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }

  // Atualizar permissões de usuário
  const atualizarPermissoes = async (userId: string, permissions: {
    financeiro: boolean
    vendas: boolean
    estoque: boolean
    relatorios: boolean
  }) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase.rpc('atualizar_permissoes_usuario', {
        p_user_id: userId,
        p_permissions: permissions
      })

      if (error) {
        throw error
      }

      // Recarregar usuários
      await loadEmpresaData()

      return { success: true }
    } catch (err) {
      setError('Erro ao atualizar permissões')
      console.error('Erro ao atualizar permissões:', err)
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }

  // Cancelar convite
  const cancelarConvite = async (conviteId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await supabase
        .from('convites_usuarios')
        .delete()
        .eq('id', conviteId)

      if (error) {
        throw error
      }

      // Recarregar convites
      await loadConvites()

      return { success: true }
    } catch (err) {
      setError('Erro ao cancelar convite')
      console.error('Erro ao cancelar convite:', err)
      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadEmpresaData()
  }, [user])

  return {
    empresaData,
    users,
    convites,
    isLoading,
    error,
    updateEmpresaData,
    criarConvite,
    removerUsuario,
    atualizarPermissoes,
    cancelarConvite,
    loadEmpresaData,
    loadConvites
  }
} 