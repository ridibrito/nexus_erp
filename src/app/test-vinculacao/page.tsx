'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { criarCliente, vincularPessoaEmpresa, testarVinculacaoRLS } from '@/lib/actions/clientes'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function TestVinculacaoPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [rlsResult, setRlsResult] = useState<any>(null)

  const testarCriarCliente = async () => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('tipo', 'pessoa_fisica')
      formData.append('nome', 'João Silva Teste')
      formData.append('email', 'joao.teste@email.com')
      formData.append('telefone', '(11) 99999-9999')

      const result = await criarCliente(formData)
      setResult(result)
      
      if (result.success) {
        toast.success('Cliente criado com sucesso!')
        console.log('Cliente criado:', result.data)
      } else {
        toast.error(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao testar')
    } finally {
      setLoading(false)
    }
  }

  const testarVinculacao = async () => {
    if (!result?.data?.id) {
      toast.error('Crie um cliente primeiro')
      return
    }

    setLoading(true)
    try {
      const vinculacaoResult = await vincularPessoaEmpresa(
        '00000000-0000-0000-0000-000000000001', // ID de teste
        result.data.id,
        'pessoa'
      )
      
      if (vinculacaoResult.success) {
        toast.success('Vinculação criada com sucesso!')
        console.log('Vinculação criada:', vinculacaoResult)
      } else {
        toast.error(vinculacaoResult.error || 'Erro ao vincular')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao testar vinculação')
    } finally {
      setLoading(false)
    }
  }

  const testarRLS = async () => {
    setLoading(true)
    try {
      const rlsResult = await testarVinculacaoRLS()
      setRlsResult(rlsResult)
      
      if (rlsResult.success) {
        toast.success('Teste RLS passou!')
        console.log('Teste RLS:', rlsResult)
      } else {
        toast.error(rlsResult.error || 'Erro no teste RLS')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao testar RLS')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Teste de Vinculação</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Testar Políticas RLS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testarRLS}
              disabled={loading}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Testar Políticas RLS'
              )}
            </Button>
            
            {rlsResult && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Resultado RLS:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(rlsResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testar Criação de Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testarCriarCliente}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Criar Cliente de Teste'
              )}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">Resultado:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testar Vinculação</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testarVinculacao}
              disabled={loading || !result?.data?.id}
              className="w-full"
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testando...
                </>
              ) : (
                'Testar Vinculação'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
