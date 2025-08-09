'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, DollarSign, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function DashboardSimplePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    clientesAtivos: 0,
    novosEsteMes: 0,
    ticketMedio: 0
  })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      
      // Verificar usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Erro ao obter usuário:', userError)
        return
      }
      
      if (!user) {
        console.log('Usuário não autenticado')
        return
      }

      setUser(user)
      console.log('✅ Usuário autenticado:', user.email)

      // Buscar dados básicos
      const { data: clientes, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('empresa_id', '00000000-0000-0000-0000-000000000000')

      if (clientesError) {
        console.error('Erro ao carregar clientes:', clientesError)
      }

      // Processar dados
      const totalClientes = clientes?.length || 0
      const clientesAtivos = clientes?.filter(c => c.status === 'ativo').length || 0
      const novosEsteMes = clientes?.filter(c => {
        const createdDate = new Date(c.created_at)
        const now = new Date()
        return createdDate.getMonth() === now.getMonth() && 
               createdDate.getFullYear() === now.getFullYear()
      }).length || 0

      setDashboardData({
        totalClientes,
        clientesAtivos,
        novosEsteMes,
        ticketMedio: 0
      })

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuário não autenticado</h2>
          <p className="text-gray-600">Faça login para acessar o dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard ERP Nexus - Versão Simples
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Usuário: {user.email}
          </p>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalClientes}</div>
              <div className="flex items-center text-xs mt-1">
                <span>Total cadastrado</span>
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

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">✅</div>
              <div className="flex items-center text-xs mt-1">
                <span>Sistema Funcionando</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações do Usuário */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Informações da Sessão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>ID:</strong> {user.id}
              </div>
              <div>
                <strong>Último Login:</strong> {new Date(user.last_sign_in_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
