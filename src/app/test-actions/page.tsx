'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { atualizarClienteDetalhes } from '@/lib/actions/clientes'

export default function TestActionsPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testUpdateCliente = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const formData = new FormData()
      formData.append('nome', 'Teste Cliente')
      formData.append('email', 'teste@example.com')
      formData.append('telefone', '(11) 99999-9999')
      
      const response = await atualizarClienteDetalhes('test-id', formData)
      
      setResult(JSON.stringify(response, null, 2))
    } catch (error) {
      setResult(`Erro: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Server Actions</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Teste de Atualização de Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={testUpdateCliente} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Testando...' : 'Testar atualizarClienteDetalhes'}
              </Button>
              
              {result && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Resultado:</h3>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                    {result}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
