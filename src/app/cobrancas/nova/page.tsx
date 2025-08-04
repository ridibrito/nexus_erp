'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Plus, Send, User } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatCurrency } from '@/lib/utils'

const cobrancaSchema = z.object({
  cliente_id: z.string().min(1, 'Selecione um cliente'),
  valor: z.string().min(1, 'Valor é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  data_vencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
})

type CobrancaFormData = z.infer<typeof cobrancaSchema>

// Dados mockados de clientes
const clientesMock = [
  { id: '1', nome_razao_social: 'Empresa ABC Ltda', email: 'contato@abc.com.br' },
  { id: '2', nome_razao_social: 'João Silva Consultoria', email: 'joao@consultoria.com.br' },
  { id: '3', nome_razao_social: 'Tech Solutions', email: 'contato@techsolutions.com.br' },
]

export default function NovaCobrancaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<string>('')
  const [showClienteSelect, setShowClienteSelect] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CobrancaFormData>({
    resolver: zodResolver(cobrancaSchema),
    defaultValues: {
      data_vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
    },
  })

  const valor = watch('valor')
  const valorNumerico = parseFloat(valor) || 0

  const handleClienteSelect = (clienteId: string) => {
    setSelectedCliente(clienteId)
    setShowClienteSelect(false)
  }

  const handleSubmitCobranca = async (data: CobrancaFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implementar integração com Stripe e Supabase
      console.log('Dados da cobrança:', data)
      
      // Simular criação da cobrança
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Cobrança criada e enviada com sucesso!')
      // TODO: Redirecionar para página de cobranças
    } catch (error) {
      toast.error('Erro ao criar cobrança')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const clienteSelecionado = clientesMock.find(c => c.id === selectedCliente)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cobrancas" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Cobranças
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Nova Cobrança</h1>
          <p className="text-muted-foreground mt-2">
            Crie uma nova cobrança para seu cliente
          </p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Dados da Cobrança</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleSubmitCobranca)} className="space-y-6">
                {/* Seleção de Cliente */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cliente *
                  </label>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => setShowClienteSelect(!showClienteSelect)}
                    >
                      <span>
                        {clienteSelecionado ? clienteSelecionado.nome_razao_social : 'Selecione um cliente'}
                      </span>
                      <User className="h-4 w-4" />
                    </Button>
                    
                    {showClienteSelect && (
                      <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg">
                        {clientesMock.map((cliente) => (
                          <button
                            key={cliente.id}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-muted flex flex-col"
                            onClick={() => handleClienteSelect(cliente.id)}
                          >
                            <span className="font-medium">{cliente.nome_razao_social}</span>
                            <span className="text-sm text-muted-foreground">{cliente.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="hidden"
                    {...register('cliente_id')}
                    value={selectedCliente}
                  />
                  {errors.cliente_id && (
                    <p className="text-sm text-destructive mt-1">{errors.cliente_id.message}</p>
                  )}
                </div>

                {/* Valor */}
                <div>
                  <label htmlFor="valor" className="block text-sm font-medium mb-2">
                    Valor *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('valor')}
                      placeholder="0,00"
                      className="pl-8"
                      className={errors.valor ? 'border-destructive' : ''}
                    />
                  </div>
                  {errors.valor && (
                    <p className="text-sm text-destructive mt-1">{errors.valor.message}</p>
                  )}
                  {valorNumerico > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Valor por extenso: {formatCurrency(valorNumerico)}
                    </p>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium mb-2">
                    Descrição do Serviço *
                  </label>
                  <textarea
                    id="descricao"
                    {...register('descricao')}
                    placeholder="Descreva o serviço prestado..."
                    className="w-full h-24 px-3 py-2 border border-input rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    className={errors.descricao ? 'border-destructive' : ''}
                  />
                  {errors.descricao && (
                    <p className="text-sm text-destructive mt-1">{errors.descricao.message}</p>
                  )}
                </div>

                {/* Data de Vencimento */}
                <div>
                  <label htmlFor="data_vencimento" className="block text-sm font-medium mb-2">
                    Data de Vencimento *
                  </label>
                  <Input
                    id="data_vencimento"
                    type="date"
                    {...register('data_vencimento')}
                    className={errors.data_vencimento ? 'border-destructive' : ''}
                  />
                  {errors.data_vencimento && (
                    <p className="text-sm text-destructive mt-1">{errors.data_vencimento.message}</p>
                  )}
                </div>

                {/* Resumo */}
                {valorNumerico > 0 && (
                  <div className="bg-muted p-4 rounded-md">
                    <h4 className="font-medium mb-2">Resumo da Cobrança</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Cliente:</span>
                        <span>{clienteSelecionado?.nome_razao_social || 'Não selecionado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor:</span>
                        <span className="font-medium">{formatCurrency(valorNumerico)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vencimento:</span>
                        <span>{watch('data_vencimento')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex justify-end space-x-4">
                  <Link href="/cobrancas">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={isLoading}>
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Criando...' : 'Criar e Enviar Cobrança'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 