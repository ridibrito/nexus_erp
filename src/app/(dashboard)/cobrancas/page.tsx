'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

// Dados mockados para cobranças
const cobrancasData = [
  {
    id: 1,
    numero: 'COB-2024-001',
    cliente: 'Empresa ABC Ltda',
    valor: 2500.00,
    vencimento: '2024-01-15',
    status: 'pendente',
    diasVencidos: 2,
    descricao: 'Serviços de consultoria - Janeiro/2024'
  },
  {
    id: 2,
    numero: 'COB-2024-002',
    cliente: 'Consultoria XYZ',
    valor: 1800.00,
    vencimento: '2024-01-20',
    status: 'pendente',
    diasVencidos: 0,
    descricao: 'Desenvolvimento de sistema'
  },
  {
    id: 3,
    numero: 'COB-2024-003',
    cliente: 'Tech Solutions',
    valor: 3200.00,
    vencimento: '2024-01-10',
    status: 'pago',
    diasVencidos: 0,
    descricao: 'Suporte técnico mensal'
  },
  {
    id: 4,
    numero: 'COB-2024-004',
    cliente: 'Digital Corp',
    valor: 4500.00,
    vencimento: '2024-01-25',
    status: 'pendente',
    diasVencidos: 0,
    descricao: 'Implementação de projeto'
  }
]

const statusColors = {
  pendente: 'bg-orange-100 text-orange-800',
  pago: 'bg-green-100 text-green-800',
  vencido: 'bg-red-100 text-red-800'
}

const statusIcons = {
  pendente: Clock,
  pago: CheckCircle,
  vencido: AlertCircle
}

export default function CobrancasPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cobranças</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as suas cobranças e recebimentos
          </p>
        </div>
        <Link href="/cobrancas/nova">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Cobrança
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cobranças..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Cobranças</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ 12.000</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vencidas</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cobranças */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Todas as Cobranças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Vencimento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {cobrancasData.map((cobranca) => {
                  const StatusIcon = statusIcons[cobranca.status]
                  return (
                    <tr key={cobranca.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{cobranca.numero}</span>
                        <p className="text-sm text-gray-500">{cobranca.descricao}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{cobranca.cliente}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(cobranca.valor)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">{formatDate(cobranca.vencimento)}</span>
                        {cobranca.diasVencidos > 0 && (
                          <p className="text-sm text-red-600">{cobranca.diasVencidos} dias vencido</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${statusColors[cobranca.status]} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {cobranca.status === 'pendente' ? 'Pendente' : 
                           cobranca.status === 'pago' ? 'Pago' : 'Vencido'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 