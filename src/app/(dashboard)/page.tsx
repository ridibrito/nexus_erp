'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  FileText,
  CreditCard,
  Building2,
  ShoppingBag,
  Package,
  Receipt,
  Wallet,
  Activity,
  Zap,
  Target as TargetIcon,
  CheckSquare,
  MessageSquare
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

// Dados para os gráficos
const fluxoDiarioData = [
  { dia: 'Seg', entrada: 8500, saida: 3200 },
  { dia: 'Ter', entrada: 12000, saida: 4500 },
  { dia: 'Qua', entrada: 9500, saida: 2800 },
  { dia: 'Qui', entrada: 15000, saida: 5200 },
  { dia: 'Sex', entrada: 11000, saida: 3800 },
  { dia: 'Sab', entrada: 6500, saida: 2100 },
  { dia: 'Dom', entrada: 4200, saida: 1500 },
]

const receitaMensalData = [
  { mes: 'Jan', receita: 42000, meta: 40000 },
  { mes: 'Fev', receita: 45000, meta: 42000 },
  { mes: 'Mar', receita: 48000, meta: 45000 },
  { mes: 'Abr', receita: 52000, meta: 48000 },
  { mes: 'Mai', receita: 58000, meta: 52000 },
  { mes: 'Jun', receita: 62000, meta: 58000 },
]

const mrrData = [
  { mes: 'Jan', mrr: 42000, churn: 2000 },
  { mes: 'Fev', mrr: 45000, churn: 1500 },
  { mes: 'Mar', mrr: 48000, churn: 1800 },
  { mes: 'Abr', receita: 52000, churn: 1200 },
  { mes: 'Mai', receita: 58000, churn: 2200 },
  { mes: 'Jun', receita: 62000, churn: 1800 },
]

const receitaPorServicoData = [
  { servico: 'Sites e E-commerce', valor: 18000, percentual: 45 },
  { servico: 'Marketing Digital', valor: 13500, percentual: 34 },
  { servico: 'SEO e Analytics', valor: 9000, percentual: 22 },
  { servico: 'Redes Sociais', valor: 4730, percentual: 12 },
]

const tarefasCRMData = [
  { titulo: 'Follow-up Cliente ABC', prioridade: 'Alta', prazo: 'Hoje', responsavel: 'João Silva' },
  { titulo: 'Proposta Startup XYZ', prioridade: 'Média', prazo: 'Amanhã', responsavel: 'Maria Santos' },
  { titulo: 'Reunião Loja 123', prioridade: 'Baixa', prazo: 'Quinta', responsavel: 'Pedro Costa' },
  { titulo: 'Análise de Concorrência', prioridade: 'Média', prazo: 'Sexta', responsavel: 'Ana Oliveira' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard ERP Nexus</h1>
          <p className="text-sm text-gray-600 mt-1">Visão estratégica do seu negócio</p>
        </div>

        {/* KPIs Principais - Cards Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                +5% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Recorrente</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45.230</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                +8% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Pontual</CardTitle>
              <Zap className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 18.450</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                +12% este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.3%</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1 text-green-600" />
                -0.5% este mês
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contas do Dia e Semana */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Contas a Pagar - Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Fornecedor XYZ</p>
                    <p className="text-xs text-gray-500">Vence hoje</p>
                  </div>
                  <span className="font-semibold text-red-600">R$ 2.500,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Serviços de Hosting</p>
                    <p className="text-xs text-gray-500">Vence hoje</p>
                  </div>
                  <span className="font-semibold text-orange-600">R$ 850,00</span>
                </div>
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-red-600">
                    Total: R$ 3.350,00
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Contas a Receber - Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Cliente ABC</p>
                    <p className="text-xs text-gray-500">Vence hoje</p>
                  </div>
                  <span className="font-semibold text-green-600">R$ 5.200,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Startup XYZ</p>
                    <p className="text-xs text-gray-500">Vence hoje</p>
                  </div>
                  <span className="font-semibold text-blue-600">R$ 3.800,00</span>
                </div>
                <div className="text-center pt-2">
                  <Badge variant="outline" className="text-green-600">
                    Total: R$ 9.000,00
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saldo e Fluxo Diário */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Wallet className="h-4 w-4 text-blue-600" />
                Saldo em Contas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Banco do Brasil</span>
                  </div>
                  <span className="font-semibold text-blue-600">R$ 28.450,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Itaú</span>
                  </div>
                  <span className="font-semibold text-green-600">R$ 12.320,00</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Santander</span>
                  </div>
                  <span className="font-semibold text-purple-600">R$ 4.460,00</span>
                </div>
                <div className="border-t pt-3 text-center">
                  <p className="text-sm text-gray-600">Saldo Consolidado</p>
                  <p className="text-2xl font-bold text-gray-900">R$ 45.230,00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4 text-green-600" />
                Fluxo Diário - Esta Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={fluxoDiarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="dia" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `R$ ${value.toLocaleString()}`,
                      name === 'entrada' ? 'Entradas' : 'Saídas'
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="entrada" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="saida" 
                    stroke="#EF4444" 
                    strokeWidth={2}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 text-xs text-gray-500 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                  Entradas
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded"></div>
                  Saídas
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos Comerciais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Evolução da Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={receitaMensalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `R$ ${value.toLocaleString()}`,
                      name === 'receita' ? 'Receita' : 'Meta'
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="receita" fill="#3B82F6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="meta" fill="#E5E7EB" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Evolução do MRR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `R$ ${value.toLocaleString()}`,
                      name === 'mrr' ? 'MRR' : 'Churn'
                    ]}
                    contentStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="mrr" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="churn" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 text-xs text-gray-500 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded"></div>
                  MRR
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded"></div>
                  Churn
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receita por Serviço e Tarefas CRM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <PieChart className="h-4 w-4 text-purple-600" />
                Receita por Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={receitaPorServicoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="valor"
                  >
                    {receitaPorServicoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Valor']}
                    contentStyle={{ fontSize: '12px' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {receitaPorServicoData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'][index] }}
                      />
                      <span className="text-xs">{item.servico}</span>
                    </div>
                    <span className="text-xs font-medium">
                      R$ {item.valor.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <CheckSquare className="h-4 w-4 text-orange-600" />
                Tarefas CRM - Em Aberto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tarefasCRMData.map((tarefa, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{tarefa.titulo}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={tarefa.prioridade === 'Alta' ? 'destructive' : 
                                  tarefa.prioridade === 'Média' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {tarefa.prioridade}
                        </Badge>
                        <span className="text-xs text-gray-500">{tarefa.prazo}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">{tarefa.responsavel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 