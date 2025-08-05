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
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface NovaDespesaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NovaDespesaModal({ isOpen, onClose }: NovaDespesaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    categoria: 'outros',
    data: '',
    fornecedor: ''
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
      
      // Limpar formulário e fechar modal
      setFormData({
        descricao: '',
        valor: '',
        categoria: 'outros',
        data: '',
        fornecedor: ''
      })
      onClose()
    } catch (error) {
      toast.error('Erro ao criar despesa')
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
              <Calculator className="h-5 w-5 text-red-600" />
              <span>Nova Despesa</span>
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