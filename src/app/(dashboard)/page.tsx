'use client'

import { useState, useEffect } from 'react'
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
  MessageSquare,
  Loader2
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
import { supabase } from '@/lib/supabase'

interface DashboardData {
  totalClientes: number
  clientesAtivos: number
  novosEsteMes: number
  ticketMedio: number
  contasPagar: any[]
  contasReceber: any[]
  saldoContas: any[]
  fluxoDiario: any[]
  receitaMensal: any[]
  mrr: any[]
  receitaPorServico: any[]
  tarefasCRM: any[]
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [empresa, setEmpresa] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalClientes: 0,
    clientesAtivos: 0,
    novosEsteMes: 0,
    ticketMedio: 0,
    contasPagar: [],
    contasReceber: [],
    saldoContas: [],
    fluxoDiario: [],
    receitaMensal: [],
    mrr: [],
    receitaPorServico: [],
    tarefasCRM: []
  })

  useEffect(() => {
    carregarDadosDashboard()
  }, [])

  const carregarDadosDashboard = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Buscar empresa do usuário
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!usuario?.empresa_id) {
        console.log('Usuário não tem empresa_id')
        return
      }

      const empresaId = usuario.empresa_id

      // Buscar dados completos da empresa
      const { data: empresaData, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single()

      if (empresaError) {
        console.error('Erro ao buscar empresa:', empresaError)
        return
      }

      if (empresaData) {
        setEmpresa(empresaData)
        console.log('Dados da empresa carregados:', empresaData)
      }

      // Carregar dados dos clientes
      const { data: clientes } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', empresaId)

      // Carregar dados dos negócios
      const { data: negocios } = await supabase
        .from('negocios')
        .select('*')
        .eq('empresa_id', empresaId)

      // Processar dados
      const totalClientes = clientes?.length || 0
      const clientesAtivos = clientes?.filter(c => c.status === 'ativo').length || 0
      const novosEsteMes = clientes?.filter(c => {
        const createdDate = new Date(c.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear()
      }).length || 0

      const valorTotalNegocios = negocios?.reduce((sum, n) => sum + (n.valor || 0), 0) || 0
      const ticketMedio = totalClientes > 0 ? valorTotalNegocios / totalClientes : 0

      // Dados vazios para demonstração (serão substituídos por dados reais)
      const contasPagar: any[] = []
      const contasReceber: any[] = []
      const saldoContas: any[] = []
      const fluxoDiario: any[] = [
        { dia: 'Seg', entrada: 0, saida: 0 },
        { dia: 'Ter', entrada: 0, saida: 0 },
        { dia: 'Qua', entrada: 0, saida: 0 },
        { dia: 'Qui', entrada: 0, saida: 0 },
        { dia: 'Sex', entrada: 0, saida: 0 },
        { dia: 'Sab', entrada: 0, saida: 0 },
        { dia: 'Dom', entrada: 0, saida: 0 },
      ]
      const receitaMensal: any[] = []
      const mrr: any[] = []
      const receitaPorServico: any[] = []
      const tarefasCRM: any[] = []

      setDashboardData({
        totalClientes,
        clientesAtivos,
        novosEsteMes,
        ticketMedio,
        contasPagar,
        contasReceber,
        saldoContas,
        fluxoDiario,
        receitaMensal,
        mrr,
        receitaPorServico,
        tarefasCRM
      })
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard ERP Nexus
            {empresa && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                - {empresa.nome_fantasia || empresa.nome}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-600 mt-1">Visão estratégica do seu negócio</p>
        </div>

        {/* KPIs Principais - Cards Clean */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalClientes}</div>
              <div className="flex items-center text-xs mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                {dashboardData.novosEsteMes} novos este mês
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.clientesAtivos}</div>
              <div className="flex items-center text-xs mt-1">
                {dashboardData.totalClientes > 0 ? (
                  <span>{Math.round((dashboardData.clientesAtivos / dashboardData.totalClientes) * 100)}% do total</span>
                ) : (
                  <span>0% do total</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {dashboardData.ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center text-xs mt-1">
                <span>Por cliente</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.novosEsteMes}</div>
              <div className="flex items-center text-xs mt-1">
                <span>Clientes</span>
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
              {dashboardData.contasPagar.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.contasPagar.map((conta, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{conta.nome}</p>
                        <p className="text-xs text-gray-500">Vence hoje</p>
                      </div>
                      <span className="font-semibold text-red-600">R$ {conta.valor.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Badge variant="outline" className="text-red-600">
                      Total: R$ {dashboardData.contasPagar.reduce((sum, conta) => sum + conta.valor, 0).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Nenhuma conta a pagar hoje</p>
                </div>
              )}
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
              {dashboardData.contasReceber.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.contasReceber.map((conta, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{conta.nome}</p>
                        <p className="text-xs text-gray-500">Vence hoje</p>
                      </div>
                      <span className="font-semibold text-green-600">R$ {conta.valor.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Badge variant="outline" className="text-green-600">
                      Total: R$ {dashboardData.contasReceber.reduce((sum, conta) => sum + conta.valor, 0).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Nenhuma conta a receber hoje</p>
                </div>
              )}
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
              {dashboardData.saldoContas.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.saldoContas.map((conta, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{conta.nome}</span>
                      </div>
                      <span className="font-semibold text-blue-600">R$ {conta.saldo.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-3 text-center">
                    <p className="text-sm text-gray-600">Saldo Consolidado</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {dashboardData.saldoContas.reduce((sum, conta) => sum + conta.saldo, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Nenhuma conta configurada</p>
                </div>
              )}
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
                <LineChart data={dashboardData.fluxoDiario}>
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
              {dashboardData.receitaMensal.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={dashboardData.receitaMensal}>
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
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-sm">Nenhum dado de receita disponível</p>
                </div>
              )}
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
              {dashboardData.mrr.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dashboardData.mrr}>
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
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-sm">Nenhum dado de MRR disponível</p>
                </div>
              )}
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
              {dashboardData.receitaPorServico.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPieChart>
                      <Pie
                        data={dashboardData.receitaPorServico}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="valor"
                      >
                        {dashboardData.receitaPorServico.map((entry, index) => (
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
                    {dashboardData.receitaPorServico.map((item, index) => (
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
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-sm">Nenhum dado de receita por serviço disponível</p>
                </div>
              )}
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
              {dashboardData.tarefasCRM.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.tarefasCRM.map((tarefa, index) => (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">Nenhuma tarefa CRM em aberto</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Fluxo de Caixa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Fluxo de Caixa Diário</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dashboardData.fluxoDiario}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="entrada" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="saida" stackId="1" stroke="#EF4444" fill="#EF4444" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Receita Mensal */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.receitaMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="receita" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 