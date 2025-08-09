'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

export default function NegociosDebugPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const testNegociosAPI = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Testando API de negócios...')
      console.log('👤 Usuário atual:', user?.email)
      
      // Testar conexão básica com Supabase
      const { data: { session } } = await supabase.auth.getSession()
      console.log('🔑 Sessão:', session ? 'Ativa' : 'Não encontrada')
      
      // Testar busca de negócios
      const { data: negocios, error: negociosError } = await supabase
        .from('negocios')
        .select('*')
        .limit(5)
      
      console.log('📊 Resultado negócios:', { data: negocios, error: negociosError })
      
      if (negociosError) {
        throw negociosError
      }
      
      setData({
        session: session ? 'Ativa' : 'Não encontrada',
        user: user?.email,
        negocios: negocios || []
      })
      
    } catch (err) {
      console.error('❌ Erro no teste:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      testNegociosAPI()
    }
  }, [authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug - Página de Negócios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Status da Autenticação</h3>
              <p>Usuário: {user?.email || 'Não autenticado'}</p>
              <p>Loading: {authLoading ? 'Sim' : 'Não'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Teste da API</h3>
              <Button onClick={testNegociosAPI} disabled={loading}>
                {loading ? 'Testando...' : 'Testar API'}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="font-semibold text-red-800 mb-2">Erro:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {data && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-semibold text-green-800 mb-2">Dados:</h3>
                <pre className="text-sm text-green-700 overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
