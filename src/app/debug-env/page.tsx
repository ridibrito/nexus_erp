'use client'

import { useState, useEffect } from 'react'

export default function DebugEnvPage() {
  const [envInfo, setEnvInfo] = useState<any>({})
  const [supabaseTest, setSupabaseTest] = useState<any>({})

  useEffect(() => {
    // Verificar variáveis de ambiente (apenas as públicas)
    setEnvInfo({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'Não definida',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida',
    })

    // Testar conexão com Supabase
    testSupabaseConnection()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data, error } = await supabase.auth.getSession()
      
      setSupabaseTest({
        success: !error,
        error: error?.message || null,
        hasSession: !!data.session
      })
    } catch (error) {
      setSupabaseTest({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        hasSession: false
      })
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug - Configuração</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Variáveis de Ambiente</h2>
          <div className="space-y-2">
            {Object.entries(envInfo).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-sm">{key}:</span>
                <span className={`text-sm ${value === 'Definida' ? 'text-green-600' : 'text-red-600'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Teste de Conexão Supabase</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Conexão:</span>
              <span className={supabaseTest.success ? 'text-green-600' : 'text-red-600'}>
                {supabaseTest.success ? 'Sucesso' : 'Falha'}
              </span>
            </div>
            {supabaseTest.error && (
              <div className="flex justify-between">
                <span>Erro:</span>
                <span className="text-red-600 text-sm">{supabaseTest.error}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Sessão:</span>
              <span className={supabaseTest.hasSession ? 'text-green-600' : 'text-gray-600'}>
                {supabaseTest.hasSession ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Links de Teste</h2>
          <div className="space-y-2">
            <a href="/test" className="block text-blue-600 hover:underline">
              /test - Página de teste simples
            </a>
            <a href="/dashboard-simple" className="block text-blue-600 hover:underline">
              /dashboard-simple - Dashboard simplificado
            </a>
            <a href="/" className="block text-blue-600 hover:underline">
              / - Página inicial (redireciona para dashboard)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
