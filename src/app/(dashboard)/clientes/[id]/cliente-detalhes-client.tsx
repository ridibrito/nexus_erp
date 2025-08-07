'use client'

import { useState } from 'react'
import { Cliente } from '@/lib/api'
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
  Camera,
  ChevronDown,
  Users,
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

interface ClienteDetalhesClientProps {
  cliente: Cliente & {
    empresa_vinculada?: Cliente
  }
}

export function ClienteDetalhesClient({ cliente }: ClienteDetalhesClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('timeline')
  const [showInteractionModal, setShowInteractionModal] = useState(false)
  const [interactionText, setInteractionText] = useState('')
  const [interactionType, setInteractionType] = useState('geral')

  const getClienteNome = (cliente: Cliente) => {
    if (cliente.tipo === 'pessoa_juridica') {
      return cliente.nome_fant || cliente.razao_social || 'Empresa sem nome'
    } else {
      return cliente.nome || 'Pessoa sem nome'
    }
  }

  const getClienteIdentificacao = (cliente: Cliente) => {
    if (cliente.tipo === 'pessoa_juridica') {
      return cliente.cnpj || 'CNPJ não informado'
    } else {
      return cliente.cpf || 'CPF não informado'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ativo</Badge>
      case 'inativo':
        return <Badge variant="secondary">Inativo</Badge>
      case 'prospecto':
        return <Badge variant="outline" className="text-orange-600">Prospecto</Badge>
      default:
        return <Badge variant="outline">Não definido</Badge>
    }
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === 'pessoa_juridica' 
      ? <Badge variant="outline" className="text-blue-600">Pessoa Jurídica</Badge>
      : <Badge variant="outline" className="text-purple-600">Pessoa Física</Badge>
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
                {getClienteNome(cliente)}
              </h1>
              <p className="text-sm text-gray-500">
                {cliente.tipo === 'pessoa_juridica' ? 'Empresa' : 'Pessoa Física'}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {getStatusBadge(cliente.status || 'ativo')}
            {getTipoBadge(cliente.tipo)}
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
                    <label className="text-xs font-medium text-gray-500">Nome</label>
                    <p className="text-sm text-gray-900">{getClienteNome(cliente)}</p>
                  </div>
                  {cliente.tipo === 'pessoa_juridica' && cliente.razao_social && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Razão Social</label>
                      <p className="text-sm text-gray-900">{cliente.razao_social}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-xs font-medium text-gray-500">Identificação</label>
                    <p className="text-sm text-gray-900">{getClienteIdentificacao(cliente)}</p>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">CONTATO</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {cliente.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{cliente.telefone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Empresa Vinculada */}
              {cliente.empresa_vinculada && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">EMPRESA VINCULADA</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">Nome</label>
                      <p className="text-sm text-gray-900">{getClienteNome(cliente.empresa_vinculada)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">CNPJ</label>
                      <p className="text-sm text-gray-900">{cliente.empresa_vinculada.cnpj}</p>
                    </div>
                  </div>
                </div>
              )}

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
                      {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {cliente.observacoes && (
                    <div>
                      <label className="text-xs font-medium text-gray-500">Observações</label>
                      <p className="text-sm text-gray-900">{cliente.observacoes}</p>
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
              <TabsList className="grid w-full grid-cols-10">
                <TabsTrigger value="timeline">Linha do tempo</TabsTrigger>
                <TabsTrigger value="filiais">Filiais</TabsTrigger>
                <TabsTrigger value="pessoas">Pessoas <Badge variant="secondary" className="ml-1">1</Badge></TabsTrigger>
                <TabsTrigger value="negocios">Negócios <Badge variant="secondary" className="ml-1">1</Badge></TabsTrigger>
                <TabsTrigger value="propostas">Propostas</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="vendas">Vendas</TabsTrigger>
                <TabsTrigger value="produtos">Produtos de cliente</TabsTrigger>
                <TabsTrigger value="anexos">Anexos</TabsTrigger>
                <TabsTrigger value="formularios">Formulários externos</TabsTrigger>
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
                            Enviar e-mail
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
                            <User className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Info className="h-4 w-4" />
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
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Camera className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Ricardo Albuquerque</span>
                                <span className="text-xs text-gray-500">
                                  Terça-feira, 05 de Agosto às 06:03
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                Negócio Bitrix24 criado.
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Button variant="ghost" size="sm">
                                  Visualizar
                                </Button>
                                <Button variant="ghost" size="sm" className="text-blue-600">
                                  Bitrix24
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Item do histórico - E-mail */}
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Mail className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">Ricardo Albuquerque</span>
                                <span className="text-xs text-gray-500">
                                  Quinta-feira, 17 de Julho às 06:43
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">
                                E-mail
                              </p>
                              <div className="bg-gray-50 p-3 rounded mt-2 text-xs font-mono">
                                {`@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:wght@400;600;700&display=swap"); body, p, div { font-family: "Source Sans Pro", sans-serif; font-size: 1rem; } body { color: #000000; } a { text-decoration: no...`}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="text-xs text-gray-600">Ederson Santos</span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  Visualizar
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  0
                                </Button>
                                <span className="text-xs text-gray-500">17/07/2025</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="filiais" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Filiais</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Building2 className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma filial encontrada.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="pessoas" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pessoas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma pessoa encontrada.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="negocios" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Negócios do Cliente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <Briefcase className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum negócio encontrado para este cliente.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="propostas" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Propostas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <FileTextIcon className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma proposta encontrada.</p>
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

                <TabsContent value="vendas" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Vendas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhuma venda encontrada.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="produtos" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Produtos de Cliente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <ShoppingCart className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum produto encontrado.</p>
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

                <TabsContent value="formularios" className="h-full">
                  <div className="p-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Formulários Externos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-gray-500">
                          <FormInput className="h-8 w-8 mx-auto mb-2" />
                          <p>Nenhum formulário encontrado.</p>
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
              Registre uma nova interação com o cliente
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
