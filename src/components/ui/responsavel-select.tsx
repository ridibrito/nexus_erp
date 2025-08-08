'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit, Check, X, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Usuario {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    name?: string
  }
}

interface ResponsavelSelectProps {
  responsavelId?: string
  onSave: (responsavelId: string) => Promise<void>
  className?: string
}

export function ResponsavelSelect({ responsavelId, onSave, className = '' }: ResponsavelSelectProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedResponsavelId, setSelectedResponsavelId] = useState(responsavelId || '')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isEditing) {
      carregarUsuarios()
    }
  }, [isEditing])

  const carregarUsuarios = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.admin.listUsers()
      
      if (error) {
        console.error('Erro ao carregar usuários:', error)
        return
      }

      if (data?.users) {
        setUsuarios(data.users)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      await onSave(selectedResponsavelId)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar responsável:', error)
    }
  }

  const handleCancel = () => {
    setSelectedResponsavelId(responsavelId || '')
    setIsEditing(false)
  }

  const getResponsavelNome = (userId: string) => {
    const usuario = usuarios.find(u => u.id === userId)
    if (!usuario) return 'Usuário não encontrado'
    
    return usuario.user_metadata?.full_name || 
           usuario.user_metadata?.name || 
           usuario.email || 
           'Usuário sem nome'
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const nome = getResponsavelNome(usuario.id).toLowerCase()
    const email = usuario.email.toLowerCase()
    const search = searchTerm.toLowerCase()
    
    return nome.includes(search) || email.includes(search)
  })

  if (isEditing) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div>
          <label className="text-xs text-gray-500">Buscar usuário</label>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite para buscar..."
            className="text-sm"
          />
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-1">
          {loading ? (
            <div className="text-sm text-gray-500">Carregando usuários...</div>
          ) : (
            filteredUsuarios.map(usuario => (
              <button
                key={usuario.id}
                onClick={() => setSelectedResponsavelId(usuario.id)}
                className={`w-full text-left p-2 rounded text-sm ${
                  selectedResponsavelId === usuario.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {getResponsavelNome(usuario.id)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {usuario.email}
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            Salvar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between group ${className}`}>
      <div className="flex items-center space-x-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-900">
          {responsavelId ? getResponsavelNome(responsavelId) : 'Responsável não definido'}
        </span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
      >
        <Edit className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  )
}
