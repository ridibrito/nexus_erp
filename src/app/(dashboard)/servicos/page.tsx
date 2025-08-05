'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  Filter
} from 'lucide-react'
import { useAgenciaData } from '@/hooks/use-agencia-data'

export default function ServicosPage() {
  const {
    categorias,
    servicos,
    loading,
    createCategoria,
    createServico
  } = useAgenciaData()

  const [activeTab, setActiveTab] = useState('servicos')
  const [filterCategoria, setFilterCategoria] = useState('')

  const servicosFiltrados = filterCategoria 
    ? servicos.filter(s => s.categoria_id === filterCategoria)
    : servicos

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando serviços...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('servicos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'servicos'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="h-4 w-4" />
          Serviços
        </button>
        <button
          onClick={() => setActiveTab('categorias')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'categorias'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Categorias
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'servicos' && (
        <div className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Catálogo de Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {servicosFiltrados.map((servico) => (
                  <div key={servico.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{servico.nome}</h3>
                          <Badge variant="outline">{servico.tipo_cobranca}</Badge>
                        </div>
                        {servico.descricao && (
                          <p className="text-sm text-gray-600">{servico.descricao}</p>
                        )}
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600">
                            R$ {servico.valor_base.toFixed(2)}
                          </span>
                          {servico.unidade_cobranca && (
                            <span className="text-sm text-gray-600">
                              / {servico.unidade_cobranca}
                            </span>
                          )}
                          {servico.categoria_nome && (
                            <Badge variant="secondary">{servico.categoria_nome}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {servicosFiltrados.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum serviço encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'categorias' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Categorias de Serviços
              </CardTitle>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nova Categoria
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorias.map((categoria) => (
                <div key={categoria.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: categoria.cor }}
                    />
                    <div>
                      <h3 className="font-medium">{categoria.nome}</h3>
                      {categoria.descricao && (
                        <p className="text-sm text-gray-600">{categoria.descricao}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {categorias.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma categoria encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 