'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  UserPlus,
  Save,
  Loader2,
  X,
  Shield,
  User
} from 'lucide-react'
import { toast } from 'sonner'

interface NovoUsuarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: {
    email: string
    name: string
    role: 'admin' | 'user'
    permissions: {
      financeiro: boolean
      vendas: boolean
      estoque: boolean
      relatorios: boolean
    }
  }) => Promise<{ success: boolean; error?: any }>
}

export function NovoUsuarioModal({ isOpen, onClose, onSubmit }: NovoUsuarioModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'admin' | 'user',
    permissions: {
      financeiro: false,
      vendas: false,
      estoque: false,
      relatorios: false
    }
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field === 'permissions') {
      const permissionKey = Object.keys(formData.permissions).find(key => 
        key === (value as string)
      )
      if (permissionKey) {
        setFormData(prev => ({
          ...prev,
          permissions: {
            ...prev.permissions,
            [permissionKey]: !prev.permissions[permissionKey as keyof typeof prev.permissions]
          }
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await onSubmit(formData)
      
      if (result.success) {
        toast.success('Usuário criado com sucesso!')
        
        // Limpar formulário e fechar modal
        setFormData({
          email: '',
          name: '',
          role: 'user',
          permissions: {
            financeiro: false,
            vendas: false,
            estoque: false,
            relatorios: false
          }
        })
        onClose()
      } else {
        toast.error('Erro ao criar usuário')
      }
    } catch (error) {
      toast.error('Erro ao criar usuário')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span>Novo Usuário</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome completo do usuário"
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Tipo de Usuário</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value as 'admin' | 'user')}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="user">Usuário Comum</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {formData.role === 'user' && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Permissões</Label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(formData.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 border rounded">
                        <span className="capitalize">{key.replace('_', ' ')}</span>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleInputChange('permissions', key)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={isLoading}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.role === 'admin' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Administradores têm acesso completo ao sistema
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Criar
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 