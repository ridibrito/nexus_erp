'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<any>({})
  const [supabaseTest, setSupabaseTest] = useState<any>(null)

  useEffect(() => {
    // Verificar variáveis de ambiente
    const vars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configurada' : 'Não configurada',
      NODE_ENV: process.env.NODE_ENV,
    }
    setEnvVars(vars)

    // Testar conexão com Supabase
    const testSupabase = async () => {
      try {
        const { createBrowserClient } = await import('@supabase/ssr')
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) {
          setSupabaseTest({ error: 'Variáveis de ambiente não configuradas' })
          return
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
        
        // Testar conexão
        const { data, error } = await supabase.auth.getSession()
        
        setSupabaseTest({
          success: !error,
          session: !!data.session,
          error: error?.message
        })
        
      } catch (error) {
        setSupabaseTest({ error: error.message })
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Configuração</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Variáveis de Ambiente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}:</strong> {String(value)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teste do Supabase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {supabaseTest ? (
                <>
                  <div>
                    <strong>Status:</strong> {supabaseTest.success ? '✅ Conectado' : '❌ Erro'}
                  </div>
                  {supabaseTest.session !== undefined && (
                    <div>
                      <strong>Sessão:</strong> {supabaseTest.session ? 'Ativa' : 'Nenhuma'}
                    </div>
                  )}
                  {supabaseTest.error && (
                    <div>
                      <strong>Erro:</strong> {supabaseTest.error}
                    </div>
                  )}
                </>
              ) : (
                <div>Carregando...</div>
              )}
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
                Testar Login
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Recarregar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
