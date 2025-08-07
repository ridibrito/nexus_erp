'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Target, 
  Settings, 
  Filter, 
  ChevronDown, 
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  Edit,
  User,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { useNegocios, usePipelines, useClientes } from '@/hooks/use-api'
import { pipelinesAPI } from '@/lib/api'
import { PipelineEtapa } from '@/lib/api'
import { NovoNegocioModal } from '@/components/modals/novo-negocio-modal'
import { Negocio } from '@/lib/api'

export default function NegociosPage() {
  const { negocios, loading: loadingNegocios, error: errorNegocios, moverNegocio, criarNegocio } = useNegocios()
  const { pipelines, loading: loadingPipelines, error: errorPipelines } = usePipelines()
  const { clientes, loading: loadingClientes } = useClientes()
  
  const [pipelineAtivo, setPipelineAtivo] = useState<string>('')
  const [etapasPipeline, setEtapasPipeline] = useState<PipelineEtapa[]>([])
  const [showNovoNegocioModal, setShowNovoNegocioModal] = useState(false)
  const [dragItem, setDragItem] = useState<Negocio | null>(null)
  const [showPipelineDropdown, setShowPipelineDropdown] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Selecionar primeiro pipeline se não há nenhum selecionado
  useEffect(() => {
    if (pipelines.length > 0 && !pipelineAtivo) {
      setPipelineAtivo(pipelines[0].id)
    }
  }, [pipelines, pipelineAtivo])

  // Carregar etapas quando pipeline muda
  useEffect(() => {
    if (pipelineAtivo) {
      carregarEtapasPipeline(pipelineAtivo)
    }
  }, [pipelineAtivo])

  const carregarEtapasPipeline = async (pipelineId: string) => {
    try {
      const pipelineComEtapas = await pipelinesAPI.buscarComEtapas(pipelineId)
      if (pipelineComEtapas) {
        setEtapasPipeline(pipelineComEtapas.etapas)
      }
    } catch (error) {
      console.error('Erro ao carregar etapas:', error)
      setEtapasPipeline([])
    }
  }

  const handleOpenNovoNegocioModal = () => {
    setShowNovoNegocioModal(true)
  }

  const handleCriarNegocio = async (negocio: Omit<Negocio, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      await criarNegocio(negocio)
      setShowNovoNegocioModal(false)
    } catch (error) {
      console.error('Erro ao criar negócio:', error)
    }
  }

  const handleDrop = async (e: React.DragEvent, novaEtapaId: string) => {
    e.preventDefault()

    if (dragItem && dragItem.id) {
      try {
        await moverNegocio(dragItem.id, novaEtapaId)
        setDragItem(null)
      } catch (error) {
        console.error('Erro ao mover negócio:', error)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, negocio: Negocio) => {
    setDragItem(negocio)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const getNegociosPorEtapa = (etapaId: string) => {
    return negocios.filter(negocio => negocio.etapa_id === etapaId)
  }

  const getValorTotalEtapa = (etapaId: string) => {
    return getNegociosPorEtapa(etapaId).reduce((sum, negocio) => sum + (negocio.valor || 0), 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getClienteNome = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId)
    if (!cliente) return 'Cliente não encontrado'
    
    if (cliente.tipo === 'pessoa_juridica') {
      return cliente.nome_fant || cliente.razao_social || 'Empresa sem nome'
    } else {
      return cliente.nome || 'Pessoa sem nome'
    }
  }

  if (loadingNegocios || loadingPipelines || loadingClientes) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando negócios...</span>
        </div>
      </div>
    )
  }

  // Se há erros reais (não relacionados a dados vazios), mostrar erro
  if ((errorNegocios && !errorNegocios.includes('não encontrado') && !errorNegocios.includes('Empresa não encontrada')) ||
      (errorPipelines && !errorPipelines.includes('não encontrado') && !errorPipelines.includes('Empresa não encontrada'))) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600">Tente recarregar a página</p>

        </div>
      </div>
    )
  }

  // Se não há pipelines, mostrar placeholder para criar pipeline
  if (pipelines.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhum Pipeline Encontrado</h2>
          <p className="text-gray-600 mb-6">
            Para começar a gerenciar negócios, você precisa criar um pipeline de vendas primeiro.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/configuracoes?tab=pipelines'}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Pipeline
            </Button>
            <p className="text-xs text-gray-500">
              Vá para Configurações → Pipelines para criar seu primeiro pipeline
            </p>
          </div>
        </div>
      </div>
    )
  }

  const pipelineAtual = pipelines.find(p => p.id === pipelineAtivo)

  // Se não há etapas no pipeline ativo, mostrar placeholder
  if (etapasPipeline.length === 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Pipeline sem Etapas</h2>
          <p className="text-gray-600 mb-6">
            O pipeline "{pipelineAtual?.nome}" não possui etapas configuradas.
          </p>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = '/configuracoes?tab=pipelines'}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Etapas
            </Button>
            <p className="text-xs text-gray-500">
              Vá para Configurações → Pipelines para configurar as etapas
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header Rico - Estilo Pipedrive */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 mx-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Negócios</h1>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowPipelineDropdown(!showPipelineDropdown)}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: pipelineAtual?.cor || '#3B82F6' }}></div>
                  {pipelineAtual?.nome || 'Selecione um pipeline'}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                
                {showPipelineDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                    {pipelines.map((pipeline) => (
                      <button
                        key={pipeline.id}
                        onClick={() => {
                          setPipelineAtivo(pipeline.id)
                          setShowPipelineDropdown(false)
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                          pipelineAtivo === pipeline.id ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pipeline.cor }}></div>
                        {pipeline.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Configurar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <Button size="sm" onClick={handleOpenNovoNegocioModal}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Negócio
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden flex-1 px-4 pb-4">
          {etapasPipeline.map((etapa) => (
            <div
              key={etapa.id}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, etapa.id)}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                {/* Header da Coluna */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-900">{etapa.nome}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getNegociosPorEtapa(etapa.id).length}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(getValorTotalEtapa(etapa.id))}</span>
                    <span>{getNegociosPorEtapa(etapa.id).length} negócios</span>
                  </div>
                </div>

                {/* Cards dos Negócios */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {getNegociosPorEtapa(etapa.id).length > 0 ? (
                    getNegociosPorEtapa(etapa.id).map((negocio) => (
                      <Card
                        key={negocio.id}
                        className="cursor-move hover:shadow-md transition-shadow shadow-sm border border-gray-100"
                        draggable
                        onDragStart={(e) => handleDragStart(e, negocio)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900 mb-1">
                                {negocio.titulo}
                              </h4>
                              <p className="text-xs text-gray-600 mb-2">
                                {negocio.cliente_id ? getClienteNome(negocio.cliente_id) : 'Sem cliente'}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {negocio.probabilidade || 0}%
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-green-600 text-sm">
                              {formatCurrency(negocio.valor || 0)}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              Não atribuído
                            </div>
                          </div>

                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <div className="flex-1"></div>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    // Placeholder para etapa vazia
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Nenhum negócio nesta etapa</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleOpenNovoNegocioModal}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Negócio
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Novo Negócio */}
      <NovoNegocioModal
        open={showNovoNegocioModal}
        onOpenChange={setShowNovoNegocioModal}
        onSubmit={handleCriarNegocio}
      />
    </div>
  )
}