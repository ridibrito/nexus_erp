'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { criarCliente } from '@/lib/actions/clientes'
import { criarClienteSimple } from '@/lib/actions/clientes-simple'
import { toast } from 'sonner'

export default function TestAuthSimplePage() {
  const [loading, setLoading] = useState(false)

  const handleTestCreate = async () => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('tipo', 'pessoa_fisica')
      formData.append('nome', 'Teste Cliente')
      formData.append('email', 'teste@cliente.com')
      formData.append('telefone', '11999999999')
      
      console.log('🧪 Testando criação de cliente...')
      const result = await criarCliente(formData)
      
      console.log('📋 Resultado:', result)
      
      if (result.success) {
        toast.success('Cliente criado com sucesso!')
      } else {
        toast.error(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      toast.error('Erro ao criar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleTestCreateSimple = async () => {
    setLoading(true)
    
    try {
      const formData = new FormData()
      formData.append('tipo', 'pessoa_fisica')
      formData.append('nome', 'Teste Cliente Simples')
      formData.append('email', 'teste-simples@cliente.com')
      formData.append('telefone', '11999999999')
      
      console.log('🧪 Testando criação de cliente (versão simples)...')
      const result = await criarClienteSimple(formData)
      
      console.log('📋 Resultado (simples):', result)
      
      if (result.success) {
        toast.success('Cliente criado com sucesso (versão simples)!')
      } else {
        toast.error(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      toast.error('Erro ao criar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Teste de Autenticação Simples</h1>
      
      <Button 
        onClick={handleTestCreate}
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Testando...' : 'Testar Criação de Cliente'}
      </Button>
      
      <Button 
        onClick={handleTestCreateSimple}
        disabled={loading}
        className="mb-4 ml-4"
        variant="outline"
      >
        {loading ? 'Testando...' : 'Testar Versão Simples'}
      </Button>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Instruções:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Faça login primeiro em /auth/login</li>
          <li>Clique no botão acima</li>
          <li>Verifique o console do navegador</li>
          <li>Verifique o terminal do servidor</li>
        </ol>
      </div>
    </div>
  )
}
