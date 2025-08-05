'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react'

export default function FluxoCaixaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Fluxo de Caixa</h1>
          <p className="text-sm text-gray-600 mt-1">Controle de entradas e saídas de caixa</p>
        </div>

        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Entradas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 89.450</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Saídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ 45.230</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                +8% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 44.220</div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +25% este mês
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fluxo Detalhado */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fluxo de Caixa Detalhado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-green-700">Recebimentos</p>
                  <p className="text-xs text-green-600">Clientes e outras receitas</p>
                </div>
                <span className="font-bold text-green-600">R$ 89.450,00</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-red-700">Pagamentos</p>
                  <p className="text-xs text-red-600">Fornecedores e despesas</p>
                </div>
                <span className="font-bold text-red-600">R$ 45.230,00</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-blue-700">Saldo Final</p>
                  <p className="text-xs text-blue-600">Posição de caixa</p>
                </div>
                <span className="font-bold text-blue-600">R$ 44.220,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 