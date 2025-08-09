'use client'

import { useState, useRef } from 'react'
import { User, Upload, X, Loader2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface UserAvatarUploadProps {
  userId: string
  currentAvatarUrl?: string | null
  onAvatarChange?: (url: string | null) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatarUpload({ 
  userId, 
  currentAvatarUrl, 
  onAvatarChange, 
  size = 'md',
  className = '' 
}: UserAvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `user-${userId}-${Date.now()}.${fileExt}`
      const filePath = `users/${fileName}`

      console.log('📤 Iniciando upload do avatar do usuário...')
      console.log('📁 Caminho do arquivo:', filePath)
      console.log('👤 ID do usuário:', userId)

      // Remover avatar anterior se existir
      if (avatarUrl) {
        try {
          console.log('🗑️ Removendo avatar anterior...')
          const currentPath = avatarUrl.split('/').pop()
          if (currentPath) {
            await supabase.storage
              .from('avatars')
              .remove([`users/${currentPath}`])
            console.log('✅ Avatar anterior removido')
          }
        } catch (error) {
          console.log('⚠️ Erro ao remover avatar anterior:', error)
        }
      }

      console.log('⬆️ Fazendo upload do novo avatar...')
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('❌ Erro no upload:', uploadError)
        throw uploadError
      }

      console.log('✅ Upload concluído, obtendo URL pública...')
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      console.log('🔗 URL pública:', publicUrl)
      setAvatarUrl(publicUrl)
      
      console.log('👤 Atualizando avatar do usuário...')
      // Atualizar o avatar do usuário na tabela usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário:', updateError)
        throw updateError
      }

      console.log('✅ Avatar do usuário atualizado com sucesso!')
      
      // Atualizar também no Supabase Auth user_metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (authUpdateError) {
        console.error('❌ Erro ao atualizar user_metadata:', authUpdateError)
        // Não vamos falhar se não conseguir atualizar o user_metadata
      } else {
        console.log('✅ User metadata atualizado com sucesso!')
      }

      onAvatarChange?.(publicUrl)
      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao fazer upload do avatar:', error)
      toast.error('Erro ao fazer upload do avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadAvatar(file)
    }
  }

  const removeAvatar = async () => {
    try {
      setUploading(true)

      if (avatarUrl) {
        const currentPath = avatarUrl.split('/').pop()
        if (currentPath) {
          await supabase.storage
            .from('avatars')
            .remove([`users/${currentPath}`])
        }
      }

      // Atualizar na tabela usuarios
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: null })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      // Atualizar no Supabase Auth user_metadata
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      })

      if (authUpdateError) {
        console.error('❌ Erro ao atualizar user_metadata:', authUpdateError)
      }

      setAvatarUrl(null)
      onAvatarChange?.(null)
      toast.success('Avatar removido com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao remover avatar:', error)
      toast.error('Erro ao remover avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center relative group`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar do usuário"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
        
        {/* Overlay com botões */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="h-6 w-6 p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Camera className="h-3 w-3" />
              )}
            </Button>
            {avatarUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0"
                onClick={removeAvatar}
                disabled={uploading}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
