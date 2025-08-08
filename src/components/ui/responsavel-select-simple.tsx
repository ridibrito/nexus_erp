'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, ChevronDown, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Usuario {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    name?: string
  }
}

interface ResponsavelSelectSimpleProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function ResponsavelSelectSimple({ 
  value, 
  onChange, 
  className = '',
  placeholder = 'Selecione um responsável'
}: ResponsavelSelectSimpleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    carregarUsuarios()
  }, [])

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

  const getResponsavelNome = (userId: string) => {
    const usuario = usuarios.find(u => u.id === userId)
    if (!usuario) return 'Usuário não encontrado'
    
    return usuario.user_metadata?.full_name || 
           usuario.user_metadata?.name || 
           usuario.email || 
           'Usuário sem nome'
  }

  const getResponsavelEmail = (userId: string) => {
    const usuario = usuarios.find(u => u.id === userId)
    return usuario?.email || ''
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const nome = getResponsavelNome(usuario.id).toLowerCase()
    const email = usuario.email.toLowerCase()
    const search = searchTerm.toLowerCase()
    
    return nome.includes(search) || email.includes(search)
  })

  const selectedUsuario = usuarios.find(u => u.id === value)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">
            {selectedUsuario ? getResponsavelNome(selectedUsuario.id) : placeholder}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuário..."
                className="pl-8 text-sm"
              />
            </div>
          </div>
          
          <div className="max-h-40 overflow-y-auto">
            {loading ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                Carregando usuários...
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    onChange('')
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-500">Nenhum responsável</span>
                  </div>
                </button>
                
                {filteredUsuarios.map(usuario => (
                  <button
                    key={usuario.id}
                    onClick={() => {
                      onChange(usuario.id)
                      setIsOpen(false)
                      setSearchTerm('')
                    }}
                    className="w-full text-left p-2 hover:bg-gray-50 border-t border-gray-100"
                  >
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">
                          {getResponsavelNome(usuario.id)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {usuario.email}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
