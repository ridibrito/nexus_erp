'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar sessão inicial
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Erro ao buscar sessão inicial:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email)
        
        // Atualizar estado apenas se realmente mudou
        setSession(prevSession => {
          if (prevSession?.user?.id !== session?.user?.id) {
            return session
          }
          return prevSession
        })
        
        setUser(prevUser => {
          if (prevUser?.id !== session?.user?.id) {
            return session?.user ?? null
          }
          return prevUser
        })
        
        setLoading(false)
        
        // Se o usuário acabou de fazer login, redirecionar apenas se não estiver já na página principal
        if (event === 'SIGNED_IN' && session?.user && window.location.pathname !== '/') {
          console.log('✅ Usuário logado, redirecionando...')
          // Usar router.push em vez de window.location para evitar recarregamento
          window.location.href = '/'
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login no contexto...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('❌ Erro no login:', error.message)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log('✅ Login bem-sucedido no contexto:', data.user.email)
        toast.success('Login realizado com sucesso!')
        return { success: true }
      }

      console.log('❌ Nenhum usuário retornado do login')
      return { success: false, error: 'Erro desconhecido no login' }
    } catch (error) {
      console.log('❌ Erro inesperado no login:', error)
      return { success: false, error: 'Erro inesperado no login' }
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('🔐 Iniciando signUp no contexto...', { email, userData })
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      console.log('📊 Resposta do Supabase signUp:', { data, error })

      if (error) {
        console.error('❌ Erro no signUp:', error)
        return { success: false, error: error.message }
      }

      if (data.user) {
        console.log('✅ Usuário criado com sucesso:', data.user.id)
        toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.')
        return { success: true }
      }

      console.error('❌ Nenhum usuário retornado do signUp')
      return { success: false, error: 'Erro desconhecido no registro' }
    } catch (error) {
      console.error('❌ Erro inesperado no signUp:', error)
      return { success: false, error: 'Erro inesperado no registro' }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Erro ao fazer logout: ' + error.message)
      } else {
        toast.success('Logout realizado com sucesso!')
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer logout')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      toast.success('E-mail de recuperação enviado!')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro inesperado ao enviar e-mail de recuperação' }
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      toast.success('Senha atualizada com sucesso!')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Erro inesperado ao atualizar senha' }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 