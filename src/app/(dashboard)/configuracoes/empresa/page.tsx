'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Building2, 
  MapPin, 
  Phone, 
  Save, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface EmpresaData {
  id?: string
  workspace_id?: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  inscricao_estadual: string
  inscricao_municipal: string
  email: string
  telefone: string
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
  created_at?: string
  updated_at?: string
}

export default function EmpresaPage() {
  const [empresa, setEmpresa] = useState<EmpresaData>({
    razao_social: '',
    nome_fantasia: '',
    cnpj: '',
    inscricao_estadual: '',
    inscricao_municipal: '',
    email: '',
    telefone: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)

  // Carregar workspace ID
  useEffect(() => {
    const getWorkspaceId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Buscar workspace do usuário
        const { data: membros } = await supabase
          .from('membros')
          .select('workspace_id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        if (membros?.workspace_id) {
          setWorkspaceId(membros.workspace_id)
          await carregarDadosEmpresa(membros.workspace_id)
        } else {
          // Se não encontrar, criar workspace padrão
          await criarWorkspacePadrao(user.id)
        }
      } catch (error) {
        console.error('Erro ao carregar workspace:', error)
        toast.error('Erro ao carregar dados da empresa')
      }
    }

    getWorkspaceId()
  }, [])

  const criarWorkspacePadrao = async (userId: string) => {
    try {
      setLoading(true)
      
      // 1. Criar workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          nome: 'Nexus ERP - Workspace Padrão'
        })
        .select()
        .single()

      if (workspaceError) throw workspaceError

      // 2. Adicionar usuário como membro
      const { error: membroError } = await supabase
        .from('membros')
        .insert({
          workspace_id: workspace.id,
          user_id: userId,
          nome: 'Administrador',
          email: 'admin@nexus.com',
          cargo: 'Administrador',
          is_active: true
        })

      if (membroError) throw membroError

      setWorkspaceId(workspace.id)
      toast.success('Workspace criado com sucesso!')
      
    } catch (error) {
      console.error('Erro ao criar workspace:', error)
      toast.error('Erro ao criar workspace')
    } finally {
      setLoading(false)
    }
  }

  const carregarDadosEmpresa = async (workspaceId: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('empresas_proprias')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setEmpresa({
          ...data,
          endereco: data.endereco || {
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: ''
          }
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error)
      toast.error('Erro ao carregar dados da empresa')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEmpresa(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEnderecoChange = (field: string, value: string) => {
    setEmpresa(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!workspaceId) {
      toast.error('Workspace não encontrado')
      return
    }

    try {
      setSaving(true)
      
      const dadosEmpresa = {
        ...empresa,
        workspace_id: workspaceId
      }

      let result
      if (empresa.id) {
        // Atualizar
        result = await supabase
          .from('empresas_proprias')
          .update(dadosEmpresa)
          .eq('id', empresa.id)
          .select()
          .single()
      } else {
        // Criar
        result = await supabase
          .from('empresas_proprias')
          .insert(dadosEmpresa)
          .select()
          .single()
      }

      if (result.error) throw result.error

      setEmpresa(result.data)
      toast.success('Dados da empresa salvos com sucesso!')
      
    } catch (error) {
      console.error('Erro ao salvar dados da empresa:', error)
      toast.error('Erro ao salvar dados da empresa')
    } finally {
      setSaving(false)
    }
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
      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="razao_social">Razão Social *</Label>
                <Input
                  id="razao_social"
                  value={empresa.razao_social}
                  onChange={(e) => handleInputChange('razao_social', e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                <Input
                  id="nome_fantasia"
                  value={empresa.nome_fantasia}
                  onChange={(e) => handleInputChange('nome_fantasia', e.target.value)}
                  placeholder="Nome fantasia"
                />
              </div>

              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={empresa.cnpj}
                  onChange={(e) => handleInputChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                  <Input
                    id="inscricao_estadual"
                    value={empresa.inscricao_estadual}
                    onChange={(e) => handleInputChange('inscricao_estadual', e.target.value)}
                    placeholder="IE"
                  />
                </div>
                <div>
                  <Label htmlFor="inscricao_municipal">Inscrição Municipal</Label>
                  <Input
                    id="inscricao_municipal"
                    value={empresa.inscricao_municipal}
                    onChange={(e) => handleInputChange('inscricao_municipal', e.target.value)}
                    placeholder="IM"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={empresa.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contato@empresa.com"
                />
              </div>

              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={empresa.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={empresa.endereco.cep}
                    onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                    placeholder="00000-000"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="logradouro">Logradouro</Label>
                  <Input
                    id="logradouro"
                    value={empresa.endereco.logradouro}
                    onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={empresa.endereco.numero}
                    onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                    placeholder="123"
                  />
                </div>

                <div>
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    value={empresa.endereco.complemento}
                    onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                    placeholder="Sala, apto, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={empresa.endereco.bairro}
                    onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                    placeholder="Centro"
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={empresa.endereco.cidade}
                    onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                    placeholder="São Paulo"
                  />
                </div>

                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={empresa.endereco.estado}
                    onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                    placeholder="SP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Dados
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Status do Workspace */}
      {workspaceId && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">
                Workspace conectado: {workspaceId}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 