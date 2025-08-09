'use client'

import { useState } from 'react'
import { Negocio } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  FileText,
  Calendar,
  Clock,
  MessageSquare,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  TrendingUp,
  Target,
  Users,
  Camera,
  ChevronDown,
  Briefcase,
  FileText as FileTextIcon,
  ShoppingCart,
  Paperclip,
  FormInput,
  Filter,
  History
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface NegocioDetalhesClientProps {
  negocio: Negocio & {
    cliente?: any
    pipeline?: any
    etapa?: any
  }
}

export function NegocioDetalhesClient({ negocio }: NegocioDetalhesClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('timeline')
  const [showInteractionModal, setShowInteractionModal] = useState(false)
  const [interactionText, setInteractionText] = useState('')
  const [interactionType, setInteractionType] = useState('geral')

  const getClienteNome = (cliente: any) => {
    if (!cliente) return 'Cliente não informado'
    if (cliente.tipo === 'pessoa_juridica') {
      // Priorizar nome fantasia sobre razão social para PJ
      return cliente.nome_fant || cliente.razao_social || 'Empresa sem nome'
    } else {
      return cliente.nome || 'Pessoa sem nome'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>
      case 'fechado':
        return <Badge variant="secondary">Fechado</Badge>
      case 'perdido':
        return <Badge variant="outline" className="text-red-600">Perdido</Badge>
      default:
        return <Badge variant="outline">Em andamento</Badge>
    }
  }

  const getValorFormatado = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0)
  }

  const handleSaveInteraction = () => {
    // TODO: Implementar salvamento da interação
    console.log('Salvando interação:', { text: interactionText, type: interactionType })
    setShowInteractionModal(false)
    setInteractionText('')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                {negocio.titulo || 'Negócio sem título'}
              </h1>
              <p className="text-sm text-gray-500">
                {negocio.pipeline?.nome || 'Pipeline não definido'}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {getStatusBadge((negocio as any).status || 'ativo')}
            {negocio.etapa && (
              <Badge variant="outline" style={{ backgroundColor: negocio.pipeline?.cor || '#3B82F6' }}>
                {negocio.etapa.nome}
              </Badge>
            )}
          </div>
        </div>

        {/* Informações Básicas */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {/* Dados Básicos */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">DADOS BÁSICOS</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Título</label>
                    <p className="text-sm text-gray-900">{negocio.titulo || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Descrição</label>
                    <p className="text-sm text-gray-900">{negocio.descricao || 'Não informado'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Pipeline</label>
                    <p className="text-sm text-gray-900">{negocio.pipeline?.nome || 'Não definido'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Etapa</label>
                    <p className="text-sm text-gray-900">{negocio.etapa?.nome || 'Não definida'}</p>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">CLIENTE</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Nome</label>
                    <p className="text-sm text-gray-900">{getClienteNome(negocio.cliente)}</p>
                  </div>
                  {negocio.cliente?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{negocio.cliente.email}</span>
                    </div>
                  )}
                  {negocio.cliente?.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{negocio.cliente.telefone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Valores */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">VALORES</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Valor Estimado</label>
                    <p className="text-sm text-gray-900">{getValorFormatado((negocio as any).valor_estimado)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Valor Real</label>
                    <p className="text-sm text-gray-900">{getValorFormatado((negocio as any).valor_real)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Probabilidade</label>
                    <p className="text-sm text-gray-900">{negocio.probabilidade || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">OUTRAS INFORMAÇÕES</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Criado em</label>
                    <p className="text-sm text-gray-900">
                      {new Date(negocio.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {(negocio as any).data_fechamento && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Data de Fechamento</label>
                      <p className="text-sm text-gray-900">
                        {new Date((negocio as any).data_fechamento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  {negocio.observacoes && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Observações</label>
                      <p className="text-sm text-gray-900">{negocio.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Tabs de Navegação */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="timeline">Linha do tempo</TabsTrigger>
                <TabsTrigger value="atividades">Atividades</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
                <TabsTrigger value="anexos">Anexos</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>
              
              {/* Conteúdo dos Tabs */}
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="timeline" className="h-full">
                  <div className="p-6">
                    {/* Área de Interação */}
                    <Card className="mb-6">
                      <CardContent className="p-6">
                        <div className="flex gap-2 mb-4">
                          <Button onClick={() => setShowInteractionModal(true)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Registrar interação
                          </Button>
                          <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar tarefa
                          </Button>
                          <Button variant="outline">
                            <Send className="h-4 w-4 mr-2" />
                            Enviar proposta
                          </Button>
                        </div>

                        <div className="flex gap-2 mb-4">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <Input 
                            placeholder="Marque um usuário com @"
                            className="w-full"
                          />
                          <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm">
                              Mais campos
                            </Button>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Adicionar anexo
                              </Button>
                              <Button onClick={handleSaveInteraction} className="bg-red-600 hover:bg-red-700">
                                Salvar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tarefas em Aberto */}
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg">Tarefas em aberto</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma tarefa agendada. Clique aqui para criar.</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Histórico */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <CardTitle className="text-lg">Histórico completo</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <History className="h-4 w-4 mr-1" />
                                Histórico completo
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Interações
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Filter className="h-4 w-4 mr-1" />
                                Filtrar
                                <ChevronDown className="h-4 w-4 ml-1" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <History className="h-4 w-4 mr-1" />
                                Modificações
                              </Button>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Todas as atividades
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Item do histórico - Negócio criado */}
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                              <TrendingUp className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Ricardo Albuquerque</span>
                                <span className="text-xs text-gray-500">
                                  {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Negócio criado e movido para etapa "{negocio.etapa?.nome || 'Inicial'}".
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" size="sm">
                                  Visualizar
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="atividades" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Atividades do Negócio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Target className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma atividade encontrada para este negócio.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="documentos" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Documentos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum documento encontrado.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="tarefas" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Tarefas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma tarefa encontrada.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="anexos" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Anexos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Paperclip className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum anexo encontrado.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="relatorios" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Relatórios</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum relatório disponível.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Modal de Interação */}
      <Dialog open={showInteractionModal} onOpenChange={setShowInteractionModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Interação</DialogTitle>
            <DialogDescription>
              Registre uma nova interação com o negócio
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo de Interação</label>
              <select 
                value={interactionType}
                onChange={(e) => setInteractionType(e.target.value)}
                className="w-full border rounded-md p-2 mt-1"
              >
                <option value="geral">Geral</option>
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="reuniao">Reunião</option>
                <option value="proposta">Proposta</option>
                <option value="fechamento">Fechamento</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={interactionText}
                onChange={(e) => setInteractionText(e.target.value)}
                placeholder="Descreva a interação..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInteractionModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveInteraction}>
                Salvar Interação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
