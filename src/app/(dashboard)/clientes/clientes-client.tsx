'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cliente } from '@/lib/api'
import { criarCliente, deletarCliente } from '@/lib/actions/clientes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MaskedInput } from '@/components/ui/masked-input'
import { CNPJInput } from '@/components/ui/cnpj-input'
import { Label } from '@/components/ui/label'
import { ConfirmModal } from '@/components/ui/confirm-modal'

import { 
  Plus, 
  Users, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Building2,
  User,
  FileText,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { maskPhone, maskCPFCNPJ, validateCPF, validateCNPJ, removeMask } from '@/lib/utils'

interface ClientesClientProps {
  initialData: Cliente[]
}

export function ClientesClient({ initialData }: ClientesClientProps) {
  const router = useRouter()
  const [clientes, setClientes] = useState(initialData)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'pessoa_fisica' | 'pessoa_juridica'>('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    tipo: 'pessoa_juridica' as 'pessoa_fisica' | 'pessoa_juridica',
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCNPJDataLoaded = (data: any) => {
    setFormData(prev => ({
      ...prev,
      nome: data.nome_fantasia || data.razao_social || prev.nome,
      cnpj: data.cnpj || prev.cnpj,
      email: data.email || prev.email,
      telefone: data.telefone || prev.telefone
    }))
    
    // Se houver dados de endereço, salvar no localStorage para uso posterior
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
      localStorage.setItem('cnpj_endereco', JSON.stringify(enderecoFormatado))
    }
  }

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório')
      return false
    }

    if (!formData.email.trim()) {
      toast.error('Email é obrigatório')
      return false
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido')
      return false
    }

    // Validar CPF/CNPJ se foi preenchido
    if (formData.cpf.trim()) {
      const numbers = removeMask(formData.cpf)
      if (numbers.length !== 11) {
        toast.error('CPF deve ter 11 dígitos')
        return false
      }
      if (!validateCPF(formData.cpf)) {
        toast.error('CPF inválido')
        return false
      }
    }

    if (formData.cnpj.trim()) {
      const numbers = removeMask(formData.cnpj)
      if (numbers.length !== 14) {
        toast.error('CNPJ deve ter 14 dígitos')
        return false
      }
      if (!validateCNPJ(formData.cnpj)) {
        toast.error('CNPJ inválido')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Criar FormData
      const formDataObj = new FormData()
      formDataObj.append('tipo', formData.tipo)
      formDataObj.append('nome', formData.nome)
      formDataObj.append('cpf', formData.cpf)
                     formDataObj.append('cnpj', formData.cnpj)
        formDataObj.append('email', formData.email)
        formDataObj.append('telefone', formData.telefone)

      const result = await criarCliente(formDataObj)
      
      if (result.success) {
        toast.success('Cliente criado com sucesso!')
        setShowModal(false)
                         // Limpar formulário
        setFormData({
          tipo: 'pessoa_juridica',
          nome: '',
          cpf: '',
          cnpj: '',
          email: '',
          telefone: ''
        })
        // Recarregar página
        window.location.reload()
      } else {
        toast.error(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      toast.error('Erro ao criar cliente')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setClienteToDelete(id)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!clienteToDelete) return
    
    try {
      const result = await deletarCliente(clienteToDelete)
      
      if (result.success) {
        toast.success('Cliente deletado com sucesso!')
        setClientes(clientes.filter(c => c.id !== clienteToDelete))
        setShowDeleteModal(false)
        setClienteToDelete(null)
      } else {
        toast.error(result.error || 'Erro ao deletar cliente')
      }
    } catch (error) {
      toast.error('Erro ao deletar cliente')
      console.error(error)
    }
  }

  const getClienteNome = (cliente: Cliente) => {
    if (cliente.tipo === 'pessoa_juridica') {
      // Priorizar nome fantasia sobre razão social para PJ
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

  const getTipoBadge = (tipo: string) => {
    return tipo === 'pessoa_juridica' 
      ? <Badge variant="outline" className="text-blue-600 border-blue-200">PJ</Badge>
      : <Badge variant="outline" className="text-purple-600 border-purple-200">PF</Badge>
  }

  // Filtrar clientes
  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = getClienteNome(cliente).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getClienteIdentificacao(cliente).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cliente.email && cliente.email.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = filterType === 'all' || cliente.tipo === filterType
    
    return matchesSearch && matchesFilter
  })

  // Estatísticas
  const totalClientes = clientes.length
  const clientesAtivos = clientes.filter(c => c.status === 'ativo').length
  const clientesComEmail = clientes.filter(c => c.email).length
  const novosEsteMes = clientes.filter(c => {
    const created = new Date(c.created_at)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length

  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Nenhum cliente encontrado</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Comece criando seu primeiro cliente para gerenciar seus relacionamentos comerciais.
        </p>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeiro Cliente
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalClientes}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Clientes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{clientesAtivos}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Novos Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{novosEsteMes}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Com Email</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{clientesComEmail}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Clientes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie seus clientes e relacionamentos comerciais
              </p>
            </div>
            <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF/CNPJ ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'pessoa_fisica' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('pessoa_fisica')}
                className={filterType === 'pessoa_fisica' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Pessoa Física
              </Button>
              <Button
                variant={filterType === 'pessoa_juridica' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('pessoa_juridica')}
                className={filterType === 'pessoa_juridica' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Pessoa Jurídica
              </Button>
            </div>
          </div>

          {/* Tabela Moderna */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
                  <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
                  <TableHead className="font-semibold text-gray-700">Identificação</TableHead>
                  <TableHead className="font-semibold text-gray-700">Contato</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Criado em</TableHead>
                  <TableHead className="w-[50px] font-semibold text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="cursor-pointer group" onClick={() => router.push(`/clientes/${cliente.id}`)}>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          {getClienteNome(cliente)}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {cliente.tipo === 'pessoa_juridica' && cliente.razao_social && (
                          <div className="text-sm text-gray-500">{cliente.razao_social}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTipoBadge(cliente.tipo)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono text-gray-600">
                        {getClienteIdentificacao(cliente)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {cliente.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-700">{cliente.email}</span>
                          </div>
                        )}
                        {cliente.telefone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-700">{cliente.telefone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(cliente.status || 'ativo')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-500">
                        {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/clientes/${cliente.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                                                     <DropdownMenuItem 
                             onClick={() => handleDeleteClick(cliente.id)}
                             className="text-red-600 focus:text-red-600"
                           >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Cliente</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <select 
                  id="tipo"
                  name="tipo" 
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className="w-full border rounded-md p-2 mt-1" 
                  required
                >
                  <option value="pessoa_juridica">Pessoa Jurídica</option>
                  <option value="pessoa_fisica">Pessoa Física</option>
                </select>
              </div>

              <div>
                <Label htmlFor="nome">
                  {formData.tipo === 'pessoa_fisica' ? 'Nome Completo *' : 'Nome Fantasia *'}
                </Label>
                <Input
                  id="nome"
                  type="text" 
                  name="nome" 
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className="mt-1"
                  placeholder={formData.tipo === 'pessoa_fisica' ? 'Nome completo' : 'Nome fantasia da empresa'}
                  required
                />
              </div>

              {formData.tipo === 'pessoa_fisica' ? (
                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <MaskedInput
                    id="cpf"
                    name="cpf" 
                    value={formData.cpf}
                    onValueChange={(value) => handleInputChange('cpf', value)}
                    className="mt-1"
                    placeholder="000.000.000-00"
                    mask={maskCPFCNPJ}
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <CNPJInput
                    value={formData.cnpj}
                    onChange={(value) => handleInputChange('cnpj', value)}
                    onDataLoaded={handleCNPJDataLoaded}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

                                               <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <MaskedInput
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onValueChange={(value) => handleInputChange('telefone', value)}
                      className="mt-1"
                      placeholder="(11) 99999-9999"
                      mask={maskPhone}
                    />
                  </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    'Criar Cliente'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do cliente
            </DialogDescription>
          </DialogHeader>
          
          {selectedCliente && (
            <div className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-sm">{getClienteNome(selectedCliente)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <div className="mt-1">{getTipoBadge(selectedCliente.tipo)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Identificação</label>
                    <p className="text-sm">{getClienteIdentificacao(selectedCliente)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCliente.status || 'ativo')}</div>
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCliente.email && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{selectedCliente.email}</p>
                    </div>
                  )}
                  {selectedCliente.telefone && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p className="text-sm">{selectedCliente.telefone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Adicionais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                    <p className="text-sm">
                      {new Date(selectedCliente.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {selectedCliente.observacoes && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Observações</label>
                      <p className="text-sm">{selectedCliente.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                  Fechar
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Cliente
                </Button>
              </div>
            </div>
          )}
                 </DialogContent>
       </Dialog>

       {/* Modal de Confirmação de Exclusão */}
       <ConfirmModal
         isOpen={showDeleteModal}
         onClose={() => {
           setShowDeleteModal(false)
           setClienteToDelete(null)
         }}
         onConfirm={handleDeleteConfirm}
         title="Excluir Cliente"
         description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
         confirmText="Excluir"
         cancelText="Cancelar"
         variant="destructive"
       />
     </div>
   )
 }
