'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cliente } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { InlineEdit } from '@/components/ui/inline-edit'
import { AvatarUpload } from '@/components/ui/avatar-upload'
import { InlineAddressEdit } from '@/components/ui/inline-address-edit'
import { ResponsavelSelect } from '@/components/ui/responsavel-select'
import { CNPJInput } from '@/components/ui/cnpj-input'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  User, 
  Calendar,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Upload,
  MoreHorizontal,
  Search,
  Filter,
  Link,
  Unlink,
  Briefcase,
  Users,
  Building,
  DollarSign,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  deletarCliente, 
  vincularPessoaEmpresa, 
  buscarVinculacoes, 
  criarNegocio, 
  buscarNegocios,
  buscarClientesParaVincular,
  atualizarClienteDetalhes
} from '@/lib/actions/clientes'

interface ClienteDetalhesProps {
  cliente: Cliente
}

interface Vinculacao {
  id: string
  cliente_id: string
  vinculado_id: string
  tipo_vinculacao: 'pessoa' | 'empresa'
  vinculado: Cliente
}

interface Negocio {
  id: string
  cliente_id: string
  nome: string
  descricao?: string
  valor_estimado: number
  valor_real?: number
  probabilidade: number
  data_fechamento?: string
  status: string
  fase: string
  created_at: string
}

