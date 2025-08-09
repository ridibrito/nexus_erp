'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useClientes, usePipelines, useUsuarios } from '@/hooks/use-api'
import { type Negocio } from '@/lib/api'
import { pipelinesAPI } from '@/lib/api'
import { maskCurrency, unmaskCurrency } from '@/lib/utils'
import { Plus, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { criarCliente as criarClienteAction } from '@/lib/actions/clientes'

interface NovoNegocioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (negocio: Omit<Negocio, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => Promise<void>
  selectedPipeline?: string
  selectedEtapa?: string
  currentUser?: { id: string; nome: string }
}

export function NovoNegocioModal({ open, onOpenChange, onSubmit, selectedPipeline, selectedEtapa, currentUser }: NovoNegocioModalProps) {
  const { clientes, carregarClientes, loading: loadingClientes } = useClientes()
  const { pipelines, loading: loadingPipelines } = usePipelines()
  const { usuarios, loading: loadingUsuarios } = useUsuarios()
  
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
    pipeline_id: selectedPipeline || '',
    etapa_id: selectedEtapa || undefined,
    valor: '',
    probabilidade: '50',
    prioridade: 'media',
    responsavel_id: currentUser?.id || undefined,
    proximo_contato: '',
    data_fechamento: ''
  })

  // Atualizar formData quando as props mudarem
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      pipeline_id: selectedPipeline || '',
      etapa_id: selectedEtapa || undefined,
      responsavel_id: currentUser?.id || undefined
    }))
  }, [selectedPipeline, selectedEtapa, currentUser])

  // Carregar etapas quando o pipeline inicial for definido
  useEffect(() => {
    if (selectedPipeline) {
      getEtapasPipeline(selectedPipeline)
    }
  }, [selectedPipeline])

  // Fechar dropdown de busca quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.cliente-search-container')) {
        setClienteSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  // Debug logs
  console.log('=== DEBUG NOVO NEGÓCIO MODAL ===')
  console.log('Clientes:', clientes)
  console.log('Pipelines:', pipelines)
  console.log('Usuários:', usuarios)
  console.log('FormData:', formData)
  
  // Verificar se os arrays têm dados
  console.log('Clientes length:', clientes?.length)
  console.log('Pipelines length:', pipelines?.length)
  console.log('Usuários length:', usuarios?.length)
  
  // Verificar estrutura dos primeiros itens
  if (clientes?.length > 0) {
    console.log('Primeiro cliente:', clientes[0])
  }
  if (pipelines?.length > 0) {
    console.log('Primeiro pipeline:', pipelines[0])
  }
  if (usuarios?.length > 0) {
    console.log('Primeiro usuário:', usuarios[0])
  }
  
  // Verificar se os hooks estão carregando
  console.log('Loading clientes:', loadingClientes)
  console.log('Loading pipelines:', loadingPipelines)
  console.log('Loading usuarios:', loadingUsuarios)

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

      

      if (!formData.pipeline_id) {
        toast.error('Pipeline é obrigatório')
        setLoading(false)
        return
      }

      

      console.log('Dados do negócio a ser criado:', {
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        cliente_id: formData.cliente_id || undefined,
        pipeline_id: formData.pipeline_id,
        etapa_id: formData.etapa_id || undefined,
        responsavel_id: formData.responsavel_id || undefined,
        valor: formData.valor ? unmaskCurrency(formData.valor) : undefined,
        probabilidade: parseInt(formData.probabilidade) || 50,
      })

             await onSubmit({
         titulo: formData.titulo,
         descricao: formData.descricao || undefined,
         cliente_id: formData.cliente_id || undefined,
         pipeline_id: formData.pipeline_id,
         etapa_id: formData.etapa_id || undefined,
         responsavel_id: formData.responsavel_id || undefined,
         valor: formData.valor ? unmaskCurrency(formData.valor) : undefined,
         probabilidade: parseInt(formData.probabilidade) || 50,
       })

      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        cliente_id: '',
        pipeline_id: selectedPipeline || '',
        etapa_id: selectedEtapa || undefined,
        valor: '',
        probabilidade: '50',
        prioridade: 'media',
        responsavel_id: currentUser?.id || undefined,
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

  const handlePipelineChange = async (pipelineId: string) => {
    setFormData(prev => ({
      ...prev,
      pipeline_id: pipelineId,
      etapa_id: undefined // Reset etapa when pipeline changes
    }))
    
    // Buscar etapas do pipeline selecionado e definir primeira etapa
    if (pipelineId) {
      try {
        const pipelineComEtapas = await pipelinesAPI.buscarComEtapas(pipelineId)
        if (pipelineComEtapas && pipelineComEtapas.etapas.length > 0) {
          setEtapasPipeline(pipelineComEtapas.etapas)
          // Definir a primeira etapa automaticamente
          const primeiraEtapa = pipelineComEtapas.etapas[0]
          setFormData(prev => ({ 
            ...prev, 
            pipeline_id: pipelineId,
            etapa_id: primeiraEtapa.id 
          }))
        } else {
          setEtapasPipeline([])
        }
      } catch (error) {
        console.error('Erro ao buscar etapas do pipeline:', error)
        setEtapasPipeline([])
      }
    }
  }

  const [etapasPipeline, setEtapasPipeline] = useState<any[]>([])
  const [clienteSearchOpen, setClienteSearchOpen] = useState(false)
  const [clienteSearchTerm, setClienteSearchTerm] = useState('')

  const getEtapasPipeline = async (pipelineId: string) => {
    try {
      console.log('Buscando etapas para pipeline:', pipelineId)
      const pipelineComEtapas = await pipelinesAPI.buscarComEtapas(pipelineId)
      if (pipelineComEtapas && pipelineComEtapas.etapas.length > 0) {
        console.log('Etapas encontradas:', pipelineComEtapas.etapas)
        setEtapasPipeline(pipelineComEtapas.etapas)
        
        // Definir a primeira etapa como padrão se não houver etapa selecionada
        if (!formData.etapa_id) {
          const primeiraEtapa = pipelineComEtapas.etapas[0]
          setFormData(prev => ({ ...prev, etapa_id: primeiraEtapa.id }))
        }
      } else {
        console.log('Pipeline não encontrado ou sem etapas')
        setEtapasPipeline([])
      }
    } catch (error) {
      console.error('Erro ao buscar etapas do pipeline:', error)
      setEtapasPipeline([])
    }
  }

  // Filtrar clientes baseado no termo de busca
  const filteredClientes = clientes?.filter(cliente => {
    const searchTerm = clienteSearchTerm.toLowerCase()
    const nomeFant = cliente.nome_fant?.toLowerCase() || ''
    const razaoSocial = cliente.razao_social?.toLowerCase() || ''
    const nome = cliente.nome?.toLowerCase() || ''
    
    return nomeFant.includes(searchTerm) || 
           razaoSocial.includes(searchTerm) || 
           nome.includes(searchTerm)
  }) || []

  const handleCriarCliente = async () => {
    try {
      console.log('=== INICIANDO criarCliente ===')
      console.log('Dados do cliente:', clienteData)
      
      setSavingCliente(true)
      
      if (!clienteData.nome_fant) {
        toast.error('Nome fantasia é obrigatório')
        return
      }

      const formData = new FormData()
      formData.append('nome', clienteData.nome_fant)
      formData.append('email', clienteData.email || '')
      formData.append('tipo', 'pessoa_juridica')
      formData.append('telefone', clienteData.telefone || '')

      const result = await criarClienteAction(formData)
      if (result.success) {
        const novoCliente = result.data
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
      } else {
        toast.error('Erro ao criar cliente')
      }
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
                    {open && (
         <div className="fixed inset-0 z-[9998] bg-black bg-opacity-50 flex items-center justify-center">
           <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ zIndex: 10001 }}>
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold">Novo Negócio</h2>
               <button
                 onClick={() => onOpenChange(false)}
                 className="text-gray-400 hover:text-gray-600"
               >
                 ✕
               </button>
             </div>

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
                 <Label htmlFor="cliente">Cliente</Label>
                 <div className="flex gap-2">
                   <div className="flex-1 relative cliente-search-container">
                     <div className="relative">
                       <Input
                         placeholder="Buscar cliente..."
                         value={clienteSearchTerm}
                         onChange={(e) => setClienteSearchTerm(e.target.value)}
                         onFocus={() => setClienteSearchOpen(true)}
                         className="pr-10"
                       />
                       <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     </div>
                     
                     {clienteSearchOpen && (
                       <div className="absolute z-[10003] w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                         {loadingClientes ? (
                           <div className="p-2 text-sm text-gray-500">Carregando clientes...</div>
                         ) : filteredClientes.length > 0 ? (
                           <div>
                             {filteredClientes.map((cliente) => (
                               <button
                                 key={cliente.id}
                                 type="button"
                                 className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                 onClick={() => {
                                   setFormData(prev => ({ ...prev, cliente_id: cliente.id }))
                                   setClienteSearchTerm(cliente.nome_fant || cliente.razao_social || cliente.nome || '')
                                   setClienteSearchOpen(false)
                                 }}
                               >
                                 <div className="font-medium">
                                   {cliente.nome_fant || cliente.razao_social || cliente.nome}
                                 </div>
                                 {cliente.razao_social && cliente.nome_fant !== cliente.razao_social && (
                                   <div className="text-xs text-gray-500">
                                     {cliente.razao_social}
                                   </div>
                                 )}
                               </button>
                             ))}
                           </div>
                         ) : (
                           <div className="p-2 text-sm text-gray-500">
                             {clienteSearchTerm ? 'Nenhum cliente encontrado' : 'Digite para buscar clientes'}
                           </div>
                         )}
                       </div>
                     )}
                   </div>
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
                 
                 {/* Mostrar cliente selecionado */}
                 {formData.cliente_id && (
                   <div className="text-sm text-gray-600 mt-1">
                     Cliente selecionado: {clientes?.find(c => c.id === formData.cliente_id)?.nome_fant || 
                                        clientes?.find(c => c.id === formData.cliente_id)?.razao_social || 
                                        clientes?.find(c => c.id === formData.cliente_id)?.nome || 'Cliente não encontrado'}
                   </div>
                 )}
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
                  onValueChange={(value) => {
                    console.log('Pipeline selecionado:', value)
                    handlePipelineChange(value)
                  }}
                  required
                >
                                     <SelectTrigger>
                     <SelectValue placeholder="Selecione um pipeline" />
                   </SelectTrigger>
                   <SelectContent className="z-[10003]">
                     {loadingPipelines ? (
                       <SelectItem value="loading" disabled>
                         Carregando pipelines...
                       </SelectItem>
                     ) : pipelines && pipelines.length > 0 ? (
                       pipelines.map((pipeline) => (
                         <SelectItem key={pipeline.id} value={pipeline.id}>
                           {pipeline.nome}
                         </SelectItem>
                       ))
                     ) : (
                       <SelectItem value="no-pipelines" disabled>
                         Nenhum pipeline encontrado
                       </SelectItem>
                     )}
                   </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                                 <Label htmlFor="etapa">Etapa</Label>
                <Select
                  value={formData.etapa_id || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, etapa_id: value }))}
                                     disabled={!formData.pipeline_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma etapa" />
                  </SelectTrigger>
                                                                                                                                                                          <SelectContent className="z-[10003]">
                     {!formData.pipeline_id ? (
                       <SelectItem value="no-pipeline-selected" disabled>
                         Selecione um pipeline primeiro
                       </SelectItem>
                     ) : etapasPipeline.length > 0 ? (
                       etapasPipeline.map((etapa) => (
                         <SelectItem key={etapa.id} value={etapa.id}>
                           {etapa.nome}
                         </SelectItem>
                       ))
                     ) : (
                       <SelectItem value="no-etapas" disabled>
                         Nenhuma etapa encontrada
                       </SelectItem>
                     )}
                   </SelectContent>
                </Select>
              </div>

                             <div className="space-y-2">
                 <Label htmlFor="valor">Valor (R$)</Label>
                <Input
                  id="valor"
                  type="text"
                  value={formData.valor}
                  onChange={(e) => {
                    const maskedValue = maskCurrency(e.target.value)
                    setFormData(prev => ({ ...prev, valor: maskedValue }))
                  }}
                                     placeholder="R$ 0,00"
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
                                                                                                                                                       <SelectContent className="z-[10003]">
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
                                                                                                                                                       <SelectContent className="z-[10003]">
                       <SelectItem value="baixa">Baixa</SelectItem>
                       <SelectItem value="media">Média</SelectItem>
                       <SelectItem value="alta">Alta</SelectItem>
                     </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Select
                  value={formData.responsavel_id || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um responsável" />
                  </SelectTrigger>
                                                                                                                                                                          <SelectContent className="z-[10003]">
                     {loadingUsuarios ? (
                       <SelectItem value="loading" disabled>
                         Carregando usuários...
                       </SelectItem>
                     ) : usuarios && usuarios.length > 0 ? (
                       usuarios.map((usuario) => (
                         <SelectItem key={usuario.id} value={usuario.id}>
                           {usuario.nome}
                         </SelectItem>
                       ))
                     ) : (
                       <SelectItem value="no-users" disabled>
                         Nenhum usuário encontrado
                       </SelectItem>
                     )}
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
         </div>
       </div>
       )}

      {/* Modal de Criar Cliente - Renderizado via Portal */}
      {showClienteModal && createPortal(
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10003]">
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
                onClick={handleCriarCliente}
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