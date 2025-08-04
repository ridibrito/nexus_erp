import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Star
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

// Dados mockados para clientes
const clientesData = [
  {
    id: 1,
    nome: 'Empresa ABC Ltda',
    email: 'contato@empresaabc.com.br',
    telefone: '(11) 99999-9999',
    cnpj: '12.345.678/0001-90',
    endereco: 'Rua das Flores, 123 - São Paulo/SP',
    valorTotal: 25000.00,
    status: 'ativo',
    ultimaCompra: '2024-01-15',
    tipo: 'empresa'
  },
  {
    id: 2,
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 88888-8888',
    cpf: '123.456.789-00',
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    valorTotal: 8500.00,
    status: 'ativo',
    ultimaCompra: '2024-01-10',
    tipo: 'pessoa'
  },
  {
    id: 3,
    nome: 'Tech Solutions',
    email: 'contato@techsolutions.com',
    telefone: '(11) 77777-7777',
    cnpj: '98.765.432/0001-10',
    endereco: 'Rua da Tecnologia, 456 - São Paulo/SP',
    valorTotal: 45000.00,
    status: 'ativo',
    ultimaCompra: '2024-01-20',
    tipo: 'empresa'
  },
  {
    id: 4,
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '(11) 66666-6666',
    cpf: '987.654.321-00',
    endereco: 'Rua das Palmeiras, 789 - São Paulo/SP',
    valorTotal: 3200.00,
    status: 'inativo',
    ultimaCompra: '2023-12-15',
    tipo: 'pessoa'
  }
]

const statusColors = {
  ativo: 'bg-green-100 text-green-800',
  inativo: 'bg-gray-100 text-gray-800'
}

export default function ClientesPage() {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie sua base de clientes
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <Card className="metric-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar clientes..."
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">142</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Médio</p>
                <p className="text-2xl font-bold text-gray-900">R$ 2.450</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Novos (Mês)</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Clientes */}
      <Card className="metric-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Todos os Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contato</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Valor Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Última Compra</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientesData.map((cliente) => (
                  <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {cliente.tipo === 'empresa' ? (
                            <Building2 className="h-4 w-4 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{cliente.nome}</span>
                          <p className="text-sm text-gray-500">
                            {cliente.tipo === 'empresa' ? cliente.cnpj : cliente.cpf}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{cliente.email}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{cliente.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(cliente.valorTotal)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{cliente.ultimaCompra}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={`${statusColors[cliente.status]} flex items-center gap-1`}>
                        {cliente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 