'use client'

import { useState } from 'react'
import { X, UserPlus, Mail, Shield, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface NovoConviteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (conviteData: {
    email: string
    nome: string
    role: 'admin' | 'membro'
    permissions: {
      financeiro: boolean
      vendas: boolean
      estoque: boolean
      relatorios: boolean
    }
  }) => Promise<{ success: boolean; token?: string }>
}

export default function NovoConviteModal({ isOpen, onClose, onSubmit }: NovoConviteModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    role: 'membro' as 'admin' | 'membro',
    permissions: {
      financeiro: false,
      vendas: false,
      estoque: false,
      relatorios: false
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.nome) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await onSubmit(formData)
      
      if (result.success) {
        toast.success('Convite criado com sucesso!')
        setFormData({
          email: '',
          nome: '',
          role: 'membro',
          permissions: {
            financeiro: false,
            vendas: false,
            estoque: false,
            relatorios: false
          }
        })
        onClose()
      } else {
        toast.error('Erro ao criar convite')
      }
    } catch (error) {
      toast.error('Erro ao criar convite')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionChange = (permission: keyof typeof formData.permissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Novo Convite</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome completo"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemplo.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'membro' }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={isLoading}
            >
              <option value="membro">Membro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

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
                  checked={formData.permissions.financeiro}
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
                  checked={formData.permissions.vendas}
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
                  checked={formData.permissions.estoque}
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
                  checked={formData.permissions.relatorios}
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
              {isLoading ? 'Criando...' : 'Criar Convite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 