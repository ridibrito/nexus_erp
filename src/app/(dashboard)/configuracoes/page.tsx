'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2,
  Users,
  Target,
  Settings,
  Mail,
  DollarSign,
  FileText,
  CreditCard,
  Tag,
  Plus,
  ArrowRight,
  Loader2,
  MapPin,
  Phone,
  Mail as MailIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react'
import { MemberAvatarUpload } from '@/components/ui/member-avatar-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { EditarEtapasModal } from '@/components/modals/editar-etapas-modal'
import { pipelinesAPI } from '@/lib/api'

// Componentes de conteúdo para cada seção
const EmpresaContent = () => {
  const [empresaData, setEmpresaData] = useState({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    email: '',
    telefone: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  })

  // Função para garantir que o endereço seja sempre um objeto válido
  const getEnderecoValido = (endereco: any) => {
    console.log('🔧 getEnderecoValido chamado com:', endereco)
    console.log('🔧 Tipo do endereço:', typeof endereco)
    
    if (!endereco || typeof endereco !== 'object') {
      console.log('🔧 Retornando endereço padrão (endereco inválido)')
      return {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    }
    
    const enderecoValido = {
      logradouro: endereco.logradouro || '',
      numero: endereco.numero || '',
      complemento: endereco.complemento || '',
      bairro: endereco.bairro || '',
      cidade: endereco.cidade || '',
      estado: endereco.estado || '',
      cep: endereco.cep || ''
    }
    
    console.log('🔧 Endereço válido retornado:', enderecoValido)
    return enderecoValido
  }
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [empresa, setEmpresa] = useState<any>(null)

  useEffect(() => {
    const carregarDadosEmpresa = async () => {
      try {
        setLoading(true)
        
        // Buscar usuário atual
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          console.log('Usuário não autenticado')
          return
        }

        // Buscar dados do usuário na tabela usuarios
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('empresa_id, cargo')
          .eq('auth_user_id', user.id)
          .eq('is_active', true)
          .single()

        if (usuario?.empresa_id) {
          setEmpresaId(usuario.empresa_id) // Mantendo o nome da variável para compatibilidade
          
          // Buscar dados da empresa
          const { data: empresaData } = await supabase
            .from('empresas')
            .select('*')
            .eq('id', usuario.empresa_id)
            .single()

          if (empresaData) {
            setEmpresa(empresaData)
          }
        } else {
          // Se não encontrar empresa, usar empresa padrão
          setEmpresaId('d9c4338e-42b1-421c-a119-60cabfcb88ac')
        }
      } catch (error) {
        console.error('Erro ao carregar dados da empresa:', error)
        // Em caso de erro, usar empresa padrão
        setEmpresaId('d9c4338e-42b1-421c-a119-60cabfcb88ac')
      } finally {
        setLoading(false)
      }
    }

    carregarDadosEmpresa()
  }, [])

  // Sincronizar dados da empresa com o formulário
  useEffect(() => {
    if (empresa) {
      setEmpresaData({
        razao_social: empresa.razao_social || empresa.nome || '',
        nome_fantasia: empresa.nome_fantasia || empresa.nome || '',
        cnpj: empresa.cnpj || '',
        inscricao_estadual: empresa.inscricao_estadual || '',
        email: empresa.email || '',
        telefone: empresa.telefone || '',
        endereco: getEnderecoValido(empresa.endereco)
      })
    }
  }, [empresa])

  const handleSalvarEmpresa = async (dados: any) => {
    if (!empresaId) {
      toast.error('Empresa não encontrada')
      return
    }

    try {
      const { error } = await supabase
        .from('empresas')
        .update(dados)
        .eq('id', empresaId)

      if (error) throw error

      toast.success('Dados da empresa atualizados com sucesso!')
      
      // Recarregar dados da empresa
      const { data: empresaAtualizada } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single()

      if (empresaAtualizada) {
        setEmpresa(empresaAtualizada)
      }
    } catch (error) {
      console.error('Erro ao salvar dados da empresa:', error)
      toast.error('Erro ao salvar dados da empresa')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEmpresaData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEnderecoChange = (field: string, value: string) => {
    setEmpresaData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando dados da empresa...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
          {empresa && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Dados salvos
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">Configure os dados da sua empresa</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="razao_social">Razão Social</Label>
              <Input 
                id="razao_social"
                placeholder="Nome da empresa"
                value={empresaData.razao_social}
                onChange={(e) => handleInputChange('razao_social', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
              <Input 
                id="nome_fantasia"
                placeholder="Nome fantasia"
                value={empresaData.nome_fantasia}
                onChange={(e) => handleInputChange('nome_fantasia', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={empresaData.cnpj}
                onChange={(e) => handleInputChange('cnpj', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
              <Input 
                id="inscricao_estadual"
                placeholder="IE"
                value={empresaData.inscricao_estadual}
                onChange={(e) => handleInputChange('inscricao_estadual', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                placeholder="email@empresa.com"
                value={empresaData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone"
                placeholder="(11) 99999-9999"
                value={empresaData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input 
                id="logradouro"
                placeholder="Rua, Avenida, etc."
                value={empresaData.endereco.logradouro}
                onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input 
                id="numero"
                placeholder="123"
                value={empresaData.endereco.numero}
                onChange={(e) => handleEnderecoChange('numero', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input 
                id="complemento"
                placeholder="Sala, apto, etc."
                value={empresaData.endereco.complemento}
                onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input 
                id="bairro"
                placeholder="Bairro"
                value={empresaData.endereco.bairro}
                onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input 
                id="cidade"
                placeholder="São Paulo"
                value={empresaData.endereco.cidade}
                onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input 
                id="estado"
                placeholder="SP"
                value={empresaData.endereco.estado}
                onChange={(e) => handleEnderecoChange('estado', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input 
                id="cep"
                placeholder="00000-000"
                value={empresaData.endereco.cep}
                onChange={(e) => handleEnderecoChange('cep', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => handleSalvarEmpresa(empresaData)} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              {empresa && <Edit className="h-4 w-4 mr-2" />}
              {empresa ? 'Editar Dados da Empresa' : 'Salvar Dados da Empresa'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

const UsuariosContent = () => {
  const [activeTab, setActiveTab] = useState('lista')
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  // Estados para novo usuário
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    cargo: 'Usuário',
    telefone: ''
  })

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Buscar empresa do usuário atual
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      if (usuario?.empresa_id) {
        setEmpresaId(usuario.empresa_id)
        
        // Carregar todos os usuários da empresa
        const { data: usuariosData, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('empresa_id', usuario.empresa_id)
          .eq('is_active', true)
          .order('nome')

        if (error) throw error
        setUsuarios(usuariosData || [])
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      toast.error('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const toggleStatusUsuario = async (usuarioId: string, novoStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ is_active: novoStatus })
        .eq('id', usuarioId)

      if (error) throw error

      setUsuarios(prev => prev.map(u => 
        u.id === usuarioId ? { ...u, is_active: novoStatus } : u
      ))

      toast.success(`Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast.error('Erro ao alterar status do usuário')
    }
  }

  const adicionarUsuario = async () => {
    try {
      if (!empresaId) {
        toast.error('Empresa não encontrada')
        return
      }

      const { error } = await supabase
        .from('usuarios')
        .insert({
          empresa_id: empresaId,
          nome: newUser.nome,
          email: newUser.email,
          cargo: newUser.cargo,
          telefone: newUser.telefone,
          is_active: true
        })

      if (error) throw error

      toast.success('Usuário adicionado com sucesso!')
      setShowAddModal(false)
      setNewUser({ nome: '', email: '', cargo: 'Usuário', telefone: '' })
      carregarUsuarios()
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
      toast.error('Erro ao adicionar usuário')
    }
  }

  const editarUsuario = async (usuarioId: string, dados: any) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(dados)
        .eq('id', usuarioId)

      if (error) throw error

      setUsuarios(prev => prev.map(u => 
        u.id === usuarioId ? { ...u, ...dados } : u
      ))

      toast.success('Usuário atualizado com sucesso!')
      setEditingUser(null)
    } catch (error) {
      console.error('Erro ao editar usuário:', error)
      toast.error('Erro ao editar usuário')
    }
  }

  const tabs = [
    { id: 'lista', label: 'Lista de Usuários', icon: Users },
    { id: 'permissoes', label: 'Permissões', icon: Settings },
    { id: 'convites', label: 'Convites', icon: Mail },
    { id: 'perfis', label: 'Perfis', icon: Target }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando usuários...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Usuários</h2>
          <p className="text-sm text-gray-600">Gerencie usuários e permissões</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-semibold">{usuarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-semibold">
                  {usuarios.filter(u => u.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-semibold">
                  {usuarios.filter(u => u.cargo === 'Administrador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'lista' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usuarios.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <MemberAvatarUpload
                        memberId={usuario.id}
                        currentAvatarUrl={usuario.avatar_url}
                        size="md"
                        onAvatarChange={(url) => {
                          setUsuarios(prev => prev.map(u => 
                            u.id === usuario.id ? { ...u, avatar_url: url } : u
                          ))
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{usuario.nome}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          {usuario.email}
                        </div>
                        <p className="text-sm text-gray-500">{usuario.cargo}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        usuario.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.is_active ? 'Ativo' : 'Inativo'}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(usuario)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatusUsuario(usuario.id, !usuario.is_active)}
                        >
                          {usuario.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'permissoes' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gerenciar Permissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <MemberAvatarUpload
                      memberId={usuario.id}
                      currentAvatarUrl={usuario.avatar_url}
                      size="md"
                      onAvatarChange={(url) => {
                        setUsuarios(prev => prev.map(u => 
                          u.id === usuario.id ? { ...u, avatar_url: url } : u
                        ))
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{usuario.nome}</h3>
                      <p className="text-sm text-gray-500">{usuario.cargo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={usuario.cargo}
                      onChange={(e) => editarUsuario(usuario.id, { cargo: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="Usuário">Usuário</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Vendedor">Vendedor</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'convites' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Convites Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum convite pendente</p>
              <p className="text-sm text-gray-500 mt-2">Os convites aparecerão aqui quando enviados</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'perfis' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Perfis de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Administrador</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Acesso completo ao sistema</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">• Gerenciar usuários</div>
                    <div className="text-xs text-gray-500">• Configurações do sistema</div>
                    <div className="text-xs text-gray-500">• Relatórios completos</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Acesso básico ao sistema</p>
                  <div className="mt-2 space-y-1">
                    <div className="text-xs text-gray-500">• Visualizar dados</div>
                    <div className="text-xs text-gray-500">• Criar registros</div>
                    <div className="text-xs text-gray-500">• Relatórios básicos</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal para Adicionar Usuário */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Usuário</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <MemberAvatarUpload
                  memberId="new-user"
                  size="lg"
                  onAvatarChange={(url) => {
                    // O avatar será salvo quando o usuário for criado
                    console.log('Avatar selecionado:', url)
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <select
                  value={newUser.cargo}
                  onChange={(e) => setNewUser({ ...newUser, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Usuário">Usuário</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={newUser.telefone}
                  onChange={(e) => setNewUser({ ...newUser, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={adicionarUsuario}
                disabled={!newUser.nome || !newUser.email}
                className="flex-1"
              >
                Adicionar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Usuário */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Usuário</h3>
            
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <MemberAvatarUpload
                  memberId={editingUser.id}
                  currentAvatarUrl={editingUser.avatar_url}
                  size="lg"
                  onAvatarChange={(url) => {
                    setEditingUser({ ...editingUser, avatar_url: url })
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={editingUser.nome}
                  onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <select
                  value={editingUser.cargo}
                  onChange={(e) => setEditingUser({ ...editingUser, cargo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Usuário">Usuário</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Vendedor">Vendedor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={editingUser.telefone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, telefone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => editarUsuario(editingUser.id, editingUser)}
                className="flex-1"
              >
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const PipelinesContent = () => {
  const [pipelines, setPipelines] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [empresaId, setEmpresaId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingPipeline, setEditingPipeline] = useState<any>(null)
  const [pipelineData, setPipelineData] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6'
  })
  
  // Estados para edição de etapas
  const [showEtapasModal, setShowEtapasModal] = useState(false)
  const [editingEtapasPipeline, setEditingEtapasPipeline] = useState<any>(null)
  const [etapasData, setEtapasData] = useState<any[]>([])

  useEffect(() => {
    carregarPipelines()
  }, [])

  const carregarPipelines = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Buscar empresa do usuário
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      if (usuario?.empresa_id) {
        setEmpresaId(usuario.empresa_id)
        
        // Carregar pipelines
        const { data: pipelinesData, error } = await supabase
          .from('pipelines')
          .select('*, pipeline_etapas(*)')
          .eq('empresa_id', usuario.empresa_id)
          .order('nome')

        if (error) throw error
        setPipelines(pipelinesData || [])
      }
    } catch (error) {
      console.error('Erro ao carregar pipelines:', error)
      toast.error('Erro ao carregar pipelines')
    } finally {
      setLoading(false)
    }
  }

  const salvarPipeline = async () => {
    try {
      console.log('=== INICIANDO salvarPipeline() ===')
      console.log('empresaId:', empresaId)
      console.log('pipelineData:', pipelineData)
      console.log('editingPipeline:', editingPipeline)
      
      setSaving(true)
      
      if (!empresaId) {
        console.log('❌ Empresa não encontrada')
        toast.error('Empresa não encontrada')
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('❌ Usuário não autenticado')
        return
      }

      if (editingPipeline) {
        console.log('🔄 Atualizando pipeline existente...')
        // Atualizar pipeline existente
        const { error } = await supabase
          .from('pipelines')
          .update({
            ...pipelineData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPipeline.id)

        if (error) {
          console.log('❌ Erro ao atualizar pipeline:', error)
          throw error
        }
        console.log('✅ Pipeline atualizado com sucesso')
        toast.success('Pipeline atualizado com sucesso!')
      } else {
        console.log('🆕 Criando novo pipeline...')
        console.log('Dados para inserção:', {
          empresa_id: empresaId,
          ...pipelineData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        
        // Criar novo pipeline
        const { data: newPipeline, error } = await supabase
          .from('pipelines')
          .insert({
            empresa_id: empresaId,
            ...pipelineData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.log('❌ Erro ao criar pipeline:', error)
          console.log('Código do erro:', error.code)
          console.log('Mensagem do erro:', error.message)
          console.log('Detalhes do erro:', error.details)
          throw error
        }

        console.log('✅ Pipeline criado com sucesso:', newPipeline)

        // Criar etapas padrão
        const etapasPadrao = [
          { nome: 'Prospecção', ordem: 1, cor: '#6B7280' },
          { nome: 'Qualificação', ordem: 2, cor: '#F59E0B' },
          { nome: 'Proposta', ordem: 3, cor: '#10B981' },
          { nome: 'Negociação', ordem: 4, cor: '#3B82F6' },
          { nome: 'Fechado', ordem: 5, cor: '#8B5CF6' }
        ]

        console.log('🔄 Criando etapas padrão...')
        for (const etapa of etapasPadrao) {
          console.log('Criando etapa:', etapa)
          const { error: etapaError } = await supabase
            .from('pipeline_etapas')
            .insert({
              pipeline_id: newPipeline.id,
              empresa_id: empresaId,
              ...etapa,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          
          if (etapaError) {
            console.log('❌ Erro ao criar etapa:', etapaError)
            throw etapaError
          }
        }

        console.log('✅ Etapas criadas com sucesso')
        toast.success('Pipeline criado com sucesso!')
      }

      setShowModal(false)
      setEditingPipeline(null)
      setPipelineData({ nome: '', descricao: '', cor: '#3B82F6' })
      carregarPipelines()
    } catch (error) {
      console.error('❌ Erro ao salvar pipeline:', error)
      console.log('Tipo do erro:', typeof error)
      console.log('Erro é instância de Error?', error instanceof Error)
      console.log('Mensagem do erro:', error instanceof Error ? error.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(error, null, 2))
      toast.error('Erro ao salvar pipeline')
    } finally {
      setSaving(false)
    }
  }

  const editarPipeline = (pipeline: any) => {
    setEditingPipeline(pipeline)
    setPipelineData({
      nome: pipeline.nome,
      descricao: pipeline.descricao || '',
      cor: pipeline.cor || '#3B82F6'
    })
    setShowModal(true)
  }

  const editarEtapasPipeline = async (pipeline: any) => {
    try {
      console.log('=== INICIANDO editarEtapasPipeline ===')
      console.log('Pipeline recebido:', pipeline)
      
      setEditingEtapasPipeline(pipeline)
      
      // Carregar etapas do pipeline
      console.log('Chamando pipelinesAPI.buscarComEtapas...')
      const pipelineComEtapas = await pipelinesAPI.buscarComEtapas(pipeline.id)
      console.log('Resultado buscarComEtapas:', pipelineComEtapas)
      
      if (pipelineComEtapas) {
        console.log('Etapas encontradas:', pipelineComEtapas.etapas)
        setEtapasData(pipelineComEtapas.etapas)
      } else {
        console.log('Nenhuma etapa encontrada')
        setEtapasData([])
      }
      
      setShowEtapasModal(true)
    } catch (error) {
      console.error('Erro ao carregar etapas:', error)
      console.log('Tipo do erro:', typeof error)
      console.log('Erro é instância de Error?', error instanceof Error)
      console.log('Mensagem do erro:', error instanceof Error ? error.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(error, null, 2))
      toast.error('Erro ao carregar etapas do pipeline')
    }
  }

  const handleEtapasUpdated = () => {
    carregarPipelines()
  }



  // Função removida pois a coluna 'ativo' não existe na tabela pipelines

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando pipelines...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Pipelines de Vendas</h2>
          <p className="text-sm text-gray-600">Gerencie os pipelines de vendas</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pipeline
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Pipelines</p>
                <p className="text-2xl font-semibold">{pipelines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Pipelines</p>
                <p className="text-2xl font-semibold">
                  {pipelines.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Etapas</p>
                <p className="text-2xl font-semibold">
                  {pipelines.reduce((total, p) => total + (p.pipeline_etapas?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pipelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Pipelines Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pipelines.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum pipeline encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowModal(true)}
              >
                Criar Primeiro Pipeline
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pipelines.map((pipeline) => (
                <div key={pipeline.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: pipeline.cor || '#3B82F6' }}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{pipeline.nome}</h3>
                      <p className="text-sm text-gray-600">{pipeline.descricao}</p>
                      <p className="text-sm text-gray-500">
                        {pipeline.pipeline_etapas?.length || 0} etapas
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarPipeline(pipeline)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editarEtapasPipeline(pipeline)}
                      >
                        Etapas
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Pipeline */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingPipeline ? 'Editar Pipeline' : 'Novo Pipeline'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Pipeline</Label>
                <Input 
                  id="nome"
                  placeholder="Ex: Vendas B2B"
                  value={pipelineData.nome}
                  onChange={(e) => setPipelineData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao"
                  placeholder="Descrição do pipeline"
                  value={pipelineData.descricao}
                  onChange={(e) => setPipelineData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input 
                  id="cor"
                  type="color"
                  value={pipelineData.cor}
                  onChange={(e) => setPipelineData(prev => ({ ...prev, cor: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={salvarPipeline} 
                disabled={saving || !pipelineData.nome}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false)
                  setEditingPipeline(null)
                  setPipelineData({ nome: '', descricao: '', cor: '#3B82F6' })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Etapas */}
      <EditarEtapasModal
        open={showEtapasModal}
        onOpenChange={setShowEtapasModal}
        pipeline={editingEtapasPipeline}
        etapas={etapasData}
        onEtapasUpdated={handleEtapasUpdated}
      />
    </div>
  )
}

const ServicosContent = () => {
  const [servicos, setServicos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [servicoData, setServicoData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    ativo: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarServicos()
  }, [])

  const carregarServicos = async () => {
    try {
      setLoading(true)
      // Simular carregamento de serviços
      setServicos([
        { id: 1, nome: 'Desenvolvimento Web', descricao: 'Sites e aplicações web', preco: '5000.00', categoria: 'Tecnologia', ativo: true },
        { id: 2, nome: 'Marketing Digital', descricao: 'Estratégias de marketing', preco: '3000.00', categoria: 'Marketing', ativo: true },
        { id: 3, nome: 'Consultoria', descricao: 'Consultoria empresarial', preco: '800.00', categoria: 'Consultoria', ativo: false }
      ])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }

  const salvarServico = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Serviço salvo com sucesso!')
      setShowModal(false)
      setServicoData({ nome: '', descricao: '', preco: '', categoria: '', ativo: true })
      carregarServicos()
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      toast.error('Erro ao salvar serviço')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando serviços...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Serviços</h2>
          <p className="text-sm text-gray-600">Gerencie os serviços oferecidos</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Serviços</p>
                <p className="text-2xl font-semibold">{servicos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Serviços Ativos</p>
                <p className="text-2xl font-semibold">
                  {servicos.filter(s => s.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-semibold">
                  {new Set(servicos.map(s => s.categoria)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Serviços Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {servicos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum serviço encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowModal(true)}
              >
                Criar Primeiro Serviço
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {servicos.map((servico) => (
                <div key={servico.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{servico.nome}</h3>
                      <p className="text-sm text-gray-600">{servico.descricao}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>R$ {servico.preco}</span>
                        <span>•</span>
                        <span>{servico.categoria}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      servico.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {servico.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {servico.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Serviço */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Novo Serviço</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Serviço</Label>
                <Input 
                  id="nome"
                  placeholder="Ex: Desenvolvimento Web"
                  value={servicoData.nome}
                  onChange={(e) => setServicoData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao"
                  placeholder="Descrição do serviço"
                  value={servicoData.descricao}
                  onChange={(e) => setServicoData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preco">Preço</Label>
                  <Input 
                    id="preco"
                    type="number"
                    placeholder="0.00"
                    value={servicoData.preco}
                    onChange={(e) => setServicoData(prev => ({ ...prev, preco: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Input 
                    id="categoria"
                    placeholder="Ex: Tecnologia"
                    value={servicoData.categoria}
                    onChange={(e) => setServicoData(prev => ({ ...prev, categoria: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={salvarServico} 
                disabled={saving || !servicoData.nome}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false)
                  setServicoData({ nome: '', descricao: '', preco: '', categoria: '', ativo: true })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CategoriasContent = () => {
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [categoriaData, setCategoriaData] = useState({
    nome: '',
    descricao: '',
    cor: '#3B82F6',
    ativo: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarCategorias()
  }, [])

  const carregarCategorias = async () => {
    try {
      setLoading(true)
      // Simular carregamento de categorias
      setCategorias([
        { id: 1, nome: 'Tecnologia', descricao: 'Serviços de TI e desenvolvimento', cor: '#3B82F6', ativo: true, servicos: 5 },
        { id: 2, nome: 'Marketing', descricao: 'Estratégias de marketing digital', cor: '#10B981', ativo: true, servicos: 3 },
        { id: 3, nome: 'Consultoria', descricao: 'Consultoria empresarial', cor: '#F59E0B', ativo: true, servicos: 2 },
        { id: 4, nome: 'Design', descricao: 'Serviços de design gráfico', cor: '#8B5CF6', ativo: false, servicos: 1 }
      ])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast.error('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const salvarCategoria = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Categoria salva com sucesso!')
      setShowModal(false)
      setCategoriaData({ nome: '', descricao: '', cor: '#3B82F6', ativo: true })
      carregarCategorias()
    } catch (error) {
      console.error('Erro ao salvar categoria:', error)
      toast.error('Erro ao salvar categoria')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando categorias...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Categorias</h2>
          <p className="text-sm text-gray-600">Gerencie as categorias de serviços</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Categorias</p>
                <p className="text-2xl font-semibold">{categorias.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Categorias Ativas</p>
                <p className="text-2xl font-semibold">
                  {categorias.filter(c => c.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Serviços</p>
                <p className="text-2xl font-semibold">
                  {categorias.reduce((total, c) => total + c.servicos, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorias Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categorias.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma categoria encontrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowModal(true)}
              >
                Criar Primeira Categoria
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: categoria.cor + '20' }}
                    >
                      <Tag className="h-5 w-5" style={{ color: categoria.cor }} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{categoria.nome}</h3>
                      <p className="text-sm text-gray-600">{categoria.descricao}</p>
                      <p className="text-sm text-gray-500">{categoria.servicos} serviços</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categoria.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {categoria.ativo ? 'Ativa' : 'Inativa'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {categoria.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Categoria */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome da Categoria</Label>
                <Input 
                  id="nome"
                  placeholder="Ex: Tecnologia"
                  value={categoriaData.nome}
                  onChange={(e) => setCategoriaData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input 
                  id="descricao"
                  placeholder="Descrição da categoria"
                  value={categoriaData.descricao}
                  onChange={(e) => setCategoriaData(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="cor">Cor</Label>
                <Input 
                  id="cor"
                  type="color"
                  value={categoriaData.cor}
                  onChange={(e) => setCategoriaData(prev => ({ ...prev, cor: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={salvarCategoria} 
                disabled={saving || !categoriaData.nome}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false)
                  setCategoriaData({ nome: '', descricao: '', cor: '#3B82F6', ativo: true })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const ModelosContent = () => {
  const [modelos, setModelos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarModelos()
  }, [])

  const carregarModelos = async () => {
    try {
      setLoading(true)
      // Simular carregamento de modelos
      setModelos([
        { id: 1, nome: 'Contrato de Prestação de Serviços', tipo: 'Contrato', status: 'Ativo', downloads: 15 },
        { id: 2, nome: 'Proposta Comercial', tipo: 'Proposta', status: 'Ativo', downloads: 8 },
        { id: 3, nome: 'Termo de Compromisso', tipo: 'Termo', status: 'Inativo', downloads: 3 },
        { id: 4, nome: 'Orçamento Padrão', tipo: 'Orçamento', status: 'Ativo', downloads: 12 }
      ])
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
      toast.error('Erro ao carregar modelos')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando modelos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Modelos</h2>
          <p className="text-sm text-gray-600">Gerencie os modelos de documentos</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Modelos</p>
                <p className="text-2xl font-semibold">{modelos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Modelos Ativos</p>
                <p className="text-2xl font-semibold">
                  {modelos.filter(m => m.status === 'Ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Downloads</p>
                <p className="text-2xl font-semibold">
                  {modelos.reduce((total, m) => total + m.downloads, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modelos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelos.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum modelo encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Criar Primeiro Modelo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {modelos.map((modelo) => (
                <div key={modelo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{modelo.nome}</h3>
                      <p className="text-sm text-gray-600">{modelo.tipo}</p>
                      <p className="text-sm text-gray-500">{modelo.downloads} downloads</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modelo.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {modelo.status}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        {modelo.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const CadastrosContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Cadastros</h2>
        <p className="text-sm text-gray-600">Configure os dados básicos do sistema</p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Novo Cadastro
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'Pipelines de Vendas', icon: Target, status: 'Ativo' },
        { name: 'Serviços', icon: FileText, status: 'Pendente' },
        { name: 'Categorias de Serviços', icon: Tag, status: 'Pendente' },
        { name: 'Modelos de Contrato', icon: FileText, status: 'Pendente' }
      ].map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <item.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const NFSEContent = () => {
  const [configuracoes, setConfiguracoes] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de configurações NFS-e
      setConfiguracoes({
        ambiente: 'homologacao',
        certificado: 'certificado.p12',
        senha: '****',
        serie: '1',
        proximo_numero: '1001',
        municipio: 'São Paulo',
        uf: 'SP',
        cep: '01001-000',
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        telefone: '(11) 99999-9999'
      })
    } catch (error) {
      console.error('Erro ao carregar configurações NFS-e:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const salvarConfiguracoes = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações NFS-e salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando configurações NFS-e...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">NFS-e</h2>
          <p className="text-sm text-gray-600">Configure as opções de NFS-e</p>
        </div>
        <Button onClick={salvarConfiguracoes} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Ambiente</p>
                <p className="text-2xl font-semibold capitalize">{configuracoes.ambiente}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Próximo Número</p>
                <p className="text-2xl font-semibold">{configuracoes.proximo_numero}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Série</p>
                <p className="text-2xl font-semibold">{configuracoes.serie}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ambiente">Ambiente</Label>
              <select 
                id="ambiente"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.ambiente}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, ambiente: e.target.value }))}
              >
                <option value="homologacao">Homologação</option>
                <option value="producao">Produção</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="certificado">Certificado Digital</Label>
              <Input 
                id="certificado"
                placeholder="certificado.p12"
                value={configuracoes.certificado}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, certificado: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="senha">Senha do Certificado</Label>
              <Input 
                id="senha"
                type="password"
                placeholder="Senha do certificado"
                value={configuracoes.senha}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, senha: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serie">Série</Label>
                <Input 
                  id="serie"
                  placeholder="1"
                  value={configuracoes.serie}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, serie: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="proximo_numero">Próximo Número</Label>
                <Input 
                  id="proximo_numero"
                  placeholder="1001"
                  value={configuracoes.proximo_numero}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, proximo_numero: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço da Prefeitura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="municipio">Município</Label>
                <Input 
                  id="municipio"
                  placeholder="São Paulo"
                  value={configuracoes.municipio}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, municipio: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="uf">UF</Label>
                <Input 
                  id="uf"
                  placeholder="SP"
                  value={configuracoes.uf}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, uf: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input 
                id="cep"
                placeholder="00000-000"
                value={configuracoes.cep}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, cep: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input 
                id="logradouro"
                placeholder="Rua das Flores"
                value={configuracoes.logradouro}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, logradouro: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input 
                  id="numero"
                  placeholder="123"
                  value={configuracoes.numero}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, numero: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input 
                  id="bairro"
                  placeholder="Centro"
                  value={configuracoes.bairro}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, bairro: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input 
                id="telefone"
                placeholder="(11) 99999-9999"
                value={configuracoes.telefone}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, telefone: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const ContasBancariasContent = () => {
  const [contas, setContas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [contaData, setContaData] = useState({
    banco: '',
    agencia: '',
    conta: '',
    tipo: 'corrente',
    ativo: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarContas()
  }, [])

  const carregarContas = async () => {
    try {
      setLoading(true)
      // Simular carregamento de contas bancárias
      setContas([
        { id: 1, banco: 'Banco do Brasil', agencia: '1234', conta: '12345-6', tipo: 'corrente', ativo: true, saldo: '50000.00' },
        { id: 2, banco: 'Itaú', agencia: '5678', conta: '98765-4', tipo: 'poupanca', ativo: true, saldo: '25000.00' },
        { id: 3, banco: 'Santander', agencia: '9012', conta: '54321-0', tipo: 'corrente', ativo: false, saldo: '0.00' }
      ])
    } catch (error) {
      console.error('Erro ao carregar contas:', error)
      toast.error('Erro ao carregar contas bancárias')
    } finally {
      setLoading(false)
    }
  }

  const salvarConta = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Conta bancária salva com sucesso!')
      setShowModal(false)
      setContaData({ banco: '', agencia: '', conta: '', tipo: 'corrente', ativo: true })
      carregarContas()
    } catch (error) {
      console.error('Erro ao salvar conta:', error)
      toast.error('Erro ao salvar conta bancária')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando contas bancárias...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Contas Bancárias</h2>
          <p className="text-sm text-gray-600">Gerencie as contas bancárias</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Contas</p>
                <p className="text-2xl font-semibold">{contas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Contas Ativas</p>
                <p className="text-2xl font-semibold">
                  {contas.filter(c => c.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Saldo Total</p>
                <p className="text-2xl font-semibold">
                  R$ {contas.reduce((total, c) => total + parseFloat(c.saldo), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Contas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contas.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma conta encontrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowModal(true)}
              >
                Criar Primeira Conta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {contas.map((conta) => (
                <div key={conta.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{conta.banco}</h3>
                      <p className="text-sm text-gray-600">
                        Agência: {conta.agencia} • Conta: {conta.conta}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {conta.tipo} • Saldo: R$ {parseFloat(conta.saldo).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conta.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {conta.ativo ? 'Ativa' : 'Inativa'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {conta.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Nova Conta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nova Conta Bancária</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="banco">Banco</Label>
                <Input 
                  id="banco"
                  placeholder="Nome do banco"
                  value={contaData.banco}
                  onChange={(e) => setContaData(prev => ({ ...prev, banco: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agencia">Agência</Label>
                  <Input 
                    id="agencia"
                    placeholder="1234"
                    value={contaData.agencia}
                    onChange={(e) => setContaData(prev => ({ ...prev, agencia: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="conta">Conta</Label>
                  <Input 
                    id="conta"
                    placeholder="12345-6"
                    value={contaData.conta}
                    onChange={(e) => setContaData(prev => ({ ...prev, conta: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="tipo">Tipo de Conta</Label>
                <select 
                  id="tipo"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={contaData.tipo}
                  onChange={(e) => setContaData(prev => ({ ...prev, tipo: e.target.value }))}
                >
                  <option value="corrente">Corrente</option>
                  <option value="poupanca">Poupança</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={salvarConta} 
                disabled={saving || !contaData.banco || !contaData.agencia || !contaData.conta}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false)
                  setContaData({ banco: '', agencia: '', conta: '', tipo: 'corrente', ativo: true })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const FornecedoresContent = () => {
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarFornecedores()
  }, [])

  const carregarFornecedores = async () => {
    try {
      setLoading(true)
      // Simular carregamento de fornecedores
      setFornecedores([
        { id: 1, nome: 'Fornecedor A', cnpj: '12.345.678/0001-90', email: 'contato@fornecedora.com', telefone: '(11) 99999-9999', ativo: true },
        { id: 2, nome: 'Fornecedor B', cnpj: '98.765.432/0001-10', email: 'contato@fornecedorb.com', telefone: '(11) 88888-8888', ativo: true },
        { id: 3, nome: 'Fornecedor C', cnpj: '11.222.333/0001-44', email: 'contato@fornecedorc.com', telefone: '(11) 77777-7777', ativo: false }
      ])
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error)
      toast.error('Erro ao carregar fornecedores')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando fornecedores...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fornecedores</h2>
          <p className="text-sm text-gray-600">Gerencie os fornecedores</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Fornecedores</p>
                <p className="text-2xl font-semibold">{fornecedores.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Fornecedores Ativos</p>
                <p className="text-2xl font-semibold">
                  {fornecedores.filter(f => f.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Categorias</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fornecedores Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fornecedores.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum fornecedor encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Criar Primeiro Fornecedor
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fornecedores.map((fornecedor) => (
                <div key={fornecedor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{fornecedor.nome}</h3>
                      <p className="text-sm text-gray-600">{fornecedor.cnpj}</p>
                      <p className="text-sm text-gray-500">
                        {fornecedor.email} • {fornecedor.telefone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      fornecedor.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {fornecedor.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const ConfiguracoesFiscaisContent = () => {
  const [configuracoes, setConfiguracoes] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de configurações fiscais
      setConfiguracoes({
        regime_tributario: 'simples_nacional',
        aliquota_icms: '17.00',
        aliquota_iss: '5.00',
        aliquota_pis: '0.65',
        aliquota_cofins: '3.00',
        retencao_ir: '1.50',
        retencao_inss: '11.00',
        retencao_csll: '9.00'
      })
    } catch (error) {
      console.error('Erro ao carregar configurações fiscais:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const salvarConfiguracoes = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações fiscais salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando configurações fiscais...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Configurações Fiscais</h2>
          <p className="text-sm text-gray-600">Configure as opções fiscais</p>
        </div>
        <Button onClick={salvarConfiguracoes} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Regime Tributário</p>
                <p className="text-2xl font-semibold capitalize">
                  {configuracoes.regime_tributario?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Alíquota ICMS</p>
                <p className="text-2xl font-semibold">{configuracoes.aliquota_icms}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Alíquota ISS</p>
                <p className="text-2xl font-semibold">{configuracoes.aliquota_iss}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="regime_tributario">Regime Tributário</Label>
              <select 
                id="regime_tributario"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.regime_tributario}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, regime_tributario: e.target.value }))}
              >
                <option value="simples_nacional">Simples Nacional</option>
                <option value="lucro_presumido">Lucro Presumido</option>
                <option value="lucro_real">Lucro Real</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aliquota_icms">Alíquota ICMS (%)</Label>
                <Input 
                  id="aliquota_icms"
                  type="number"
                  step="0.01"
                  placeholder="17.00"
                  value={configuracoes.aliquota_icms}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, aliquota_icms: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="aliquota_iss">Alíquota ISS (%)</Label>
                <Input 
                  id="aliquota_iss"
                  type="number"
                  step="0.01"
                  placeholder="5.00"
                  value={configuracoes.aliquota_iss}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, aliquota_iss: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aliquota_pis">Alíquota PIS (%)</Label>
                <Input 
                  id="aliquota_pis"
                  type="number"
                  step="0.01"
                  placeholder="0.65"
                  value={configuracoes.aliquota_pis}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, aliquota_pis: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="aliquota_cofins">Alíquota COFINS (%)</Label>
                <Input 
                  id="aliquota_cofins"
                  type="number"
                  step="0.01"
                  placeholder="3.00"
                  value={configuracoes.aliquota_cofins}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, aliquota_cofins: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Retenções
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="retencao_ir">Retenção IR (%)</Label>
                <Input 
                  id="retencao_ir"
                  type="number"
                  step="0.01"
                  placeholder="1.50"
                  value={configuracoes.retencao_ir}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, retencao_ir: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="retencao_inss">Retenção INSS (%)</Label>
                <Input 
                  id="retencao_inss"
                  type="number"
                  step="0.01"
                  placeholder="11.00"
                  value={configuracoes.retencao_inss}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, retencao_inss: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="retencao_csll">Retenção CSLL (%)</Label>
              <Input 
                id="retencao_csll"
                type="number"
                step="0.01"
                placeholder="9.00"
                value={configuracoes.retencao_csll}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, retencao_csll: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const FinanceiroContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Financeiro</h2>
        <p className="text-sm text-gray-600">Configure as opções financeiras</p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nova Configuração
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'NFS-e', icon: FileText, status: 'Pendente' },
        { name: 'Contas Bancárias', icon: CreditCard, status: 'Pendente' },
        { name: 'Fornecedores', icon: DollarSign, status: 'Pendente' },
        { name: 'Configurações Fiscais', icon: Settings, status: 'Pendente' }
      ].map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <item.icon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const ModelosEmailContent = () => {
  const [modelos, setModelos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modeloData, setModeloData] = useState({
    nome: '',
    assunto: '',
    corpo: '',
    ativo: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarModelos()
  }, [])

  const carregarModelos = async () => {
    try {
      setLoading(true)
      // Simular carregamento de modelos de email
      setModelos([
        { id: 1, nome: 'Boas-vindas', assunto: 'Bem-vindo ao Nexus!', ativo: true, usos: 15 },
        { id: 2, nome: 'Recuperação de Senha', assunto: 'Recuperação de senha', ativo: true, usos: 8 },
        { id: 3, nome: 'Convite de Usuário', assunto: 'Convite para participar', ativo: true, usos: 12 },
        { id: 4, nome: 'Relatório Mensal', assunto: 'Relatório do mês', ativo: false, usos: 3 }
      ])
    } catch (error) {
      console.error('Erro ao carregar modelos:', error)
      toast.error('Erro ao carregar modelos de email')
    } finally {
      setLoading(false)
    }
  }

  const salvarModelo = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Modelo de email salvo com sucesso!')
      setShowModal(false)
      setModeloData({ nome: '', assunto: '', corpo: '', ativo: true })
      carregarModelos()
    } catch (error) {
      console.error('Erro ao salvar modelo:', error)
      toast.error('Erro ao salvar modelo')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando modelos de email...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Modelos de Email</h2>
          <p className="text-sm text-gray-600">Gerencie os modelos de email</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Modelo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Modelos</p>
                <p className="text-2xl font-semibold">{modelos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Modelos Ativos</p>
                <p className="text-2xl font-semibold">
                  {modelos.filter(m => m.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Usos</p>
                <p className="text-2xl font-semibold">
                  {modelos.reduce((total, m) => total + m.usos, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Modelos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modelos.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum modelo encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowModal(true)}
              >
                Criar Primeiro Modelo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {modelos.map((modelo) => (
                <div key={modelo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{modelo.nome}</h3>
                      <p className="text-sm text-gray-600">{modelo.assunto}</p>
                      <p className="text-sm text-gray-500">{modelo.usos} usos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modelo.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {modelo.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Visualizar
                      </Button>
                      <Button variant="outline" size="sm">
                        {modelo.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Novo Modelo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Novo Modelo de Email</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Modelo</Label>
                <Input 
                  id="nome"
                  placeholder="Ex: Boas-vindas"
                  value={modeloData.nome}
                  onChange={(e) => setModeloData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="assunto">Assunto</Label>
                <Input 
                  id="assunto"
                  placeholder="Assunto do email"
                  value={modeloData.assunto}
                  onChange={(e) => setModeloData(prev => ({ ...prev, assunto: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="corpo">Corpo do Email</Label>
                <textarea 
                  id="corpo"
                  rows={8}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Conteúdo do email..."
                  value={modeloData.corpo}
                  onChange={(e) => setModeloData(prev => ({ ...prev, corpo: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={salvarModelo} 
                disabled={saving || !modeloData.nome || !modeloData.assunto}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowModal(false)
                  setModeloData({ nome: '', assunto: '', corpo: '', ativo: true })
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const NotificacoesContent = () => {
  const [notificacoes, setNotificacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarNotificacoes()
  }, [])

  const carregarNotificacoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de notificações
      setNotificacoes([
        { id: 1, tipo: 'Email', evento: 'Novo Cliente', ativo: true },
        { id: 2, tipo: 'SMS', evento: 'Cobrança Vencida', ativo: true },
        { id: 3, tipo: 'Push', evento: 'Relatório Diário', ativo: false },
        { id: 4, tipo: 'Email', evento: 'Backup Completo', ativo: true }
      ])
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      toast.error('Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando notificações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
          <p className="text-sm text-gray-600">Configure as notificações do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Notificação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Notificações</p>
                <p className="text-2xl font-semibold">{notificacoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Notificações Ativas</p>
                <p className="text-2xl font-semibold">
                  {notificacoes.filter(n => n.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tipos de Canal</p>
                <p className="text-2xl font-semibold">
                  {new Set(notificacoes.map(n => n.tipo)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notificacoes.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma notificação encontrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Criar Primeira Notificação
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notificacoes.map((notificacao) => (
                <div key={notificacao.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{notificacao.evento}</h3>
                      <p className="text-sm text-gray-600">Canal: {notificacao.tipo}</p>
                      <p className="text-sm text-gray-500">Notificação automática</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notificacao.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notificacao.ativo ? 'Ativa' : 'Inativa'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        {notificacao.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const IntegracoesContent = () => {
  const [integracoes, setIntegracoes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarIntegracoes()
  }, [])

  const carregarIntegracoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de integrações
      setIntegracoes([
        { id: 1, nome: 'WhatsApp Business', tipo: 'Comunicação', status: 'Conectado', ultima_sincronizacao: '2024-01-15 10:30' },
        { id: 2, nome: 'Google Calendar', tipo: 'Calendário', status: 'Conectado', ultima_sincronizacao: '2024-01-15 09:15' },
        { id: 3, nome: 'Slack', tipo: 'Comunicação', status: 'Desconectado', ultima_sincronizacao: '2024-01-10 14:20' },
        { id: 4, nome: 'Zapier', tipo: 'Automação', status: 'Conectado', ultima_sincronizacao: '2024-01-15 11:45' }
      ])
    } catch (error) {
      console.error('Erro ao carregar integrações:', error)
      toast.error('Erro ao carregar integrações')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando integrações...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Integrações</h2>
          <p className="text-sm text-gray-600">Gerencie as integrações do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Integrações</p>
                <p className="text-2xl font-semibold">{integracoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Conectadas</p>
                <p className="text-2xl font-semibold">
                  {integracoes.filter(i => i.status === 'Conectado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tipos</p>
                <p className="text-2xl font-semibold">
                  {new Set(integracoes.map(i => i.tipo)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Integrações Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {integracoes.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma integração encontrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Adicionar Primeira Integração
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {integracoes.map((integracao) => (
                <div key={integracao.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{integracao.nome}</h3>
                      <p className="text-sm text-gray-600">{integracao.tipo}</p>
                      <p className="text-sm text-gray-500">
                        Última sincronização: {integracao.ultima_sincronizacao}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      integracao.status === 'Conectado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {integracao.status}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                      <Button variant="outline" size="sm">
                        {integracao.status === 'Conectado' ? 'Desconectar' : 'Conectar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const WebhooksContent = () => {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarWebhooks()
  }, [])

  const carregarWebhooks = async () => {
    try {
      setLoading(true)
      // Simular carregamento de webhooks
      setWebhooks([
        { id: 1, nome: 'Novo Cliente', url: 'https://api.exemplo.com/webhook/cliente', evento: 'cliente.criado', ativo: true },
        { id: 2, nome: 'Cobrança Paga', url: 'https://api.exemplo.com/webhook/pagamento', evento: 'cobranca.paga', ativo: true },
        { id: 3, nome: 'Relatório Gerado', url: 'https://api.exemplo.com/webhook/relatorio', evento: 'relatorio.gerado', ativo: false }
      ])
    } catch (error) {
      console.error('Erro ao carregar webhooks:', error)
      toast.error('Erro ao carregar webhooks')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando webhooks...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Webhooks</h2>
          <p className="text-sm text-gray-600">Gerencie os webhooks do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Webhook
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Webhooks</p>
                <p className="text-2xl font-semibold">{webhooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Webhooks Ativos</p>
                <p className="text-2xl font-semibold">
                  {webhooks.filter(w => w.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Eventos</p>
                <p className="text-2xl font-semibold">
                  {new Set(webhooks.map(w => w.evento)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Webhooks Configurados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum webhook encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Criar Primeiro Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{webhook.nome}</h3>
                      <p className="text-sm text-gray-600">{webhook.url}</p>
                      <p className="text-sm text-gray-500">Evento: {webhook.evento}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      webhook.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {webhook.ativo ? 'Ativo' : 'Inativo'}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Testar
                      </Button>
                      <Button variant="outline" size="sm">
                        {webhook.ativo ? 'Desativar' : 'Ativar'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const ComunicacaoContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Comunicação</h2>
        <p className="text-sm text-gray-600">Configure as opções de comunicação</p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nova Configuração
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'Modelos de Email', icon: Mail, status: 'Pendente' },
        { name: 'Notificações', icon: Settings, status: 'Pendente' },
        { name: 'Integrações', icon: Settings, status: 'Pendente' },
        { name: 'Webhooks', icon: Settings, status: 'Pendente' }
      ].map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <item.icon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

const AparenciaContent = () => {
  const [configuracoes, setConfiguracoes] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de configurações de aparência
      setConfiguracoes({
        tema: 'claro',
        cor_primaria: '#3B82F6',
        cor_secundaria: '#10B981',
        fonte: 'Inter',
        tamanho_fonte: '14px',
        modo_escuro: false,
        animacoes: true,
        compacto: false
      })
    } catch (error) {
      console.error('Erro ao carregar configurações de aparência:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const salvarConfiguracoes = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações de aparência salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando configurações de aparência...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Aparência</h2>
          <p className="text-sm text-gray-600">Configure a aparência do sistema</p>
        </div>
        <Button onClick={salvarConfiguracoes} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Tema Atual</p>
                <p className="text-2xl font-semibold capitalize">{configuracoes.tema}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Modo Escuro</p>
                <p className="text-2xl font-semibold">
                  {configuracoes.modo_escuro ? 'Ativo' : 'Inativo'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Fonte</p>
                <p className="text-2xl font-semibold">{configuracoes.fonte}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tema">Tema</Label>
              <select 
                id="tema"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.tema}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, tema: e.target.value }))}
              >
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="fonte">Fonte</Label>
              <select 
                id="fonte"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.fonte}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, fonte: e.target.value }))}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Arial">Arial</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="tamanho_fonte">Tamanho da Fonte</Label>
              <select 
                id="tamanho_fonte"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.tamanho_fonte}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, tamanho_fonte: e.target.value }))}
              >
                <option value="12px">Pequeno (12px)</option>
                <option value="14px">Normal (14px)</option>
                <option value="16px">Grande (16px)</option>
                <option value="18px">Muito Grande (18px)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="modo_escuro">Modo Escuro</Label>
                <p className="text-sm text-gray-600">Ativar modo escuro</p>
              </div>
              <input 
                type="checkbox"
                id="modo_escuro"
                checked={configuracoes.modo_escuro}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, modo_escuro: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animacoes">Animações</Label>
                <p className="text-sm text-gray-600">Ativar animações</p>
              </div>
              <input 
                type="checkbox"
                id="animacoes"
                checked={configuracoes.animacoes}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, animacoes: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compacto">Modo Compacto</Label>
                <p className="text-sm text-gray-600">Interface mais compacta</p>
              </div>
              <input 
                type="checkbox"
                id="compacto"
                checked={configuracoes.compacto}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, compacto: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cor_primaria">Cor Primária</Label>
              <Input 
                id="cor_primaria"
                type="color"
                value={configuracoes.cor_primaria}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, cor_primaria: e.target.value }))}
                className="h-10"
              />
            </div>
            
            <div>
              <Label htmlFor="cor_secundaria">Cor Secundária</Label>
              <Input 
                id="cor_secundaria"
                type="color"
                value={configuracoes.cor_secundaria}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, cor_secundaria: e.target.value }))}
                className="h-10"
              />
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="space-y-2">
                <div 
                  className="h-8 rounded"
                  style={{ backgroundColor: configuracoes.cor_primaria }}
                />
                <div 
                  className="h-8 rounded"
                  style={{ backgroundColor: configuracoes.cor_secundaria }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const SegurancaContent = () => {
  const [configuracoes, setConfiguracoes] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    carregarConfiguracoes()
  }, [])

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true)
      // Simular carregamento de configurações de segurança
      setConfiguracoes({
        autenticacao_2fa: true,
        sessao_timeout: 30,
        tentativas_login: 3,
        bloqueio_conta: true,
        historico_senhas: 5,
        complexidade_senha: 'media',
        notificacoes_seguranca: true,
        logs_acesso: true
      })
    } catch (error) {
      console.error('Erro ao carregar configurações de segurança:', error)
      toast.error('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const salvarConfiguracoes = async () => {
    try {
      setSaving(true)
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Configurações de segurança salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando configurações de segurança...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
          <p className="text-sm text-gray-600">Configure as opções de segurança</p>
        </div>
        <Button onClick={salvarConfiguracoes} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">2FA Ativo</p>
                <p className="text-2xl font-semibold">
                  {configuracoes.autenticacao_2fa ? 'Sim' : 'Não'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Timeout Sessão</p>
                <p className="text-2xl font-semibold">{configuracoes.sessao_timeout} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Tentativas Login</p>
                <p className="text-2xl font-semibold">{configuracoes.tentativas_login}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autenticacao_2fa">Autenticação 2FA</Label>
                <p className="text-sm text-gray-600">Requer autenticação de dois fatores</p>
              </div>
              <input 
                type="checkbox"
                id="autenticacao_2fa"
                checked={configuracoes.autenticacao_2fa}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, autenticacao_2fa: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div>
              <Label htmlFor="sessao_timeout">Timeout da Sessão (minutos)</Label>
              <Input 
                id="sessao_timeout"
                type="number"
                min="5"
                max="480"
                value={configuracoes.sessao_timeout}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, sessao_timeout: parseInt(e.target.value) }))}
              />
            </div>
            
            <div>
              <Label htmlFor="tentativas_login">Tentativas de Login</Label>
              <Input 
                id="tentativas_login"
                type="number"
                min="1"
                max="10"
                value={configuracoes.tentativas_login}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, tentativas_login: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bloqueio_conta">Bloqueio de Conta</Label>
                <p className="text-sm text-gray-600">Bloquear conta após tentativas falhadas</p>
              </div>
              <input 
                type="checkbox"
                id="bloqueio_conta"
                checked={configuracoes.bloqueio_conta}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, bloqueio_conta: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Senhas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="complexidade_senha">Complexidade da Senha</Label>
              <select 
                id="complexidade_senha"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                value={configuracoes.complexidade_senha}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, complexidade_senha: e.target.value }))}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="muito_alta">Muito Alta</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="historico_senhas">Histórico de Senhas</Label>
              <Input 
                id="historico_senhas"
                type="number"
                min="0"
                max="20"
                value={configuracoes.historico_senhas}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, historico_senhas: parseInt(e.target.value) }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notificacoes_seguranca">Notificações de Segurança</Label>
                <p className="text-sm text-gray-600">Enviar notificações de segurança</p>
              </div>
              <input 
                type="checkbox"
                id="notificacoes_seguranca"
                checked={configuracoes.notificacoes_seguranca}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, notificacoes_seguranca: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="logs_acesso">Logs de Acesso</Label>
                <p className="text-sm text-gray-600">Registrar logs de acesso</p>
              </div>
              <input 
                type="checkbox"
                id="logs_acesso"
                checked={configuracoes.logs_acesso}
                onChange={(e) => setConfiguracoes(prev => ({ ...prev, logs_acesso: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const BackupContent = () => {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarBackups()
  }, [])

  const carregarBackups = async () => {
    try {
      setLoading(true)
      // Simular carregamento de backups
      setBackups([
        { id: 1, nome: 'Backup Completo', tipo: 'Completo', tamanho: '2.5 GB', data: '2024-01-15 10:30', status: 'Concluído' },
        { id: 2, nome: 'Backup Incremental', tipo: 'Incremental', tamanho: '150 MB', data: '2024-01-14 23:00', status: 'Concluído' },
        { id: 3, nome: 'Backup Manual', tipo: 'Manual', tamanho: '2.3 GB', data: '2024-01-10 15:45', status: 'Concluído' },
        { id: 4, nome: 'Backup Automático', tipo: 'Automático', tamanho: '2.1 GB', data: '2024-01-09 02:00', status: 'Falhou' }
      ])
    } catch (error) {
      console.error('Erro ao carregar backups:', error)
      toast.error('Erro ao carregar backups')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando backups...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Backup</h2>
          <p className="text-sm text-gray-600">Gerencie os backups do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Backup
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Backups</p>
                <p className="text-2xl font-semibold">{backups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Backups Concluídos</p>
                <p className="text-2xl font-semibold">
                  {backups.filter(b => b.status === 'Concluído').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Espaço Total</p>
                <p className="text-2xl font-semibold">
                  {backups.reduce((total, b) => total + parseFloat(b.tamanho.replace(' GB', '').replace(' MB', '')), 0).toFixed(1)} GB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Histórico de Backups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum backup encontrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
              >
                Criar Primeiro Backup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{backup.nome}</h3>
                      <p className="text-sm text-gray-600">{backup.tipo}</p>
                      <p className="text-sm text-gray-500">
                        {backup.data} • {backup.tamanho}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      backup.status === 'Concluído' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {backup.status}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        Restaurar
                      </Button>
                      <Button variant="outline" size="sm">
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const LogsContent = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carregarLogs()
  }, [])

  const carregarLogs = async () => {
    try {
      setLoading(true)
      // Simular carregamento de logs
      setLogs([
        { id: 1, nivel: 'INFO', mensagem: 'Usuário logado com sucesso', usuario: 'admin@empresa.com', data: '2024-01-15 10:30:15', ip: '192.168.1.100' },
        { id: 2, nivel: 'WARNING', mensagem: 'Tentativa de login falhada', usuario: 'usuario@empresa.com', data: '2024-01-15 10:25:30', ip: '192.168.1.101' },
        { id: 3, nivel: 'ERROR', mensagem: 'Erro ao conectar com banco de dados', usuario: 'sistema', data: '2024-01-15 10:20:45', ip: '127.0.0.1' },
        { id: 4, nivel: 'INFO', mensagem: 'Backup criado com sucesso', usuario: 'sistema', data: '2024-01-15 02:00:00', ip: '127.0.0.1' }
      ])
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
      toast.error('Erro ao carregar logs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando logs...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Logs</h2>
          <p className="text-sm text-gray-600">Visualize os logs do sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Logs</p>
                <p className="text-2xl font-semibold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Logs de Hoje</p>
                <p className="text-2xl font-semibold">
                  {logs.filter(l => l.data.includes('2024-01-15')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Níveis</p>
                <p className="text-2xl font-semibold">
                  {new Set(logs.map(l => l.nivel)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Logs do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum log encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      log.nivel === 'ERROR' ? 'bg-red-100' :
                      log.nivel === 'WARNING' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <Settings className={`h-5 w-5 ${
                        log.nivel === 'ERROR' ? 'text-red-600' :
                        log.nivel === 'WARNING' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{log.mensagem}</h3>
                      <p className="text-sm text-gray-600">{log.usuario}</p>
                      <p className="text-sm text-gray-500">
                        {log.data} • {log.ip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.nivel === 'ERROR' ? 'bg-red-100 text-red-800' :
                      log.nivel === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {log.nivel}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const SistemaContent = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Sistema</h2>
        <p className="text-sm text-gray-600">Configure as opções do sistema</p>
      </div>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Nova Configuração
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { name: 'Aparência', icon: Settings, status: 'Pendente', description: 'Configure o tema e cores' },
        { name: 'Segurança', icon: Settings, status: 'Pendente', description: 'Configurações de segurança' },
        { name: 'Backup', icon: Settings, status: 'Pendente', description: 'Backup e restauração' },
        { name: 'Logs', icon: Settings, status: 'Pendente', description: 'Visualize logs do sistema' }
      ].map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <item.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.status === 'Ativo' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Configurar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    
    {/* Informações */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          Configure as opções avançadas do sistema, incluindo aparência, segurança e backup.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-800">
            <strong>Atenção:</strong> Algumas configurações podem afetar o funcionamento do sistema. 
            Faça backup antes de alterar configurações críticas.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Estrutura do sidebar interno de configurações com tabs
const configSections = [
  {
    id: 'empresa',
    name: 'Empresa',
    icon: Building2,
    items: [
      { id: 'dados-empresa', name: 'Dados da Empresa', component: EmpresaContent }
    ]
  },
  {
    id: 'usuarios',
    name: 'Usuários',
    icon: Users,
    items: [
      { id: 'usuarios-ativos', name: 'Gerenciar Usuários', component: UsuariosContent }
    ]
  },
  {
    id: 'cadastros',
    name: 'Cadastros',
    icon: Target,
    items: [
      { id: 'pipelines', name: 'Pipelines de Vendas', component: PipelinesContent },
      { id: 'servicos', name: 'Serviços', component: ServicosContent },
      { id: 'categorias', name: 'Categorias', component: CategoriasContent },
      { id: 'modelos', name: 'Modelos', component: ModelosContent }
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    items: [
      { id: 'nfs-e', name: 'NFS-e', component: NFSEContent },
      { id: 'contas-bancarias', name: 'Contas Bancárias', component: ContasBancariasContent },
      { id: 'fornecedores', name: 'Fornecedores', component: FornecedoresContent },
      { id: 'configuracoes-fiscais', name: 'Configurações Fiscais', component: ConfiguracoesFiscaisContent }
    ]
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    icon: Mail,
    items: [
      { id: 'modelos-email', name: 'Modelos de Email', component: ModelosEmailContent },
      { id: 'notificacoes', name: 'Notificações', component: NotificacoesContent },
      { id: 'integracoes', name: 'Integrações', component: IntegracoesContent },
      { id: 'webhooks', name: 'Webhooks', component: WebhooksContent }
    ]
  },
  {
    id: 'sistema',
    name: 'Sistema',
    icon: Settings,
    items: [
      { id: 'aparencia', name: 'Aparência', component: AparenciaContent },
      { id: 'seguranca', name: 'Segurança', component: SegurancaContent },
      { id: 'backup', name: 'Backup', component: BackupContent },
      { id: 'logs', name: 'Logs', component: LogsContent }
    ]
  }
]

export default function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState<string>('empresa')
  const [activeTab, setActiveTab] = useState<string>('dados-empresa')
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('configuracoes-sidebar-open')
      return saved ? JSON.parse(saved) : true
    }
    return true
  })

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    const section = configSections.find(s => s.id === sectionId)
    if (section && section.items.length > 0) {
      setActiveTab(section.items[0].id)
    }
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('configuracoes-sidebar-open', JSON.stringify(newState))
    }
  }

  const activeSectionData = configSections.find(s => s.id === activeSection)
  const activeTabData = activeSectionData?.items.find(item => item.id === activeTab)
  const ActiveComponent = activeTabData?.component

  return (
    <div className="flex h-full">
      {/* Sidebar Interno */}
      <div className={cn(
        'bg-gray-50 border-r border-gray-200 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-80' : 'w-0'
      )}>
        <div className={cn(
          'p-4 transition-opacity duration-300',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h2>
            <p className="text-sm text-gray-600">Gerencie os dados do sistema</p>
          </div>

          <nav className="space-y-2">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  'flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <section.icon className="h-4 w-4 mr-3" />
                <span>{section.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Botão Toggle Sidebar */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50 group"
        style={{ left: sidebarOpen ? '320px' : '16px' }}
        title={sidebarOpen ? 'Ocultar menu' : 'Mostrar menu'}
      >
        {sidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        )}
        <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {sidebarOpen ? 'Ocultar menu' : 'Mostrar menu'}
        </span>
      </button>

      {/* Conteúdo Principal com Tabs */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeSectionData && (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  {!sidebarOpen && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <activeSectionData.icon className="h-4 w-4" />
                      <span>{activeSectionData.name}</span>
                    </div>
                  )}
                  <h1 className="text-2xl font-bold text-gray-900">{activeSectionData.name}</h1>
                </div>
                <p className="text-gray-600 mt-2">Configure as opções de {activeSectionData.name.toLowerCase()}</p>
              </div>

              {/* Tabs com Rolagem Horizontal */}
              {activeSectionData.items.length > 1 && (
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2">
                    {activeSectionData.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={cn(
                          'py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
                          activeTab === item.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Conteúdo da Tab Ativa */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {activeTabData ? (
                  <ActiveComponent />
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">Configurações para {activeSectionData.name} serão implementadas aqui.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Esta funcionalidade está em desenvolvimento.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 