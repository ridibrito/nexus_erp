'use client'

import { useState, useRef } from 'react'
import { User, Upload, X, Loader2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface MemberAvatarUploadProps {
  memberId: string
  currentAvatarUrl?: string | null
  onAvatarChange?: (url: string | null) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MemberAvatarUpload({ 
  memberId, 
  currentAvatarUrl, 
  onAvatarChange, 
  size = 'md',
  className = '' 
}: MemberAvatarUploadProps) {
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
      const fileName = `member-${memberId}-${Date.now()}.${fileExt}`
      const filePath = `members/${fileName}`

      console.log('📤 Iniciando upload do avatar do membro...')
      console.log('📁 Caminho do arquivo:', filePath)
      console.log('👤 ID do membro:', memberId)

      // Remover avatar anterior se existir
      if (avatarUrl) {
        try {
          console.log('🗑️ Removendo avatar anterior...')
          const currentPath = avatarUrl.split('/').pop()
          if (currentPath) {
            await supabase.storage
              .from('avatars')
              .remove([`members/${currentPath}`])
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
      
      console.log('👤 Atualizando avatar do membro...')
      // Atualizar o avatar do membro na tabela membros
      const { error: updateError } = await supabase
        .from('membros')
        .update({ avatar_url: publicUrl })
        .eq('id', memberId)

      if (updateError) {
        console.error('❌ Erro ao atualizar membro:', updateError)
        throw updateError
      }

      console.log('✅ Avatar do membro atualizado com sucesso!')
      onAvatarChange?.(publicUrl)
      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao fazer upload:', error)
      toast.error('Erro ao fazer upload do avatar: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas imagens')
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB')
        return
      }

      uploadAvatar(file)
    }
  }

  const removeAvatar = async () => {
    try {
      setUploading(true)

      // Remover avatar do storage
      if (avatarUrl) {
        const filePath = avatarUrl.split('/').pop()
        if (filePath) {
          await supabase.storage
            .from('avatars')
            .remove([`members/${filePath}`])
        }
      }

      // Atualizar membro
      const { error } = await supabase
        .from('membros')
        .update({ avatar_url: null })
        .eq('id', memberId)

      if (error) throw error

      setAvatarUrl(null)
      onAvatarChange?.(null)
      toast.success('Avatar removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      toast.error('Erro ao remover avatar')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300`}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar do membro"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className={`${iconSizes[size]} animate-spin text-white`} />
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-1 -right-1">
        <Button
          size="sm"
          variant="secondary"
          className="w-6 h-6 rounded-full p-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="h-3 w-3" />
        </Button>
      </div>

      {avatarUrl && (
        <div className="absolute -top-1 -right-1">
          <Button
            size="sm"
            variant="destructive"
            className="w-6 h-6 rounded-full p-0"
            onClick={removeAvatar}
            disabled={uploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

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