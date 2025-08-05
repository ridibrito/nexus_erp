'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter,
  Target,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react'

export default function NegociosPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Negócios</h1>
        <p className="text-gray-600 mt-2">Gestão de oportunidades e negociações</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Negociação</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">8</div>
            <p className="text-xs text-muted-foreground">R$ 45.000,00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fechados</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-xs text-muted-foreground">R$ 78.500,00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">50%</div>
            <p className="text-xs text-muted-foreground">+5% este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex gap-4 mb-6">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Negócio
        </Button>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Lista de Negócios */}
      <Card>
        <CardHeader>
          <CardTitle>Negócios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Site E-commerce - Cliente ABC</p>
                  <p className="text-sm text-gray-500">Proposta enviada - Aguardando resposta</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">R$ 15.000,00</p>
                <Badge variant="outline">Em Negociação</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Campanha Marketing - Empresa XYZ</p>
                  <p className="text-sm text-gray-500">Contrato assinado - Projeto iniciado</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">R$ 8.500,00</p>
                <Badge variant="secondary">Fechado</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Redes Sociais - Startup 123</p>
                  <p className="text-sm text-gray-500">Reunião agendada - 20/01/2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-orange-600">R$ 6.200,00</p>
                <Badge variant="outline">Prospecção</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">SEO Completo - Loja Online</p>
                  <p className="text-sm text-gray-500">Projeto finalizado - Pagamento recebido</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">R$ 12.300,00</p>
                <Badge variant="secondary">Concluído</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 