export function ClienteDetalhes({ cliente }: ClienteDetalhesProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('timeline')
  const [expandedSections, setExpandedSections] = useState({
    basicData: true,
    location: true,
    otherInfo: true
  })
  const [showVinculacaoModal, setShowVinculacaoModal] = useState(false)
  const [showNegocioModal, setShowNegocioModal] = useState(false)
  const [vinculacoes, setVinculacoes] = useState<Vinculacao[]>([])
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [loadingVinculacoes, setLoadingVinculacoes] = useState(false)
  const [loadingNegocios, setLoadingNegocios] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVinculacao, setSelectedVinculacao] = useState<string>('')
  const [clientesParaVincular, setClientesParaVincular] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


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
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case 'inativo':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Inativo</Badge>
      case 'prospecto':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Prospecto</Badge>
      default:
        return <Badge variant="outline">Não definido</Badge>
    }
  }

  const getNegocioStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Ativo</Badge>
      case 'ganho':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Ganho</Badge>
      case 'perdido':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Perdido</Badge>
      case 'cancelado':
        return <Badge variant="outline" className="text-gray-600">Cancelado</Badge>
      default:
        return <Badge variant="outline">Não definido</Badge>
    }
  }

  const getProbabilidadeBadge = (probabilidade: number) => {
    let color = 'bg-gray-100 text-gray-700'
    if (probabilidade >= 75) color = 'bg-green-100 text-green-800'
    else if (probabilidade >= 50) color = 'bg-yellow-100 text-yellow-800'
    else if (probabilidade >= 25) color = 'bg-orange-100 text-orange-800'
    else color = 'bg-red-100 text-red-700'

    return <Badge variant="outline" className={color}>{probabilidade}%</Badge>
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }))
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    
    try {
      const result = await deletarCliente(cliente.id)
      
      if (result.success) {
        toast.success('Cliente deletado com sucesso!')
        router.push('/clientes')
      } else {
        toast.error(result.error || 'Erro ao deletar cliente')
      }
    } catch (error) {
      toast.error('Erro ao deletar cliente')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const carregarVinculacoes = async () => {
    setLoadingVinculacoes(true)
    try {
      const result = await buscarVinculacoes(cliente.id)
      if (result.success) {
        setVinculacoes(result.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar vinculações:', error)
    } finally {
      setLoadingVinculacoes(false)
    }
  }

  const carregarNegocios = async () => {
    setLoadingNegocios(true)
    try {
      const result = await buscarNegocios(cliente.id)
      if (result.success) {
        setNegocios(result.data || [])
      }
    } catch (error) {
      console.error('Erro ao carregar negócios:', error)
    } finally {
      setLoadingNegocios(false)
    }
  }

  const buscarClientes = async (termo?: string) => {
    setLoadingClientes(true)
    try {
      // Lógica inversa: PJ vincula pessoas, PF vincula empresas
      const tipo = cliente.tipo === 'pessoa_juridica' ? 'pessoa' : 'empresa'
      const result = await buscarClientesParaVincular(tipo, termo)
      
      if (result.success) {
        // Filtrar o cliente atual da lista
        const clientesFiltrados = result.data?.filter(c => c.id !== cliente.id) || []
        setClientesParaVincular(clientesFiltrados)
      } else {
        toast.error(result.error || 'Erro ao buscar clientes')
      }
    } catch (error) {
      toast.error('Erro ao buscar clientes')
      console.error(error)
    } finally {
      setLoadingClientes(false)
    }
  }

  const handleVinculacao = async () => {
    if (!selectedVinculacao) {
      toast.error('Selecione uma pessoa/empresa para vincular')
      return
    }

    setLoading(true)
    try {
      // Lógica inversa: PJ vincula pessoas, PF vincula empresas
      const tipo = cliente.tipo === 'pessoa_juridica' ? 'pessoa' : 'empresa'
      const result = await vincularPessoaEmpresa(cliente.id, selectedVinculacao, tipo)
      
      if (result.success) {
        toast.success('Vinculação criada com sucesso!')
        setShowVinculacaoModal(false)
        setSelectedVinculacao('')
        setSearchTerm('')
        setClientesParaVincular([])
        carregarVinculacoes()
      } else {
        toast.error(result.error || 'Erro ao vincular')
      }
    } catch (error) {
      toast.error('Erro ao vincular')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCriarNegocio = async (formData: FormData) => {
    formData.append('cliente_id', cliente.id)
    
    setLoading(true)
    try {
      const result = await criarNegocio(formData)
      
      if (result.success) {
        toast.success('Negócio criado com sucesso!')
        setShowNegocioModal(false)
        carregarNegocios()
      } else {
        toast.error(result.error || 'Erro ao criar negócio')
      }
    } catch (error) {
      toast.error('Erro ao criar negócio')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInlineEdit = async (field: string, value: string) => {
    const formData = new FormData()
    formData.append(field, value)
    
    try {
      const result = await atualizarClienteDetalhes(cliente.id, formData)
      
      if (result.success) {
        toast.success('Campo atualizado com sucesso!')
        // Recarregar a página para atualizar os dados
        window.location.reload()
      } else {
        toast.error(result.error || 'Erro ao atualizar campo')
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error('Erro ao atualizar campo')
      console.error(error)
      throw error
    }
  }

  const handleAvatarChange = async (avatarUrl: string) => {
    const formData = new FormData()
    formData.append('avatar', avatarUrl)
    
    try {
      const result = await atualizarClienteDetalhes(cliente.id, formData)
      
      if (result.success) {
        toast.success('Avatar atualizado com sucesso!')
        // Recarregar a página para atualizar os dados
        window.location.reload()
      } else {
        toast.error(result.error || 'Erro ao atualizar avatar')
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error('Erro ao atualizar avatar')
      console.error(error)
      throw error
    }
  }

  const handleEnderecoChange = async (endereco: any) => {
    const formData = new FormData()
    formData.append('endereco', JSON.stringify(endereco))
    
    try {
      const result = await atualizarClienteDetalhes(cliente.id, formData)
      
      if (result.success) {
        toast.success('Endereço atualizado com sucesso!')
        // Recarregar a página para atualizar os dados
        window.location.reload()
      } else {
        toast.error(result.error || 'Erro ao atualizar endereço')
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error('Erro ao atualizar endereço')
      console.error(error)
      throw error
    }
  }

  const handleResponsavelChange = async (responsavelId: string) => {
    const formData = new FormData()
    formData.append('responsavel_id', responsavelId)
    
    try {
      const result = await atualizarClienteDetalhes(cliente.id, formData)
      
      if (result.success) {
        toast.success('Responsável atualizado com sucesso!')
        // Recarregar a página para atualizar os dados
        window.location.reload()
      } else {
        toast.error(result.error || 'Erro ao atualizar responsável')
        throw new Error(result.error)
      }
    } catch (error) {
      toast.error('Erro ao atualizar responsável')
      console.error(error)
      throw error
    }
  }

  const handleCNPJDataLoaded = (data: any) => {
    console.log('Dados recebidos da BrasilAPI:', data)
    
    // Atualizar automaticamente os campos com dados da Receita Federal
    const updates = []
    
    if (data.razao_social) {
      updates.push(handleInlineEdit('razao_social', data.razao_social))
    }
    if (data.nome_fantasia) {
      updates.push(handleInlineEdit('nome_fant', data.nome_fantasia))
    }
    if (data.email) {
      updates.push(handleInlineEdit('email', data.email))
    }
    if (data.telefone) {
      updates.push(handleInlineEdit('telefone', data.telefone))
    }
    
    // Atualizar endereço se houver dados
    if (data.logradouro || data.municipio || data.uf || data.cep) {
      const enderecoFormatado = {
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        estado: data.uf || '',
        cep: data.cep || ''
      }
      console.log('Endereço formatado:', enderecoFormatado)
      updates.push(handleEnderecoChange(enderecoFormatado))
    }
    
    // Executar todas as atualizações
    if (updates.length > 0) {
      Promise.all(updates).then(() => {
        toast.success('Dados da Receita Federal aplicados com sucesso!')
      }).catch((error) => {
        console.error('Erro ao aplicar dados da RF:', error)
        toast.error('Erro ao aplicar alguns dados da Receita Federal')
      })
    } else {
      toast.info('Nenhum dado da Receita Federal foi aplicado')
    }
  }

  useEffect(() => {
    if (activeTab === 'pessoas') {
      carregarVinculacoes()
    } else if (activeTab === 'negocios') {
      carregarNegocios()
    }
  }, [activeTab])

  useEffect(() => {
    if (showVinculacaoModal) {
      buscarClientes()
    }
  }, [showVinculacaoModal])

  const tabs = [
    { id: 'timeline', label: 'Linha do tempo', active: true },
    { id: 'pessoas', label: cliente.tipo === 'pessoa_juridica' ? 'Pessoas' : 'Empresas', badge: vinculacoes.length.toString() },
    { id: 'negocios', label: 'Negócios', badge: negocios.length.toString() },
    { id: 'vendas', label: 'Vendas' },
    { id: 'documentos', label: 'Documentos' }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
              <AvatarUpload
                currentAvatar={cliente.avatar}
                onAvatarChange={handleAvatarChange}
                size="md"
              />
              <div className="flex-1">
                <InlineEdit
                  value={getClienteNome(cliente)}
                  onSave={(value) => handleInlineEdit(cliente.tipo === 'pessoa_fisica' ? 'nome' : 'razao_social', value)}
                  placeholder="Nome do cliente"
                  className="font-semibold text-gray-900 text-lg"
                />
              </div>
            </div>
        </div>

        {/* Conteúdo da Sidebar */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Dados Básicos */}
          <div>
            <button 
              onClick={() => toggleSection('basicData')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span>DADOS BÁSICOS</span>
              </div>
              {expandedSections.basicData ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSections.basicData && (
              <div className="space-y-3 ml-6">
                <div>
                  <label className="text-xs text-gray-500">Nome</label>
                  <InlineEdit
                    value={getClienteNome(cliente)}
                    onSave={(value) => handleInlineEdit(cliente.tipo === 'pessoa_fisica' ? 'nome' : 'razao_social', value)}
                    placeholder="Nome do cliente"
                    className="text-sm text-gray-900"
                  />
                </div>
                {cliente.tipo === 'pessoa_juridica' && (
                  <div>
                    <label className="text-xs text-gray-500">Nome Fantasia</label>
                    <InlineEdit
                      value={cliente.nome_fant || ''}
                      onSave={(value) => handleInlineEdit('nome_fant', value)}
                      placeholder="Nome fantasia"
                      className="text-sm text-gray-900"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-500">Tipo</label>
                  <p className="text-sm text-gray-900">
                    {cliente.tipo === 'pessoa_juridica' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">
                    {cliente.tipo === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                  </label>
                  {cliente.tipo === 'pessoa_fisica' ? (
                    <InlineEdit
                      value={getClienteIdentificacao(cliente)}
                      onSave={(value) => handleInlineEdit('cpf', value)}
                      placeholder="CPF"
                      className="text-sm text-gray-900"
                    />
                  ) : (
                    <CNPJInput
                      value={getClienteIdentificacao(cliente)}
                      onChange={(value) => handleInlineEdit('cnpj', value)}
                      onDataLoaded={handleCNPJDataLoaded}
                      className="text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <InlineEdit
                    value={cliente.email || ''}
                    onSave={(value) => handleInlineEdit('email', value)}
                    placeholder="Email"
                    type="email"
                    className="text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Telefone</label>
                  <InlineEdit
                    value={cliente.telefone || ''}
                    onSave={(value) => handleInlineEdit('telefone', value)}
                    placeholder="Telefone"
                    type="tel"
                    className="text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(cliente.status || 'ativo')}</div>
                </div>
              </div>
            )}
          </div>

          {/* Localização */}
          <div>
            <button 
              onClick={() => toggleSection('location')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>LOCALIZAÇÃO</span>
              </div>
              {expandedSections.location ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSections.location && (
              <div className="space-y-3 ml-6">
                <div>
                  <label className="text-xs text-gray-500">Endereço Completo</label>
                  <InlineAddressEdit
                    endereco={cliente.endereco || {}}
                    onSave={handleEnderecoChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Outras Informações */}
          <div>
            <button 
              onClick={() => toggleSection('otherInfo')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>OUTRAS INFORMAÇÕES</span>
              </div>
              {expandedSections.otherInfo ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedSections.otherInfo && (
              <div className="space-y-3 ml-6">
                <div>
                  <label className="text-xs text-gray-500">Responsável</label>
                  <ResponsavelSelect
                    responsavelId={cliente.responsavel_id}
                    onSave={handleResponsavelChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Observações</label>
                  <InlineEdit
                    value={cliente.observacoes || ''}
                    onSave={(value) => handleInlineEdit('observacoes', value)}
                    placeholder="Adicionar observações"
                    className="text-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(cliente.status || 'ativo')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header com Ações */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/clientes')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Cliente
              </Button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Área de Interação */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Botões de Ação */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Registrar interação
                      </Button>
                      <Button size="sm" variant="outline">
                        Agendar tarefa
                      </Button>
                      <Button size="sm" variant="outline">
                        Enviar e-mail
                      </Button>
                    </div>

                    {/* Ícones de Tipo de Interação */}
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Campo de Texto */}
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Marque um usuário com @"
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        Mais campos
                      </Button>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-between">
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Salvar
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Adicionar anexo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tarefas em Aberto */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Tarefas em aberto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm">Nenhuma tarefa agendada. Clique aqui para criar.</p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4">
                      <button className="text-sm font-medium text-purple-600 border-b-2 border-purple-500 pb-2">
                        Histórico completo
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Interações
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Filtrar
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Modificações
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Todas as atividades</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Linha do tempo */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Entradas da timeline */}
                    <div className="space-y-6">
                      {/* Entrada 1 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">Ricardo Albuquerque</span>
                            <span className="text-sm text-gray-500">Terça-feira, 05 de Agosto às 06:03</span>
                          </div>
                          <p className="text-gray-700 mb-2">Negócio Bitrix24 criado.</p>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Visualizar
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Entrada 2 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">Ricardo Albuquerque</span>
                            <span className="text-sm text-gray-500">Quinta-feira, 17 de Julho às 06:43</span>
                          </div>
                          <p className="text-gray-700 mb-2">E-mail</p>
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 mb-2">
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Ederson Santos</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Visualizar
                              </Button>
                              <span className="text-xs text-gray-400">17/07/2025</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Entrada 3 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">Ricardo Albuquerque</span>
                            <span className="text-sm text-gray-500">Quinta-feira, 17 de Julho às 06:43</span>
                          </div>
                          <p className="text-gray-700">Cliente criado.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'pessoas' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {cliente.tipo === 'pessoa_juridica' ? 'Pessoas Vinculadas' : 'Empresas Vinculadas'}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {cliente.tipo === 'pessoa_juridica' 
                          ? 'Gerencie as pessoas vinculadas a esta empresa'
                          : 'Gerencie as empresas vinculadas a esta pessoa'
                        }
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowVinculacaoModal(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {cliente.tipo === 'pessoa_juridica' ? 'Vincular Pessoa' : 'Vincular Empresa'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingVinculacoes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : vinculacoes.length > 0 ? (
                    <div className="space-y-4">
                      {vinculacoes.map((vinculacao) => (
                        <div key={vinculacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              {vinculacao.vinculado.tipo === 'pessoa_juridica' ? (
                                <Building2 className="h-5 w-5 text-blue-600" />
                              ) : (
                                <User className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {getClienteNome(vinculacao.vinculado)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {vinculacao.vinculado.email}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma {cliente.tipo === 'pessoa_juridica' ? 'pessoa' : 'empresa'} vinculada
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {cliente.tipo === 'pessoa_juridica' 
                          ? 'Vincule pessoas para gerenciar contatos e relacionamentos'
                          : 'Vincule empresas para gerenciar relacionamentos comerciais'
                        }
                      </p>
                      <Button 
                        onClick={() => setShowVinculacaoModal(true)}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {cliente.tipo === 'pessoa_juridica' ? 'Vincular Primeira Pessoa' : 'Vincular Primeira Empresa'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'negocios' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Negócios</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Gerencie os negócios e oportunidades deste cliente
                      </p>
                    </div>
                    <Button 
                      onClick={() => setShowNegocioModal(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Negócio
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingNegocios ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : negocios.length > 0 ? (
                    <div className="space-y-4">
                      {negocios.map((negocio) => (
                        <div key={negocio.id} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Briefcase className="h-5 w-5 text-blue-600" />
                              <h3 className="font-medium text-gray-900">{negocio.nome}</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getNegocioStatusBadge(negocio.status)}
                              {getProbabilidadeBadge(negocio.probabilidade)}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Valor Estimado:</span>
                              <p className="font-medium text-gray-900">
                                R$ {negocio.valor_estimado.toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Fase:</span>
                              <p className="font-medium text-gray-900 capitalize">{negocio.fase}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Data Fechamento:</span>
                              <p className="font-medium text-gray-900">
                                {negocio.data_fechamento 
                                  ? new Date(negocio.data_fechamento).toLocaleDateString('pt-BR')
                                  : 'Não definida'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhum negócio criado
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Crie negócios para acompanhar oportunidades e vendas
                      </p>
                      <Button 
                        onClick={() => setShowNegocioModal(true)}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeiro Negócio
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'vendas' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Funcionalidade de vendas será implementada em breve.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Documentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500">Funcionalidade de documentos será implementada em breve.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Vinculação */}
      {showVinculacaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {cliente.tipo === 'pessoa_juridica' ? 'Vincular Pessoa' : 'Vincular Empresa'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar {cliente.tipo === 'pessoa_juridica' ? 'pessoa' : 'empresa'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder={`Buscar ${cliente.tipo === 'pessoa_juridica' ? 'pessoa' : 'empresa'}...`}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      if (e.target.value.length >= 2) {
                        buscarClientes(e.target.value)
                      } else if (e.target.value.length === 0) {
                        buscarClientes()
                      }
                    }}
                  />
                </div>
              </div>

              {/* Lista de clientes */}
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {loadingClientes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : clientesParaVincular.length > 0 ? (
                  <div className="space-y-1">
                    {clientesParaVincular.map((clienteOpcao) => (
                      <button
                        key={clienteOpcao.id}
                        onClick={() => setSelectedVinculacao(clienteOpcao.id)}
                        className={`w-full p-3 text-left hover:bg-gray-50 border-b last:border-b-0 ${
                          selectedVinculacao === clienteOpcao.id ? 'bg-purple-50 border-purple-200' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {clienteOpcao.tipo === 'pessoa_juridica' ? (
                              <Building2 className="h-4 w-4 text-blue-600" />
                            ) : (
                              <User className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {getClienteNome(clienteOpcao)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {clienteOpcao.email}
                            </p>
                          </div>
                          {selectedVinculacao === clienteOpcao.id && (
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum cliente disponível'}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowVinculacaoModal(false)
                    setSearchTerm('')
                    setSelectedVinculacao('')
                    setClientesParaVincular([])
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleVinculacao}
                  disabled={loading || !selectedVinculacao}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Vinculando...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Vincular
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Negócio */}
      {showNegocioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Negócio</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleCriarNegocio(formData)
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Negócio
                </label>
                <Input name="nome" placeholder="Ex: Projeto Website" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Estimado
                </label>
                <Input name="valor" placeholder="R$ 0,00" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probabilidade
                </label>
                <select name="probabilidade" className="w-full border rounded-md p-2">
                  <option value="">Selecione</option>
                  <option value="10">10% - Inicial</option>
                  <option value="25">25% - Qualificação</option>
                  <option value="50">50% - Proposta</option>
                  <option value="75">75% - Negociação</option>
                  <option value="90">90% - Fechamento</option>
                  <option value="100">100% - Ganho</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fechamento
                </label>
                <Input name="data_fechamento" type="date" />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowNegocioModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Negócio
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Cliente"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        loading={loading}
      />

    </div>
  )
}
