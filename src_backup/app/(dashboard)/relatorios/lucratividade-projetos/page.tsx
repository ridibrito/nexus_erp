'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Calendar,
  TrendingUp,
  Briefcase,
  DollarSign
} from 'lucide-react'

export default function LucratividadeProjetosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Lucratividade por Projeto</h1>
          <p className="text-sm text-gray-600 mt-1">Análise de rentabilidade por projeto</p>
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
              <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">32,5%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Projetos Lucrativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">28</div>
              <p className="text-xs text-gray-500">82% do total</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">R$ 284.500</div>
              <p className="text-xs text-gray-500">+15% este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">R$ 92.460</div>
              <p className="text-xs text-gray-500">+18% este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Projetos */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Projetos por Lucratividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Site E-commerce ABC</p>
                    <p className="text-xs text-gray-500">Empresa ABC Ltda</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 15.000,00</p>
                    <p className="text-xs text-green-600">Margem: 45%</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Alta</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Campanha Marketing XYZ</p>
                    <p className="text-xs text-gray-500">Startup XYZ</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 8.500,00</p>
                    <p className="text-xs text-blue-600">Margem: 35%</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Média</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">SEO Completo 123</p>
                    <p className="text-xs text-gray-500">Loja Online 123</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 12.300,00</p>
                    <p className="text-xs text-orange-600">Margem: 28%</p>
                  </div>
                  <Badge variant="outline" className="text-xs">Baixa</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 