'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  CreditCard, 
  FileText, 
  Settings,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  // Mock data - em produção viria do banco de dados
  const configStatus = {
    empresa: true,
    stripe: false,
    certificado: false,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-2">
            Configure seu ERP Nexus para começar a usar
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Status Geral */}
          <Card>
            <CardHeader>
              <CardTitle>Status da Configuração</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-highlight" />
                    <span className="font-medium">Dados da Empresa</span>
                  </div>
                  {configStatus.empresa ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Configurado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Não configurado</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-highlight" />
                    <span className="font-medium">Gateway de Pagamento</span>
                  </div>
                  {configStatus.stripe ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Conectado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Não conectado</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-highlight" />
                    <span className="font-medium">Certificado Digital</span>
                  </div>
                  {configStatus.certificado ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Enviado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Não enviado</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados da Empresa */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-highlight" />
                  <div>
                    <CardTitle>Dados da Empresa</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Configure os dados fiscais da sua empresa
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Informações necessárias para emissão de notas fiscais eletrônicas.
                </p>
                <Link href="/configuracoes/empresa">
                  <Button className="w-full">
                    <span>Configurar</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Integrações */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-highlight" />
                  <div>
                    <CardTitle>Integrações</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Conecte com Stripe e configure certificado digital
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure as integrações para automatizar seu fluxo financeiro.
                </p>
                <Link href="/configuracoes/integracoes">
                  <Button className="w-full">
                    <span>Configurar</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Informações Importantes */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Configuração Inicial</h4>
                  <p className="text-sm text-blue-800">
                    Para começar a usar o ERP Nexus, você precisa configurar pelo menos os dados da empresa. 
                    As integrações são opcionais mas recomendadas para automatizar seu fluxo.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Certificado Digital</h4>
                  <p className="text-sm text-yellow-800">
                    O certificado digital A1 é obrigatório para emissão de NFS-e. 
                    Certifique-se de que o certificado esteja válido antes do upload.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <h4 className="font-medium text-green-900 mb-2">Suporte</h4>
                  <p className="text-sm text-green-800">
                    Em caso de dúvidas sobre a configuração, entre em contato com nosso suporte 
                    através do email: suporte@nexus.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 