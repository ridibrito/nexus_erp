'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Cliente } from '@/lib/api'
import { criarCliente, deletarCliente } from '@/lib/actions/clientes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  FileText
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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    
    try {
      const result = await criarCliente(formData)
      
      if (result.success) {
        toast.success('Cliente criado com sucesso!')
        setShowModal(false)
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return
    
    try {
      const result = await deletarCliente(id)
      
      if (result.success) {
        toast.success('Cliente deletado com sucesso!')
        setClientes(clientes.filter(c => c.id !== id))
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{novosEsteMes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Email</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesComEmail}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">Clientes</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie seus clientes e relacionamentos comerciais
              </p>
            </div>
            <Button onClick={() => setShowModal(true)}>
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
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                Todos
              </Button>
              <Button
                variant={filterType === 'pessoa_fisica' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('pessoa_fisica')}
              >
                Pessoa Física
              </Button>
              <Button
                variant={filterType === 'pessoa_juridica' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('pessoa_juridica')}
              >
                Pessoa Jurídica
              </Button>
            </div>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Identificação</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[50px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getClienteNome(cliente)}</div>
                        {cliente.tipo === 'pessoa_juridica' && cliente.razao_social && (
                          <div className="text-sm text-muted-foreground">{cliente.razao_social}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTipoBadge(cliente.tipo)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {getClienteIdentificacao(cliente)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {cliente.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {cliente.email}
                          </div>
                        )}
                        {cliente.telefone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {cliente.telefone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(cliente.status || 'ativo')}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(cliente.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
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
                            onClick={() => handleDelete(cliente.id)}
                            className="text-red-600"
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
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredClientes.length} de {clientes.length} clientes
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Criar Novo Cliente</h3>
            
            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <select name="tipo" className="w-full border rounded-md p-2" required>
                  <option value="pessoa_juridica">Pessoa Jurídica</option>
                  <option value="pessoa_fisica">Pessoa Física</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome Fantasia</label>
                <input 
                  type="text" 
                  name="nome_fant" 
                  className="w-full border rounded-md p-2"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input 
                  type="text" 
                  name="nome" 
                  className="w-full border rounded-md p-2"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
                <input 
                  type="text" 
                  name="cpf" 
                  className="w-full border rounded-md p-2"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">CNPJ</label>
                <input 
                  type="text" 
                  name="cnpj" 
                  className="w-full border rounded-md p-2"
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="w-full border rounded-md p-2"
                  placeholder="contato@empresa.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input 
                  type="text" 
                  name="telefone" 
                  className="w-full border rounded-md p-2"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Cliente'}
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
    </div>
  )
}
