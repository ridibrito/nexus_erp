'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Upload, 
  Search, 
  Filter,
  Banknote,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

export default function MovimentacoesBancariasPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Movimentações Bancárias</h1>
        <p className="text-gray-600 mt-2">A conexão com o banco - interface com o dinheiro real</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 45.230,00</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 28.450,00</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 15.320,00</div>
            <p className="text-xs text-muted-foreground">-3% em relação ao mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Extrato Consolidado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Visão de todos os lançamentos importados dos seus bancos.
            </p>
            <div className="flex gap-2">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Importar Extrato
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Conciliação Bancária
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ferramenta para "casar" os lançamentos do extrato com as contas a pagar e receber do sistema.
            </p>
            <div className="flex gap-2">
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Iniciar Conciliação
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Pagamento Cliente ABC</p>
                  <p className="text-sm text-gray-500">15/01/2024 - Banco do Brasil</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+R$ 2.500,00</p>
                <Badge variant="secondary">Conciliado</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Pagamento Fornecedor XYZ</p>
                  <p className="text-sm text-gray-500">14/01/2024 - Itaú</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-red-600">-R$ 850,00</p>
                <Badge variant="outline">Pendente</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Recebimento Projeto Site</p>
                  <p className="text-sm text-gray-500">13/01/2024 - Santander</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">+R$ 1.200,00</p>
                <Badge variant="secondary">Conciliado</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 