'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

export default function ContasPagarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Contas a Pagar</h1>
          <p className="text-sm text-gray-600 mt-1">Gestão de despesas e obrigações</p>
        </div>

        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Conta
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ 45.230</div>
              <p className="text-xs text-gray-500">+8% este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 8.750</div>
              <p className="text-xs text-gray-500">3 contas vencidas</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Vencem Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">R$ 3.350</div>
              <p className="text-xs text-gray-500">2 contas</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Pagas Este Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 28.450</div>
              <p className="text-xs text-gray-500">15 contas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fornecedor XYZ</p>
                    <p className="text-xs text-gray-500">Vence hoje</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 2.500,00</p>
                    <p className="text-xs text-red-600">Vencida</p>
                  </div>
                  <Badge variant="destructive" className="text-xs">Vencida</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Serviços de Hosting</p>
                    <p className="text-xs text-gray-500">Vence em 3 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 850,00</p>
                    <p className="text-xs text-orange-600">Próximo vencimento</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Pendente</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ferramentas de Marketing</p>
                    <p className="text-xs text-gray-500">Vence em 7 dias</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 450,00</p>
                    <p className="text-xs text-gray-500">Em dia</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Em Dia</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 