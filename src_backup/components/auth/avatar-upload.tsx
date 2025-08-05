'use client'

import { useState, useRef } from 'react'
import { User, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'

interface AvatarUploadProps {
  onUpload?: (url: string) => void
  className?: string
}

export function AvatarUpload({ onUpload, className = '' }: AvatarUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      console.log('📤 Iniciando upload do avatar...')
      console.log('📁 Caminho do arquivo:', filePath)
      console.log('👤 ID do usuário:', user?.id)

      // Remover avatar anterior se existir
      const currentAvatar = getCurrentAvatar()
      if (currentAvatar) {
        try {
          console.log('🗑️ Removendo avatar anterior...')
          const currentPath = currentAvatar.split('/').pop()
          if (currentPath && user?.id) {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${currentPath}`])
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
      
      console.log('👤 Atualizando metadata do usuário...')
      // Atualizar o avatar do usuário no Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      if (updateError) {
        console.error('❌ Erro ao atualizar usuário:', updateError)
        throw updateError
      }

      console.log('✅ Avatar atualizado com sucesso!')
      onUpload?.(publicUrl)
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
      const currentAvatar = getCurrentAvatar()
      if (currentAvatar) {
        const filePath = currentAvatar.split('/').pop()
        if (filePath && user?.id) {
          await supabase.storage
            .from('avatars')
            .remove([`${user.id}/${filePath}`])
        }
      }

      // Atualizar usuário
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      })

      if (error) throw error

      setAvatarUrl(null)
      onUpload?.('')
      toast.success('Avatar removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover avatar:', error)
      toast.error('Erro ao remover avatar')
    } finally {
      setUploading(false)
    }
  }

  const getCurrentAvatar = () => {
    return user?.user_metadata?.avatar_url || avatarUrl
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {getCurrentAvatar() ? (
            <img
              src={getCurrentAvatar()}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="h-12 w-12 text-gray-400" />
          )}
        </div>
        
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Enviando...' : 'Upload'}
        </Button>

        {getCurrentAvatar() && (
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-2" />
            Remover
          </Button>
        )}
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