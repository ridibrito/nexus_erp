'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Calculator,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovaDespesaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: 'outros',
    data: '',
    fornecedor: '',
    forma_pagamento: 'pix',
    status: 'pendente'
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação da despesa
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Despesa criada com sucesso!')
      
      // Limpar formulário
      setFormData({
        descricao: '',
        valor: '',
        categoria: 'outros',
        data: '',
        fornecedor: '',
        forma_pagamento: 'pix',
        status: 'pendente'
      })
    } catch (error) {
      toast.error('Erro ao criar despesa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/despesas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Despesa</h1>
          <p className="text-gray-600">Registre uma nova despesa rapidamente</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-red-600" />
            <span>Dados da Despesa</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => handleInputChange('descricao', e.target.value)}
                  placeholder="Descrição da despesa"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <select
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="alimentacao">Alimentação</option>
                  <option value="transporte">Transporte</option>
                  <option value="combustivel">Combustível</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="servicos">Serviços</option>
                  <option value="impostos">Impostos</option>
                  <option value="marketing">Marketing</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                  placeholder="Nome do fornecedor"
                  className="mt-1"
                  disabled={isLoading}
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
                  <option value="cartao-debito">Cartão de Débito</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="transferencia">Transferência</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
                <option value="cancelado">Cancelado</option>
              </select>
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
                  Criar Despesa
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 