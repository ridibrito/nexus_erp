'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Building2,
  Save,
  Upload,
  Download,
  Settings,
  FileText,
  CreditCard,
  Shield
} from 'lucide-react'

export default function EmpresaPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Empresa</h1>
          <p className="text-gray-600 mt-1">
            Gerencie as informações da sua empresa
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span>Informações Básicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="razao-social">Razão Social</Label>
                <Input
                  id="razao-social"
                  defaultValue="Nexus ERP Ltda"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="nome-fantasia">Nome Fantasia</Label>
                <Input
                  id="nome-fantasia"
                  defaultValue="Nexus ERP"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  defaultValue="12.345.678/0001-90"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="inscricao-estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao-estadual"
                  defaultValue="123.456.789.012"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="contato@nexuserp.com.br"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                defaultValue="(11) 99999-9999"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                defaultValue="Rua das Tecnologias, 123 - São Paulo/SP - CEP: 01234-567"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações Fiscais */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <span>Configurações Fiscais</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="regime-tributario">Regime Tributário</Label>
                <select
                  id="regime-tributario"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="simples-nacional"
                >
                  <option value="simples-nacional">Simples Nacional</option>
                  <option value="lucro-presumido">Lucro Presumido</option>
                  <option value="lucro-real">Lucro Real</option>
                </select>
              </div>
              <div>
                <Label htmlFor="cnae">CNAE Principal</Label>
                <Input
                  id="cnae"
                  defaultValue="62.01-5-01"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aliquota-icms">Alíquota ICMS (%)</Label>
                <Input
                  id="aliquota-icms"
                  type="number"
                  defaultValue="18"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="aliquota-pis">Alíquota PIS (%)</Label>
                <Input
                  id="aliquota-pis"
                  type="number"
                  defaultValue="0.65"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aliquota-cofins">Alíquota COFINS (%)</Label>
                <Input
                  id="aliquota-cofins"
                  type="number"
                  defaultValue="3"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="aliquota-iss">Alíquota ISS (%)</Label>
                <Input
                  id="aliquota-iss"
                  type="number"
                  defaultValue="5"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Pagamento */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <span>Configurações de Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Input
                id="banco"
                defaultValue="Banco do Brasil"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agencia">Agência</Label>
                <Input
                  id="agencia"
                  defaultValue="1234"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="conta">Conta</Label>
                <Input
                  id="conta"
                  defaultValue="12345-6"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="chave-pix">Chave PIX</Label>
              <Input
                id="chave-pix"
                defaultValue="contato@nexuserp.com.br"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prazo-pagamento">Prazo de Pagamento (dias)</Label>
              <Input
                id="prazo-pagamento"
                type="number"
                defaultValue="30"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Segurança */}
        <Card className="metric-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Configurações de Segurança</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backup-automatico">Backup Automático</Label>
              <select
                id="backup-automatico"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="diario"
              >
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="desabilitado">Desabilitado</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sessao-timeout">Timeout de Sessão (minutos)</Label>
              <Input
                id="sessao-timeout"
                type="number"
                defaultValue="30"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autenticacao-2fa"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="autenticacao-2fa">Autenticação de dois fatores</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="notificacoes-email"
                defaultChecked
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="notificacoes-email">Notificações por email</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Configurações
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importar Configurações
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
} 