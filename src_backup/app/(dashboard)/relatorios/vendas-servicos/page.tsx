'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react'

export default function VendasServicosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Vendas por Serviço</h1>
          <p className="text-sm text-gray-600 mt-1">Análise de receita por tipo de serviço</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ 284.500</div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Sites e E-commerce</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ 180.000</div>
              <p className="text-xs text-gray-500">63% do total</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Marketing Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">R$ 135.000</div>
              <p className="text-xs text-gray-500">47% do total</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">SEO e Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 90.000</div>
              <p className="text-xs text-gray-500">32% do total</p>
            </CardContent>
          </Card>
        </div>

        {/* Detalhamento */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Detalhamento por Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sites e E-commerce</p>
                    <p className="text-xs text-gray-500">45 projetos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ 180.000,00</p>
                  <p className="text-xs text-green-600">+15% este mês</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Marketing Digital</p>
                    <p className="text-xs text-gray-500">32 campanhas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ 135.000,00</p>
                  <p className="text-xs text-green-600">+8% este mês</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">SEO e Analytics</p>
                    <p className="text-xs text-gray-500">28 projetos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ 90.000,00</p>
                  <p className="text-xs text-green-600">+12% este mês</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 