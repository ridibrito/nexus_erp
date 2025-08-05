'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientes, usePipelines } from '@/hooks/use-api'
import { type Negocio } from '@/lib/api'

interface NovoNegocioModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (negocio: Omit<Negocio, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>) => Promise<void>
}

export function NovoNegocioModal({ open, onOpenChange, onSubmit }: NovoNegocioModalProps) {
  const { clientes } = useClientes()
  const { pipelines } = usePipelines()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cliente_id: '',
    pipeline_id: '',
    etapa_id: '',
    valor: '',
    probabilidade: '50',
    prioridade: 'media',
    responsavel_id: '',
    proximo_contato: '',
    data_fechamento: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        titulo: formData.titulo,
        descricao: formData.descricao || undefined,
        cliente_id: formData.cliente_id,
        pipeline_id: formData.pipeline_id,
        etapa_id: formData.etapa_id,
        valor: parseFloat(formData.valor) || 0,
        probabilidade: parseInt(formData.probabilidade) || 50,
        prioridade: formData.prioridade as 'baixa' | 'media' | 'alta',
        responsavel_id: formData.responsavel_id || undefined,
        proximo_contato: formData.proximo_contato || undefined,
        data_fechamento: formData.data_fechamento || undefined,
        status: 'ativo'
      })

      // Reset form
      setFormData({
        titulo: '',
        descricao: '',
        cliente_id: '',
        pipeline_id: '',
        etapa_id: '',
        valor: '',
        probabilidade: '50',
        prioridade: 'media',
        responsavel_id: '',
        proximo_contato: '',
        data_fechamento: ''
      })

      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao criar negócio:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePipelineChange = (pipelineId: string) => {
    setFormData(prev => ({
      ...prev,
      pipeline_id: pipelineId,
      etapa_id: '' // Reset etapa when pipeline changes
    }))
  }

  const getEtapasPipeline = (pipelineId: string) => {
    const pipeline = pipelines.find(p => p.id === pipelineId)
    if (!pipeline) return []
    
    // For now, we'll use mock stages. In a real app, you'd fetch stages from the API
    return [
      { id: 'prospeccao', nome: 'Prospecção' },
      { id: 'qualificacao', nome: 'Qualificação' },
      { id: 'contato', nome: 'Contato Realizado' },
      { id: 'demo', nome: 'Demo Agendada' },
      { id: 'proposta', nome: 'Proposta Enviada' },
      { id: 'negociacao', nome: 'Negociação' },
      { id: 'fechado', nome: 'Fechado' }
    ]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Negócio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ex: Site E-commerce - Cliente ABC"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome_fantasia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o negócio..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline">Pipeline *</Label>
              <Select
                value={formData.pipeline_id}
                onValueChange={handlePipelineChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um pipeline" />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="etapa">Etapa *</Label>
              <Select
                value={formData.etapa_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, etapa_id: value }))}
                required
                disabled={!formData.pipeline_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma etapa" />
                </SelectTrigger>
                <SelectContent>
                  {formData.pipeline_id && getEtapasPipeline(formData.pipeline_id).map((etapa) => (
                    <SelectItem key={etapa.id} value={etapa.id}>
                      {etapa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$) *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="probabilidade">Probabilidade (%)</Label>
              <Select
                value={formData.probabilidade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, probabilidade: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={formData.prioridade}
                onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={formData.responsavel_id}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel_id: e.target.value }))}
                placeholder="Nome do responsável"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="proximo_contato">Próximo Contato</Label>
              <Input
                id="proximo_contato"
                type="date"
                value={formData.proximo_contato}
                onChange={(e) => setFormData(prev => ({ ...prev, proximo_contato: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_fechamento">Data de Fechamento</Label>
              <Input
                id="data_fechamento"
                type="date"
                value={formData.data_fechamento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_fechamento: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Negócio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 