import { DollarSign, Receipt, Calculator, TrendingUp, Users, Calendar, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthGuard } from '@/components/auth/auth-guard'

// Dados mockados para o Nexus ERP de Finanças
const dashboardData = {
  metrics: [
    {
      title: 'Faturamento Mensal',
      value: 'R$ 45.280',
      trend: '+12% este mês',
      trendDirection: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Contas a Receber',
      value: 'R$ 18.750',
      trend: '5 cobranças pendentes',
      trendDirection: 'neutral',
      icon: Receipt,
      color: 'text-orange-600'
    },
    {
      title: 'Despesas Totais',
      value: 'R$ 12.450',
      trend: '-8% este mês',
      trendDirection: 'down',
      icon: Calculator,
      color: 'text-red-600'
    },
    {
      title: 'Lucro Líquido',
      value: 'R$ 32.830',
      trend: '+15% este mês',
      trendDirection: 'up',
      icon: TrendingUp,
      color: 'text-blue-600'
    }
  ],
  cobrancasRecentes: [
    {
      id: '1',
      cliente: 'Empresa ABC Ltda',
      valor: 2500,
      vencimento: '2024-01-15',
      status: 'pendente'
    },
    {
      id: '2',
      cliente: 'Consultoria XYZ',
      valor: 1800,
      vencimento: '2024-01-20',
      status: 'pendente'
    },
    {
      id: '3',
      cliente: 'Tech Solutions',
      valor: 3200,
      vencimento: '2024-01-25',
      status: 'paga'
    }
  ],
  atividadesRecentes: [
    {
      id: '1',
      tipo: 'cobranca',
      descricao: 'Nova cobrança criada para Empresa ABC',
      data: '2024-01-10T10:30:00',
      valor: 2500
    },
    {
      id: '2',
      tipo: 'pagamento',
      descricao: 'Pagamento recebido de Tech Solutions',
      data: '2024-01-09T14:15:00',
      valor: 3200
    },
    {
      id: '3',
      tipo: 'cliente',
      descricao: 'Novo cliente cadastrado: Consultoria XYZ',
      data: '2024-01-08T09:45:00',
      valor: null
    }
  ],
  receitasPorCategoria: [
    { categoria: 'Consultoria', valor: 15000, porcentagem: 33 },
    { categoria: 'Desenvolvimento', valor: 22000, porcentagem: 49 },
    { categoria: 'Suporte', valor: 8280, porcentagem: 18 }
  ]
}

// TODO: Implementar busca de dados reais do Supabase
// import { getDashboardData } from '@/lib/database'
//
// async function getRealDashboardData() {
//   try {
//     // Buscar dados do Supabase
//     const data = await getDashboardData(userId)
//     return data
//   } catch (error) {
//     console.error('Erro ao buscar dados:', error)
//     // Retornar dados mockados em caso de erro
//     return dashboardData
//   }
// }

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="p-6 space-y-6 bg-gray-50">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do seu negócio</p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData.metrics.map((metric, index) => (
            <Card key={index} className="metric-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="metric-value">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trendDirection === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                      ) : metric.trendDirection === 'down' ? (
                        <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                      ) : null}
                      <span className={`text-sm ${metric.trendDirection === 'up' ? 'text-green-600' : metric.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-100 ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conteúdo Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cobranças Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Cobranças Recentes
              </CardTitle>
              <CardDescription>
                Últimas cobranças criadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.cobrancasRecentes.map((cobranca) => (
                  <div key={cobranca.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{cobranca.cliente}</p>
                      <p className="text-sm text-gray-600">
                        Vence em {new Date(cobranca.vencimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        R$ {cobranca.valor.toLocaleString('pt-BR')}
                      </p>
                      <Badge variant={cobranca.status === 'paga' ? 'default' : 'secondary'}>
                        {cobranca.status === 'paga' ? 'Paga' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Atividades Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Últimas atividades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.atividadesRecentes.map((atividade) => (
                  <div key={atividade.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{atividade.descricao}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(atividade.data).toLocaleString('pt-BR')}
                      </p>
                      {atividade.valor && (
                        <p className="text-xs text-green-600 font-medium">
                          R$ {atividade.valor.toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receitas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Receitas por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição das receitas por tipo de serviço
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.receitasPorCategoria.map((categoria, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="font-medium">{categoria.categoria}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${categoria.porcentagem}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      R$ {categoria.valor.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fluxo de Caixa (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>
              Gráfico de fluxo de caixa dos últimos 12 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico será implementado aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
} 