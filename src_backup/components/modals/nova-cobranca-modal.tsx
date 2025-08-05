'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Receipt,
  Save,
  Loader2,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface NovaCobrancaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovaCobrancaModal({ isOpen, onClose }: NovaCobrancaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cliente: '',
    valor: '',
    descricao: '',
    vencimento: '',
    forma_pagamento: 'pix'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação da cobrança
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Cobrança criada com sucesso!')
      
      // Limpar formulário e fechar modal
      setFormData({
        cliente: '',
        valor: '',
        descricao: '',
        vencimento: '',
        forma_pagamento: 'pix'
      })
      onClose()
    } catch (error) {
      toast.error('Erro ao criar cobrança')
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
              <Receipt className="h-5 w-5 text-blue-600" />
              <span>Nova Cobrança</span>
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
                <Label htmlFor="cliente">Cliente</Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => handleInputChange('cliente', e.target.value)}
                  placeholder="Nome do cliente"
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => handleInputChange('valor', e.target.value)}
                    placeholder="0,00"
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vencimento">Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={formData.vencimento}
                    onChange={(e) => handleInputChange('vencimento', e.target.value)}
                    className="mt-1"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição da cobrança"
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <Label htmlFor="forma-pagamento">Forma de Pagamento</Label>
                <select
                  id="forma-pagamento"
                  value={formData.forma_pagamento}
                  onChange={(e) => handleInputChange('forma_pagamento', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="pix">PIX</option>
                  <option value="boleto">Boleto</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>

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