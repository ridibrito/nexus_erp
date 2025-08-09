'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export default function TestMiddlewarePage() {
  const { user, session, loading } = useAuth()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  const testRedirect = () => {
    window.location.href = '/dashboard'
  }

  const testLogin = () => {
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste do Middleware</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações da Página</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Pathname Atual:</strong> {currentPath}
              </div>
              <div>
                <strong>URL Completa:</strong> {window.location.href}
              </div>
              <div>
                <strong>Search Params:</strong> {window.location.search}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status da Autenticação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Loading:</strong> {loading ? 'Sim' : 'Não'}
              </div>
              <div>
                <strong>User:</strong> {user ? user.email : 'Nenhum'}
              </div>
              <div>
                <strong>Session:</strong> {session ? 'Ativa' : 'Nenhuma'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
                             <Button onClick={testRedirect} variant="outline">
                 Testar Redirecionamento para /dashboard
               </Button>
              <Button onClick={testLogin} variant="outline">
                Ir para Login
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
