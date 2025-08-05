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
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovaCobrancaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    valor: '',
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
      
      // Limpar formulário
      setFormData({
        cliente: '',
        descricao: '',
        valor: '',
        vencimento: '',
        forma_pagamento: 'pix'
      })
    } catch (error) {
      toast.error('Erro ao criar cobrança')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/cobrancas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Cobrança</h1>
          <p className="text-gray-600">Crie uma nova cobrança rapidamente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            <span>Dados da Cobrança</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vencimento">Data de Vencimento</Label>
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
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Criar Cobrança
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 