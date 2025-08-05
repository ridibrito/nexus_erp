'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3
} from 'lucide-react'

export default function DrePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">DRE - Demonstração do Resultado</h1>
          <p className="text-sm text-gray-600 mt-1">Análise de receitas, despesas e lucratividade</p>
        </div>

        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar DRE
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
        </div>

        {/* Resumo DRE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 284.500</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ 198.750</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                +8% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 85.750</div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% vs mês anterior
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DRE Detalhado */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">DRE Detalhado - Janeiro 2024</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Receitas */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-sm text-green-700 mb-3">RECEITAS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Receita de Serviços</span>
                    <span className="font-medium text-green-600">R$ 284.500,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Receita Financeira</span>
                    <span className="font-medium text-green-600">R$ 2.300,00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium text-sm">TOTAL RECEITAS</span>
                    <span className="font-bold text-green-600">R$ 286.800,00</span>
                  </div>
                </div>
              </div>

              {/* Despesas */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-sm text-red-700 mb-3">DESPESAS</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Custos de Serviços</span>
                    <span className="font-medium text-red-600">R$ 125.400,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Despesas Administrativas</span>
                    <span className="font-medium text-red-600">R$ 45.200,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Despesas de Marketing</span>
                    <span className="font-medium text-red-600">R$ 28.150,00</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium text-sm">TOTAL DESPESAS</span>
                    <span className="font-bold text-red-600">R$ 198.750,00</span>
                  </div>
                </div>
              </div>

              {/* Resultado */}
              <div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-bold text-lg">RESULTADO LÍQUIDO</span>
                  <span className="font-bold text-2xl text-blue-600">R$ 88.050,00</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Margem de Lucro</span>
                  <span className="text-xs font-medium text-blue-600">30,7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 