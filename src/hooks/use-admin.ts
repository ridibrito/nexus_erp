import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsAdmin(false)
        return
      }

      const { data: usuario } = await supabase
        .from('usuarios')
        .select('role')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      setIsAdmin(usuario?.role === 'admin')
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  return { isAdmin, loading }
} 