'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle, AlertCircle, Info, Shield } from 'lucide-react'

export default function DebugPage() {
  const [connectionResult, setConnectionResult] = useState<any>(null)
  const [operationsResult, setOperationsResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    try {
      // Importar dinamicamente para evitar erros de SSR
      const { checkSupabaseSetup } = await import('@/lib/supabase-check')
      const result = await checkSupabaseSetup()
      setConnectionResult(result)
    } catch (error) {
      console.error('Erro no teste de conexão:', error)
      setConnectionResult({
        success: false,
        error: 'Erro inesperado',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testOperations = async () => {
    setIsLoading(true)
    try {
      // Importar dinamicamente para evitar erros de SSR
      const { testDatabaseTables } = await import('@/lib/supabase-check')
      const result = await testDatabaseTables()
      setOperationsResult(result)
    } catch (error) {
      console.error('Erro no teste de operações:', error)
      setOperationsResult({
        success: false,
        error: 'Erro inesperado',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else {
      return <XCircle className="h-5 w-5 text-red-600" />
    }
  }

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Debug do Supabase</h1>
          <p className="text-gray-600 mt-2">Teste a configuração do seu banco de dados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teste de Conexão */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Teste de Conexão</span>
              </CardTitle>
              <CardDescription>
                Verifica se o Supabase está conectado e as tabelas existem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testConnection} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </Button>

              {connectionResult && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(connectionResult.success)}
                    <span className={`font-medium ${getStatusColor(connectionResult.success)}`}>
                      {connectionResult.success ? 'Sucesso' : 'Falha'}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">{connectionResult.message || connectionResult.error}</p>
                    {connectionResult.details && (
                      <p className="text-gray-600 mt-1">{connectionResult.details}</p>
                    )}
                  </div>

                  {connectionResult.tables && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Tabelas:</p>
                      <div className="space-y-1">
                        {connectionResult.tables.map((table: any) => (
                          <div key={table.table} className="flex items-center space-x-2 text-sm">
                            {getStatusIcon(table.exists)}
                            <span>{table.table}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teste de Operações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Teste de RLS</span>
              </CardTitle>
              <CardDescription>
                Verifica se as políticas de segurança (RLS) estão funcionando
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testOperations} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar RLS'
                )}
              </Button>

              {operationsResult && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(operationsResult.success)}
                    <span className={`font-medium ${getStatusColor(operationsResult.success)}`}>
                      {operationsResult.success ? 'Sucesso' : 'Falha'}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p className="font-medium">{operationsResult.message || operationsResult.error}</p>
                    {operationsResult.details && (
                      <p className="text-gray-600 mt-1">{operationsResult.details}</p>
                    )}
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Se você não está logado, é normal que o teste mostre "RLS está funcionando". 
                      Isso significa que as políticas de segurança estão protegendo os dados corretamente.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informações de Configuração */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Informações de Configuração</span>
            </CardTitle>
            <CardDescription>
              Verifique se estas configurações estão corretas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Variáveis de Ambiente:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Não configurado'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Checklist de Configuração:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">•</span>
                    <span>Projeto criado no Supabase</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">•</span>
                    <span>Schema SQL executado</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">•</span>
                    <span>Authentication configurado</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">•</span>
                    <span>Storage bucket criado</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-blue-600">•</span>
                    <span>Políticas RLS configuradas</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Como usar:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Execute o "Teste de Conexão" primeiro</li>
                  <li>2. Se falhar, verifique as variáveis de ambiente</li>
                  <li>3. Execute o schema SQL no Supabase</li>
                  <li>4. Execute o "Teste de RLS"</li>
                  <li>5. Se tudo estiver OK, tente cadastrar um usuário</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">Sobre RLS:</h4>
                <p className="text-sm text-yellow-800">
                  <strong>Row Level Security (RLS)</strong> é um sistema de segurança que controla 
                  quem pode acessar quais dados. Se você não está logado, é normal que as operações 
                  sejam bloqueadas - isso significa que a segurança está funcionando!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 