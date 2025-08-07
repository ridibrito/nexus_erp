'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientes, usePipelines, useUsuarios } from '@/hooks/use-api'
import { type Negocio, clientesAPI } from '@/lib/api'
import { maskCurrency, unmaskCurrency } from '@/lib/utils'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface NovoNegocioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (negocio: Omit<Negocio, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => Promise<void>
}

export function NovoNegocioModal({ open, onOpenChange, onSubmit }: NovoNegocioModalProps) {
  const { clientes, carregarClientes } = useClientes()
  const { pipelines } = usePipelines()
  const { usuarios } = useUsuarios()
  
  const [loading, setLoading] = useState(false)
  
  // Estados para criar cliente
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [clienteData, setClienteData] = useState({
    nome_fant: '',
    razao_social: '',
    cnpj: '',
    email: '',
    telefone: ''
  })
  const [savingCliente, setSavingCliente] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cliente_id: '',
    pipeline_id: '',
    etapa_id: '',
    valor: '',
    probabilidade: '50',
    prioridade: 'media',
    responsavel_id: '',
    proximo_contato: '',
    data_fechamento: ''
  })
  
  // Debug logs
  console.log('=== DEBUG NOVO NEGÓCIO MODAL ===')
  console.log('Clientes:', clientes)
  console.log('Pipelines:', pipelines)
  console.log('Usuários:', usuarios)
  console.log('FormData:', formData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (!formData.titulo.trim()) {
        toast.error('Título é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.cliente_id) {
        toast.error('Cliente é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.pipeline_id) {
        toast.error('Pipeline é obrigatório')
        setLoading(false)
        return
      }

      if (!formData.etapa_id) {
        toast.error('Etapa é obrigatória')
        setLoading(false)
        return
      }

      console.log('Dados do negócio a ser criado:', {
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        cliente_id: formData.cliente_id,
        pipeline_id: formData.pipeline_id,
        etapa_id: formData.etapa_id,
        valor: unmaskCurrency(formData.valor) || 0,
        probabilidade: parseInt(formData.probabilidade) || 50,
      })

      await onSubmit({
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        cliente_id: formData.cliente_id,
        pipeline_id: formData.pipeline_id,
        etapa_id: formData.etapa_id,
        valor: unmaskCurrency(formData.valor) || 0,
        probabilidade: parseInt(formData.probabilidade) || 50,
        // prioridade: formData.prioridade as 'baixa' | 'media' | 'alta',
        // responsavel_id: formData.responsavel_id || undefined,
        // proximo_contato: formData.proximo_contato || undefined,
        // data_fechamento: formData.data_fechamento || undefined,
        // status: 'ativo'
      })

      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        cliente_id: '',
        pipeline_id: '',
        etapa_id: '',
        valor: '',
        probabilidade: '50',
        prioridade: 'media',
        responsavel_id: '',
        proximo_contato: '',
        data_fechamento: ''
      })

      onOpenChange(false)
      toast.success('Negócio criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar negócio:', error)
      toast.error('Erro ao criar negócio. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handlePipelineChange = (pipelineId: string) => {
    setFormData(prev => ({
      ...prev,
      pipeline_id: pipelineId,
      etapa_id: '' // Reset etapa when pipeline changes
    }))
  }

  const getEtapasPipeline = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId)
    if (!pipeline) return []
    
    // For now, we'll use mock stages. In a real app, you'd fetch stages from the API
    return [
      { id: 'prospeccao', nome: 'Prospecção' },
      { id: 'qualificacao', nome: 'Qualificação' },
      { id: 'contato', nome: 'Contato Realizado' },
      { id: 'demo', nome: 'Demo Agendada' },
      { id: 'proposta', nome: 'Proposta Enviada' },
      { id: 'negociacao', nome: 'Negociação' },
      { id: 'fechado', nome: 'Fechado' }
    ]
  }

  const criarCliente = async () => {
    try {
      console.log('=== INICIANDO criarCliente ===')
      console.log('Dados do cliente:', clienteData)
      
      setSavingCliente(true)
      
      if (!clienteData.nome_fant) {
        toast.error('Nome fantasia é obrigatório')
        return
      }

      console.log('Chamando clientesAPI.criar...')
      const novoCliente = await clientesAPI.criar({
        nome_fant: clienteData.nome_fant,
        razao_social: clienteData.razao_social || undefined,
        cnpj: clienteData.cnpj || undefined,
        email: clienteData.email || undefined,
        telefone: clienteData.telefone || undefined,
        tipo: 'pessoa_juridica',
        status: 'ativo'
      })

      console.log('Cliente criado com sucesso:', novoCliente)
      toast.success('Cliente criado com sucesso!')
      
      // Recarregar lista de clientes
      console.log('Recarregando lista de clientes...')
      await carregarClientes()
      
      // Selecionar o cliente recém-criado
      console.log('Selecionando cliente recém-criado:', novoCliente.id)
      setFormData(prev => ({ ...prev, cliente_id: novoCliente.id }))
      
      // Fechar modal e limpar dados
      setShowClienteModal(false)
      setClienteData({
        nome_fant: '',
        razao_social: '',
        cnpj: '',
        email: '',
        telefone: ''
      })
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      console.log('Tipo do erro:', typeof error)
      console.log('Erro é instância de Error?', error instanceof Error)
      console.log('Mensagem do erro:', error instanceof Error ? error.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(error, null, 2))
      toast.error('Erro ao criar cliente')
    } finally {
      setSavingCliente(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl" style={{ zIndex: 9999 }}>
          <DialogHeader>
            <DialogTitle>Novo Negócio</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                  placeholder="Ex: Site E-commerce - Cliente ABC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.cliente_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
                    required
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                                      <SelectContent>
                    {clientes.length === 0 ? (
                      <SelectItem value="" disabled>
                        Nenhum cliente encontrado
                      </SelectItem>
                    ) : (
                      clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome_fant || cliente.nome || 'Cliente sem nome'}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowClienteModal(true)}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva o negócio..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pipeline">Pipeline *</Label>
                <Select
                  value={formData.pipeline_id}
                  onValueChange={handlePipelineChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelines.map((pipeline) => (
                      <SelectItem key={pipeline.id} value={pipeline.id}>
                        {pipeline.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="etapa">Etapa *</Label>
                <Select
                  value={formData.etapa_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, etapa_id: value }))}
                  required
                  disabled={!formData.pipeline_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.pipeline_id && getEtapasPipeline(formData.pipeline_id).map((etapa) => (
                      <SelectItem key={etapa.id} value={etapa.id}>
                        {etapa.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="text"
                  value={formData.valor}
                  onChange={(e) => {
                    const maskedValue = maskCurrency(e.target.value)
                    setFormData(prev => ({ ...prev, valor: maskedValue }))
                  }}
                  placeholder="R$ 0,00"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="probabilidade">Probabilidade (%)</Label>
                <Select
                  value={formData.probabilidade}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, probabilidade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="25">25%</SelectItem>
                    <SelectItem value="50">50%</SelectItem>
                    <SelectItem value="75">75%</SelectItem>
                    <SelectItem value="90">90%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Select
                  value={formData.responsavel_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome || usuario.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proximo_contato">Próximo Contato</Label>
                <Input
                  id="proximo_contato"
                  type="date"
                  value={formData.proximo_contato}
                  onChange={(e) => setFormData(prev => ({ ...prev, proximo_contato: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data_fechamento">Data de Fechamento</Label>
                <Input
                  id="data_fechamento"
                  type="date"
                  value={formData.data_fechamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_fechamento: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Negócio'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Criar Cliente - Renderizado via Portal */}
      {showClienteModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Cliente</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome_fant">Nome Fantasia *</Label>
                <Input 
                  id="nome_fant"
                  placeholder="Nome fantasia da empresa"
                  value={clienteData.nome_fant}
                  onChange={(e) => setClienteData(prev => ({ ...prev, nome_fant: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="razao_social">Razão Social</Label>
                <Input 
                  id="razao_social"
                  placeholder="Razão social da empresa"
                  value={clienteData.razao_social}
                  onChange={(e) => setClienteData(prev => ({ ...prev, razao_social: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input 
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={clienteData.cnpj}
                  onChange={(e) => setClienteData(prev => ({ ...prev, cnpj: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="contato@empresa.com"
                  value={clienteData.email}
                  onChange={(e) => setClienteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input 
                  id="telefone"
                  placeholder="(11) 99999-9999"
                  value={clienteData.telefone}
                  onChange={(e) => setClienteData(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowClienteModal(false)
                  setClienteData({
                    nome_fant: '',
                    razao_social: '',
                    cnpj: '',
                    email: '',
                    telefone: ''
                  })
                }}
                disabled={savingCliente}
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={criarCliente}
                disabled={savingCliente || !clienteData.nome_fant}
              >
                {savingCliente ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Cliente'
                )}
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
} 