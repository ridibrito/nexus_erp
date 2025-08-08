'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EmpresaSelect } from '@/components/ui/empresa-select'
import { TelefoneInput } from '@/components/ui/telefone-input'
import { criarPessoa } from '@/lib/actions/pessoas'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Telefone {
  numero: string
  tipo: string
}

export default function NovaPessoaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    telefones: [] as Telefone[],
    cargo: '',
    email: '',
    outras_informacoes: '',
    empresa_id: ''
  })

  const handleInputChange = (field: string, value: string | Telefone[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório')
      return
    }

    setLoading(true)

    try {
      // Preparar dados do formulário
      const formDataToSend = new FormData()
      formDataToSend.append('nome', formData.nome)
      formDataToSend.append('cargo', formData.cargo)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('outras_informacoes', formData.outras_informacoes)
      
      // Adicionar telefones como JSON
      if (formData.telefones.length > 0) {
        formDataToSend.append('telefone', JSON.stringify(formData.telefones))
      }
      
      // Adicionar empresa_id se selecionada
      if (formData.empresa_id) {
        formDataToSend.append('empresa_id', formData.empresa_id)
      }

      const result = await criarPessoa(formDataToSend)

      if (result.success) {
        toast.success('Pessoa criada com sucesso!')
        router.push('/pessoas')
      } else {
        toast.error(result.error || 'Erro ao criar pessoa')
      }
    } catch (error) {
      console.error('Erro ao criar pessoa:', error)
      toast.error('Erro ao criar pessoa')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Link href="/pessoas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Nova pessoa</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna Esquerda */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome completo"
                  maxLength={200}
                  required
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.nome.length}/200
                </div>
              </div>

              <TelefoneInput
                value={formData.telefones}
                onChange={(telefones) => handleInputChange('telefones', telefones)}
              />

              <div>
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  type="text"
                  value={formData.cargo}
                  onChange={(e) => handleInputChange('cargo', e.target.value)}
                  placeholder="Cargo ou função"
                />
              </div>

              <div>
                <Label htmlFor="outras_informacoes">Outras informações</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between"
                >
                  <span>Expandir</span>
                  <span>▼</span>
                </Button>
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <EmpresaSelect
                value={formData.empresa_id}
                onChange={(value) => handleInputChange('empresa_id', value)}
                placeholder="Buscar empresa..."
                label="Empresa"
              />
            </div>
          </div>

          {/* Outras informações expandidas */}
          <div className="border-t pt-6">
            <Label htmlFor="outras_informacoes">Outras informações</Label>
            <Textarea
              id="outras_informacoes"
              value={formData.outras_informacoes}
              onChange={(e) => handleInputChange('outras_informacoes', e.target.value)}
              placeholder="Informações adicionais sobre a pessoa..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/pessoas">
              <Button type="button" variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Pessoa'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
