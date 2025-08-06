'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Settings, 
  Shield, 
  Database, 
  FileText,
  Plus,
  ArrowRight
} from 'lucide-react'

export default function SistemaPage() {
  const configuracoes = [
    {
      id: 'aparencia',
      name: 'Aparência',
      description: 'Configure o tema e cores do sistema',
      icon: Settings,
      status: 'Pendente'
    },
    {
      id: 'seguranca',
      name: 'Segurança',
      description: 'Configurações de segurança e autenticação',
      icon: Shield,
      status: 'Pendente'
    },
    {
      id: 'backup',
      name: 'Backup',
      description: 'Configurações de backup e restauração',
      icon: Database,
      status: 'Pendente'
    },
    {
      id: 'logs',
      name: 'Logs',
      description: 'Visualize logs do sistema',
      icon: FileText,
      status: 'Pendente'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sistema</h2>
          <p className="text-sm text-gray-600">Configure as opções do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Configuração
        </Button>
      </div>

      {/* Lista de Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configuracoes.map((config) => (
          <Card key={config.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <config.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{config.name}</CardTitle>
                    <p className="text-sm text-gray-600">{config.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  config.status === 'Ativo' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {config.status}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Configurar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Configure as opções avançadas do sistema, incluindo aparência, segurança e backup.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-800">
              <strong>Atenção:</strong> Algumas configurações podem afetar o funcionamento do sistema. 
              Faça backup antes de alterar configurações críticas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 