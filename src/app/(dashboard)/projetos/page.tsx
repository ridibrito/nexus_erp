'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  Filter,
  Calendar,
  DollarSign,
  User
} from 'lucide-react'
import { useAgenciaData } from '@/hooks/use-agencia-data'

export default function ProjetosPage() {
  const {
    projetos,
    loading
  } = useAgenciaData()

  const [filterStatus, setFilterStatus] = useState('')

  const projetosFiltrados = filterStatus 
    ? projetos.filter(p => p.status === filterStatus)
    : projetos

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      proposta: 'outline',
      aprovado: 'secondary',
      em_andamento: 'default',
      revisao: 'secondary',
      finalizado: 'default',
      cancelado: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">Todos os status</option>
              <option value="proposta">Proposta</option>
              <option value="aprovado">Aprovado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="revisao">Revisão</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Projetos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Projetos Pontuais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projetosFiltrados.map((projeto) => (
              <div key={projeto.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{projeto.titulo}</h3>
                      {getStatusBadge(projeto.status)}
                    </div>
                    <p className="text-sm text-gray-600">{projeto.cliente_nome}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          R$ {projeto.valor_total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${projeto.percentual_conclusao}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {projeto.percentual_conclusao}%
                        </span>
                      </div>
                      {projeto.responsavel_nome && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {projeto.responsavel_nome}
                          </span>
                        </div>
                      )}
                      {projeto.data_fim_prevista && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(projeto.data_fim_prevista).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
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
            {projetosFiltrados.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Nenhum projeto encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 