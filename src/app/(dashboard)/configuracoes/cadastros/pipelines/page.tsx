'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target,
  ArrowRight,
  Palette
} from 'lucide-react'

interface Pipeline {
  id: string
  nome: string
  etapas: string[]
  cor: string
  ativo: boolean
}

const pipelinesMock: Pipeline[] = [
  {
    id: 'vendas',
    nome: 'Pipeline de Vendas',
    etapas: ['Prospecção', 'Qualificação', 'Proposta', 'Negociação', 'Fechado'],
    cor: 'bg-blue-500',
    ativo: true
  },
  {
    id: 'marketing',
    nome: 'Pipeline de Marketing',
    etapas: ['Lead', 'MQL', 'SQL', 'Oportunidade', 'Cliente'],
    cor: 'bg-green-500',
    ativo: true
  },
  {
    id: 'suporte',
    nome: 'Pipeline de Suporte',
    etapas: ['Abertura', 'Análise', 'Em Andamento', 'Teste', 'Resolvido'],
    cor: 'bg-purple-500',
    ativo: false
  }
]

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(pipelinesMock)
  const [editingPipeline, setEditingPipeline] = useState<Pipeline | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleAddPipeline = () => {
    setEditingPipeline(null)
    setShowForm(true)
  }

  const handleEditPipeline = (pipeline: Pipeline) => {
    setEditingPipeline(pipeline)
    setShowForm(true)
  }

  const handleDeletePipeline = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pipeline?')) {
      setPipelines(prev => prev.filter(p => p.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setPipelines(prev => 
      prev.map(p => p.id === id ? { ...p, ativo: !p.ativo } : p)
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipelines de Vendas</h1>
        <p className="text-gray-600 mt-2">Configure os pipelines e etapas do seu CRM</p>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button onClick={handleAddPipeline}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Pipeline
          </Button>
        </div>
      </div>

      {/* Lista de Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pipelines.map((pipeline) => (
          <Card key={pipeline.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${pipeline.cor}`}></div>
                  <CardTitle className="text-lg">{pipeline.nome}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={pipeline.ativo ? 'default' : 'secondary'}>
                    {pipeline.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(pipeline.id)}
                  >
                    {pipeline.ativo ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {pipeline.etapas.length} etapas
                  </span>
                </div>
                
                {/* Etapas */}
                <div className="space-y-2">
                  {pipeline.etapas.map((etapa, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{etapa}</span>
                      {index < pipeline.etapas.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPipeline(pipeline)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePipeline(pipeline.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Formulário Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>
                {editingPipeline ? 'Editar Pipeline' : 'Novo Pipeline'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Pipeline</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Pipeline de Vendas"
                    defaultValue={editingPipeline?.nome}
                  />
                </div>

                <div>
                  <Label htmlFor="cor">Cor</Label>
                  <div className="flex gap-2 mt-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'].map((cor) => (
                      <button
                        key={cor}
                        className={`w-8 h-8 rounded-full ${cor} border-2 border-transparent hover:border-gray-300`}
                        title={cor}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Etapas</Label>
                  <div className="space-y-2 mt-2">
                    {editingPipeline?.etapas.map((etapa, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder={`Etapa ${index + 1}`}
                          defaultValue={etapa}
                        />
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Etapa
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    {editingPipeline ? 'Salvar Alterações' : 'Criar Pipeline'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 