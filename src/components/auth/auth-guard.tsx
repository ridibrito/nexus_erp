'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login',
  fallback 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ AuthGuard - loading:', loading, 'user:', user?.email, 'requireAuth:', requireAuth)
    
    if (!loading) {
      if (requireAuth && !user) {
        console.log('🚫 Usuário não autenticado, redirecionando para:', redirectTo)
        window.location.href = redirectTo
      } else if (!requireAuth && user) {
        console.log('✅ Usuário autenticado, redirecionando para dashboard')
        window.location.href = '/'
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    )
  }

  // Se requer autenticação e não tem usuário, não renderiza nada
  if (requireAuth && !user) {
    return null
  }

  // Se não requer autenticação e tem usuário, não renderiza nada
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
} 