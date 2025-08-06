'use client'

import { User } from 'lucide-react'

interface UserAvatarProps {
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ 
  avatarUrl, 
  size = 'md',
  className = '' 
}: UserAvatarProps) {
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