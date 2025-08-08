'use client'

import { useState, useRef } from 'react'
import { Button } from './button'
import { Upload, X, User } from 'lucide-react'
import { toast } from 'sonner'

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (avatarUrl: string) => Promise<void>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  size = 'md',
  className = '' 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setIsUploading(true)
    try {
      // Aqui você pode implementar o upload para um serviço como Cloudinary, AWS S3, etc.
      // Por enquanto, vamos usar uma URL temporária
      const reader = new FileReader()
      reader.onload = async (e) => {
        const result = e.target?.result as string
        await onAvatarChange(result)
        toast.success('Avatar atualizado com sucesso!')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Erro ao fazer upload do avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return

    setIsUploading(true)
    try {
      await onAvatarChange(urlInput.trim())
      setShowUrlInput(false)
      setUrlInput('')
      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setIsUploading(true)
    try {
      await onAvatarChange('')
      toast.success('Avatar removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover avatar')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Avatar atual */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold relative group`}>
        {currentAvatar ? (
          <img 
            src={currentAvatar} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className={`${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'}`} />
        )}
        
        {/* Overlay com opções */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex space-x-1">
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-6 w-6 p-0 bg-white text-gray-800 hover:bg-gray-100"
            >
              <Upload className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              onClick={() => setShowUrlInput(true)}
              disabled={isUploading}
              className="h-6 w-6 p-0 bg-white text-gray-800 hover:bg-gray-100"
            >
              <User className="h-3 w-3" />
            </Button>
            {currentAvatar && (
              <Button
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
                className="h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileUpload(file)
          }
        }}
        className="hidden"
      />

      {/* Modal para URL */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Avatar por URL</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://exemplo.com/avatar.jpg"
                  className="w-full border rounded-md p-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUrlSubmit()
                    }
                  }}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUrlInput(false)
                    setUrlInput('')
                  }}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUrlSubmit}
                  disabled={isUploading || !urlInput.trim()}
                >
                  {isUploading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
