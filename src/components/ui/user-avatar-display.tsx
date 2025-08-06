'use client'

import { useState, useEffect } from 'react'
import { User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserAvatarDisplayProps {
  userId: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatarDisplay({ 
  userId, 
  size = 'md',
  className = '' 
}: UserAvatarDisplayProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        setLoading(true)
        
        // Buscar dados do usuário no auth.users
        const { data: { user }, error } = await supabase.auth.admin.getUserById(userId)
        
        if (error) {
          console.error('Erro ao buscar usuário:', error)
          return
        }

        // Pegar avatar do user_metadata
        const avatar = user?.user_metadata?.avatar_url || null
        setAvatarUrl(avatar)
      } catch (error) {
        console.error('Erro ao buscar avatar:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUserAvatar()
    }
  }, [userId])

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <User className={`${iconSizes[size]} text-gray-400`} />
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar do usuário"
          className="w-full h-full object-cover"
        />
      ) : (
        <User className={`${iconSizes[size]} text-gray-400`} />
      )}
    </div>
  )
} 