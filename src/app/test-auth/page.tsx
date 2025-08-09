'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const { user, session, loading } = useAuth()
  const [testSession, setTestSession] = useState<any>(null)
  const [testUser, setTestUser] = useState<any>(null)

  useEffect(() => {
    const testAuth = async () => {
      try {
        console.log('🧪 Testando autenticação...')
        
        // Testar getSession
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('📋 Session test:', session)
        console.log('❌ Session error:', sessionError)
        setTestSession(session)

        // Testar getUser
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('👤 User test:', user)
        console.log('❌ User error:', userError)
        setTestUser(user)
        
      } catch (error) {
        console.error('❌ Erro no teste:', error)
      }
    }

    testAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Autenticação</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Status do Contexto de Auth</CardTitle>
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
              <div>
                <strong>User ID:</strong> {user?.id || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste Direto do Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Test Session:</strong> {testSession ? 'Ativa' : 'Nenhuma'}
              </div>
              <div>
                <strong>Test User:</strong> {testUser ? testUser.email : 'Nenhum'}
              </div>
              <div>
                <strong>Test User ID:</strong> {testUser?.id || 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-x-4">
              <Button 
                onClick={() => window.location.href = '/auth/login'}
                variant="outline"
              >
                Ir para Login
              </Button>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Ir para Dashboard
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
