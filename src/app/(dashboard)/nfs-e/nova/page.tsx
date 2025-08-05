'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  FileText,
  Save,
  Loader2,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NovaNFSePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cliente: '',
    descricao: '',
    valor: '',
    data_emissao: '',
    cnae: '',
    codigo_servico: '',
    aliquota_iss: '5',
    retencao_iss: false,
    retencao_irrf: false,
    retencao_inss: false,
    retencao_pis: false,
    retencao_cofins: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular criação da NFS-e
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('NFS-e criada com sucesso!')
      
      // Limpar formulário
      setFormData({
        cliente: '',
        descricao: '',
        valor: '',
        data_emissao: '',
        cnae: '',
        codigo_servico: '',
        aliquota_iss: '5',
        retencao_iss: false,
        retencao_irrf: false,
        retencao_inss: false,
        retencao_pis: false,
        retencao_cofins: false
      })
    } catch (error) {
      toast.error('Erro ao criar NFS-e')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/nfs-e">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova NFS-e</h1>
          <p className="text-gray-600">Emita uma nova nota fiscal de serviço eletrônica</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <span>Dados da NFS-e</span>
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
              <Label htmlFor="descricao">Descrição do Serviço</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                placeholder="Descrição detalhada do serviço prestado"
                className="mt-1"
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data-emissao">Data de Emissão</Label>
                <Input
                  id="data-emissao"
                  type="date"
                  value={formData.data_emissao}
                  onChange={(e) => handleInputChange('data_emissao', e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cnae">CNAE</Label>
                <Input
                  id="cnae"
                  value={formData.cnae}
                  onChange={(e) => handleInputChange('cnae', e.target.value)}
                  placeholder="62.01-5-01"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo-servico">Código do Serviço</Label>
                <Input
                  id="codigo-servico"
                  value={formData.codigo_servico}
                  onChange={(e) => handleInputChange('codigo_servico', e.target.value)}
                  placeholder="0107"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="aliquota-iss">Alíquota ISS (%)</Label>
                <Input
                  id="aliquota-iss"
                  type="number"
                  step="0.01"
                  value={formData.aliquota_iss}
                  onChange={(e) => handleInputChange('aliquota_iss', e.target.value)}
                  placeholder="5"
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Retenções</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retencao-iss"
                    checked={formData.retencao_iss}
                    onChange={(e) => handleInputChange('retencao_iss', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="retencao-iss">Retenção ISS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retencao-irrf"
                    checked={formData.retencao_irrf}
                    onChange={(e) => handleInputChange('retencao_irrf', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="retencao-irrf">Retenção IRRF</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retencao-inss"
                    checked={formData.retencao_inss}
                    onChange={(e) => handleInputChange('retencao_inss', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="retencao-inss">Retenção INSS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retencao-pis"
                    checked={formData.retencao_pis}
                    onChange={(e) => handleInputChange('retencao_pis', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="retencao-pis">Retenção PIS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="retencao-cofins"
                    checked={formData.retencao_cofins}
                    onChange={(e) => handleInputChange('retencao_cofins', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <Label htmlFor="retencao-cofins">Retenção COFINS</Label>
                </div>
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
                  Criar NFS-e
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 