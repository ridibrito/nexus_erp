'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Nexus ERP
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema completo de gestão empresarial para controlar clientes, 
            finanças, projetos e muito mais.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Cadastre e gerencie seus clientes de forma eficiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Controle completo de informações, histórico de negociações 
                e relacionamento com clientes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Controle Financeiro</CardTitle>
              <CardDescription>
                Gerencie receitas, despesas e fluxo de caixa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Acompanhe contas a pagar e receber, movimentações bancárias 
                e relatórios financeiros detalhados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestão de Projetos</CardTitle>
              <CardDescription>
                Organize e acompanhe seus projetos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Controle de tarefas, prazos, recursos e acompanhamento 
                do progresso dos projetos.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button size="lg" className="px-8">
                Entrar no Sistema
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="px-8">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 