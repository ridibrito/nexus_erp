'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  MoreHorizontal,
  User,
  Phone,
  Mail,
  ChevronDown,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star
} from 'lucide-react'

// Tipos para o CRM
interface Negocio {
  id: string
  titulo: string
  cliente: string
  valor: number
  etapa: string
  pipeline: string
  dataCriacao: string
  proximoContato?: string
  responsavel: string
  probabilidade: number
  descricao: string
  contatos: {
    telefone: string
    email: string
  }
  status: 'won' | 'lost' | 'active' | 'overdue'
  priority: 'high' | 'medium' | 'low'
}

interface Pipeline {
  id: string
  nome: string
  etapas: string[]
  cor: string
}

// Dados mockados
const pipelines: Pipeline[] = [
  {
    id: 'vendas',
    nome: 'Pipeline de Vendas',
    etapas: ['Prospecção', 'Qualificação', 'Contato Realizado', 'Demo Agendada', 'Proposta Enviada', 'Negociação', 'Fechado'],
    cor: 'bg-blue-500'
  },
  {
    id: 'marketing',
    nome: 'Pipeline de Marketing',
    etapas: ['Lead', 'MQL', 'SQL', 'Oportunidade', 'Cliente'],
    cor: 'bg-green-500'
  }
]

const negociosMock: Negocio[] = [
  {
    id: '1',
    titulo: 'Site E-commerce - Cliente ABC',
    cliente: 'Empresa ABC Ltda',
    valor: 15000,
    etapa: 'Proposta Enviada',
    pipeline: 'vendas',
    dataCriacao: '2024-01-15',
    proximoContato: '2024-01-20',
    responsavel: 'João Silva',
    probabilidade: 70,
    descricao: 'Desenvolvimento de site e-commerce completo',
    contatos: {
      telefone: '(11) 99999-9999',
      email: 'contato@abc.com.br'
    },
    status: 'active',
    priority: 'high'
  },
  {
    id: '2',
    titulo: 'Campanha Marketing Digital',
    cliente: 'Startup XYZ',
    valor: 8500,
    etapa: 'Negociação',
    pipeline: 'vendas',
    dataCriacao: '2024-01-10',
    proximoContato: '2024-01-18',
    responsavel: 'Maria Santos',
    probabilidade: 85,
    descricao: 'Campanha completa de marketing digital',
    contatos: {
      telefone: '(11) 88888-8888',
      email: 'contato@xyz.com.br'
    },
    status: 'active',
    priority: 'medium'
  },
  {
    id: '3',
    titulo: 'SEO e Analytics',
    cliente: 'Loja Online 123',
    valor: 6200,
    etapa: 'Qualificação',
    pipeline: 'vendas',
    dataCriacao: '2024-01-12',
    responsavel: 'Pedro Costa',
    probabilidade: 50,
    descricao: 'Otimização SEO e implementação de analytics',
    contatos: {
      telefone: '(11) 77777-7777',
      email: 'contato@123.com.br'
    },
    status: 'active',
    priority: 'low'
  },
  {
    id: '4',
    titulo: 'Redes Sociais',
    cliente: 'Restaurante Sabor',
    valor: 3200,
    etapa: 'Contato Realizado',
    pipeline: 'vendas',
    dataCriacao: '2024-01-08',
    proximoContato: '2024-01-16',
    responsavel: 'Ana Oliveira',
    probabilidade: 60,
    descricao: 'Gestão de redes sociais',
    contatos: {
      telefone: '(11) 66666-6666',
      email: 'contato@sabor.com.br'
    },
    status: 'overdue',
    priority: 'medium'
  },
  {
    id: '5',
    titulo: 'Site Institucional',
    cliente: 'Consultoria Expert',
    valor: 12000,
    etapa: 'Demo Agendada',
    pipeline: 'vendas',
    dataCriacao: '2024-01-05',
    proximoContato: '2024-01-22',
    responsavel: 'João Silva',
    probabilidade: 75,
    descricao: 'Site institucional profissional',
    contatos: {
      telefone: '(11) 55555-5555',
      email: 'contato@expert.com.br'
    },
    status: 'active',
    priority: 'high'
  }
]

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<Negocio[]>(negociosMock)
  const [pipelineAtivo, setPipelineAtivo] = useState<string>('vendas')
  const [dragItem, setDragItem] = useState<Negocio | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPipelineDropdown, setShowPipelineDropdown] = useState(false)

  const pipelineAtual = pipelines.find(p => p.id === pipelineAtivo)

  const handleDragStart = (e: React.DragEvent, negocio: Negocio) => {
    setDragItem(negocio)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, novaEtapa: string) => {
    e.preventDefault()

    if (dragItem) {
      setNegocios(prev =>
        prev.map(negocio =>
          negocio.id === dragItem.id
            ? { ...negocio, etapa: novaEtapa }
            : negocio
        )
      )
      setDragItem(null)
    }
  }

  const getNegociosPorEtapa = (etapa: string) => {
    return negocios.filter(negocio =>
      negocio.etapa === etapa && negocio.pipeline === pipelineAtivo
    )
  }

  const getValorTotalEtapa = (etapa: string) => {
    return getNegociosPorEtapa(etapa).reduce((sum, negocio) => sum + negocio.valor, 0)
  }

  const getValorTotalPipeline = () => {
    return negocios.filter(n => n.pipeline === pipelineAtivo).reduce((sum, n) => sum + n.valor, 0)
  }

  const getTotalNegociosPipeline = () => {
    return negocios.filter(n => n.pipeline === pipelineAtivo).length
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'lost':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'overdue':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <Star className="h-4 w-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
                  <div className={`w-3 h-3 rounded-full ${pipelineAtual?.cor}`}></div>
                  {pipelineAtual?.nome}
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
                        <div className={`w-3 h-3 rounded-full ${pipeline.cor}`}></div>
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
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Negócio
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto overflow-y-hidden flex-1 px-4 pb-4">
          {pipelineAtual?.etapas.map((etapa) => (
            <div
              key={etapa}
              className="flex-shrink-0 w-72"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, etapa)}
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
                {/* Header da Coluna */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm text-gray-900">{etapa}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getNegociosPorEtapa(etapa).length}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatCurrency(getValorTotalEtapa(etapa))}</span>
                    <span>{getNegociosPorEtapa(etapa).length} negócios</span>
                  </div>
                </div>

                {/* Cards dos Negócios */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {getNegociosPorEtapa(etapa).map((negocio) => (
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
                              {negocio.cliente}
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getPriorityColor(negocio.priority)}`}
                              >
                                {negocio.priority === 'high' ? 'Alta' : 
                                 negocio.priority === 'medium' ? 'Média' : 'Baixa'}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {negocio.probabilidade}%
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(negocio.status)}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-green-600 text-sm">
                            {formatCurrency(negocio.valor)}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="h-3 w-3" />
                            {negocio.responsavel}
                          </div>
                        </div>

                        {negocio.proximoContato && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <Calendar className="h-3 w-3" />
                            Próximo contato: {new Date(negocio.proximoContato).toLocaleDateString('pt-BR')}
                          </div>
                        )}

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
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 