'use client'

import { useState, useEffect } from 'react'
import { X, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface EditarPermissoesModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    email: string
    role: string
    permissions: {
      financeiro: boolean
      vendas: boolean
      estoque: boolean
      relatorios: boolean
    }
  }
  onSubmit: (userId: string, permissions: {
    financeiro: boolean
    vendas: boolean
    estoque: boolean
    relatorios: boolean
  }) => Promise<{ success: boolean }>
}

export default function EditarPermissoesModal({ 
  isOpen, 
  onClose, 
  user, 
  onSubmit 
}: EditarPermissoesModalProps) {
  const [permissions, setPermissions] = useState(user.permissions)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setPermissions(user.permissions)
    }
  }, [isOpen, user.permissions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    try {
      const result = await onSubmit(user.id, permissions)
      
      if (result.success) {
        toast.success('Permissões atualizadas com sucesso!')
        onClose()
      } else {
        toast.error('Erro ao atualizar permissões')
      }
    } catch (error) {
      toast.error('Erro ao atualizar permissões')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (permission: keyof typeof permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Editar Permissões</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500 mt-1">Função: {user.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissões
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="financeiro" className="text-sm">Financeiro</Label>
                <input
                  id="financeiro"
                  type="checkbox"
                  checked={permissions.financeiro}
                  onChange={() => handlePermissionChange('financeiro')}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vendas" className="text-sm">Vendas</Label>
                <input
                  id="vendas"
                  type="checkbox"
                  checked={permissions.vendas}
                  onChange={() => handlePermissionChange('vendas')}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="estoque" className="text-sm">Estoque</Label>
                <input
                  id="estoque"
                  type="checkbox"
                  checked={permissions.estoque}
                  onChange={() => handlePermissionChange('estoque')}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="relatorios" className="text-sm">Relatórios</Label>
                <input
                  id="relatorios"
                  type="checkbox"
                  checked={permissions.relatorios}
                  onChange={() => handlePermissionChange('relatorios')}
                  disabled={isLoading}
                  className="h-4 w-4"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
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
              {isLoading ? 'Salvando...' : 'Salvar Permissões'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 