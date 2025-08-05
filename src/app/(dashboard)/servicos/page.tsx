'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter,
  Target,
  DollarSign,
  Package
} from 'lucide-react'

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Serviços</h1>
          <p className="text-sm text-gray-600 mt-1">Gestão de serviços oferecidos</p>
        </div>

        {/* Ações */}
        <div className="flex gap-4 mb-6">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
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
              <CardTitle className="text-sm font-medium">Total de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-xs text-gray-500">+3 este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">22</div>
              <p className="text-xs text-gray-500">92% do total</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">R$ 3.200</div>
              <p className="text-xs text-gray-500">+8% este mês</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">6</div>
              <p className="text-xs text-gray-500">Categorias ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Serviços */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Serviços Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Desenvolvimento de Sites</p>
                    <p className="text-xs text-gray-500">Sites institucionais e e-commerce</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 5.000,00</p>
                    <p className="text-xs text-gray-500">Preço base</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Ativo</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Marketing Digital</p>
                    <p className="text-xs text-gray-500">Campanhas e gestão de redes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 2.500,00</p>
                    <p className="text-xs text-gray-500">Preço base</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Ativo</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">SEO e Analytics</p>
                    <p className="text-xs text-gray-500">Otimização e análise de dados</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">R$ 1.800,00</p>
                    <p className="text-xs text-gray-500">Preço base</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Ativo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 