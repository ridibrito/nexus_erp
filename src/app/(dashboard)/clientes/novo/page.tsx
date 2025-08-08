'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MaskedInput } from '@/components/ui/masked-input'
import { CNPJInput } from '@/components/ui/cnpj-input'
import { maskPhone, maskCPFCNPJ, validateCPF, validateCNPJ, removeMask } from '@/lib/utils'
import { criarCliente } from '@/lib/actions/clientes'
import { testClientesAPI } from '@/lib/api/test-clientes'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NovoClientePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [apiTested, setApiTested] = useState(false)
  const [formData, setFormData] = useState({
    tipo: 'pessoa_fisica' as 'pessoa_fisica' | 'pessoa_juridica',
    nome: '',
    cpf: '',
    cnpj: '',
    email: '',
    telefone: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: ''
  })

  useEffect(() => {
    const testAPI = async () => {
      const success = await testClientesAPI()
      setApiTested(true)
      if (!success) {
        toast.error('Erro de conexão com o banco de dados')
      }
    }
    testAPI()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCNPJDataLoaded = (data: any) => {
    setFormData(prev => ({
      ...prev,
      nome: data.razao_social || prev.nome,
      cnpj: data.cnpj || prev.cnpj,
      email: data.email || prev.email,
      telefone: data.telefone || prev.telefone,
      cep: data.cep || prev.cep,
      endereco: data.logradouro || prev.endereco,
      cidade: data.municipio || prev.cidade,
      estado: data.uf || prev.estado
    }))
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
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email inválido')
      return false
    }
    if (formData.tipo === 'pessoa_fisica' && formData.cpf && !validateCPF(formData.cpf)) {
      toast.error('CPF inválido')
      return false
    }
    if (formData.tipo === 'pessoa_juridica' && formData.cnpj && !validateCNPJ(formData.cnpj)) {
      toast.error('CNPJ inválido')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('tipo', formData.tipo)
      formDataToSend.append('nome', formData.nome)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('telefone', formData.telefone)
      
      if (formData.tipo === 'pessoa_fisica') {
        formDataToSend.append('cpf', formData.cpf)
      } else {
        formDataToSend.append('cnpj', formData.cnpj)
      }

      // Adicionar endereço como JSON se preenchido
      if (formData.cep || formData.endereco || formData.cidade || formData.estado) {
        const endereco = {
          cep: formData.cep,
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado
        }
        formDataToSend.append('endereco', JSON.stringify(endereco))
      }

      const result = await criarCliente(formDataToSend)

      if (result.success) {
        toast.success('Cliente criado com sucesso!')
        router.push('/clientes')
      } else {
        toast.error(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      toast.error('Erro ao criar cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/clientes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Novo Cliente</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
              </select>
            </div>

            <div>
              <Label htmlFor="nome">
                {formData.tipo === 'pessoa_fisica' ? 'Nome Completo *' : 'Razão Social *'}
              </Label>
              <Input
                id="nome"
                type="text" 
                name="nome" 
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className="mt-1"
                placeholder={formData.tipo === 'pessoa_fisica' ? 'Nome completo' : 'Razão social da empresa'}
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

            <div>
              <Label htmlFor="cep">CEP</Label>
              <MaskedInput
                id="cep"
                name="cep" 
                value={formData.cep}
                onValueChange={(value) => handleInputChange('cep', value)}
                className="mt-1"
                placeholder="00000-000"
                mask={(value) => value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')}
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                type="text" 
                name="endereco" 
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                className="mt-1"
                placeholder="Rua, número, complemento"
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                type="text" 
                name="cidade" 
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                className="mt-1"
                placeholder="Cidade"
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                type="text" 
                name="estado" 
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                className="mt-1"
                placeholder="UF"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/clientes">
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading || !apiTested}>
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
  )
} 