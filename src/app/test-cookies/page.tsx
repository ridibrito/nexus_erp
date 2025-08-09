'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/auth-context'

export default function TestCookiesPage() {
  const { user, session } = useAuth()
  const [cookies, setCookies] = useState<string[]>([])
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    // Verificar cookies do navegador
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim())
    setCookies(allCookies)

    // Verificar sessão do Supabase
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSessionInfo(session)
    }
    checkSession()
  }, [])

  const testLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'ricardo@coruss.com.br',
      password: '123456'
    })
    
    if (data.session) {
      console.log('✅ Login bem-sucedido:', data.session)
      window.location.reload()
    } else {
      console.error('❌ Erro no login:', error)
    }
  }

  const testLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Cookies</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Status da Autenticação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>User:</strong> {user ? user.email : 'Nenhum'}
              </div>
              <div>
                <strong>Session:</strong> {session ? 'Ativa' : 'Nenhuma'}
              </div>
              <div>
                <strong>Session Info:</strong> {sessionInfo ? 'Disponível' : 'Nenhuma'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies do Navegador</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cookies.map((cookie, index) => (
                <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {cookie}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button onClick={testLogin} variant="outline">
                Testar Login
              </Button>
              <Button onClick={testLogout} variant="outline">
                Testar Logout
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Recarregar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
