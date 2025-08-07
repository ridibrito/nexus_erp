'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface EditarEtapasModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pipeline: any
  etapas: any[]
  onEtapasUpdated: () => void
}

export function EditarEtapasModal({ open, onOpenChange, pipeline, etapas, onEtapasUpdated }: EditarEtapasModalProps) {
  const [etapasData, setEtapasData] = useState<any[]>([])
  const [saving, setSaving] = useState(false)

  // Carregar etapas quando o modal abrir
  useEffect(() => {
    if (open && etapas) {
      setEtapasData([...etapas])
    }
  }, [open, etapas])

  const salvarEtapas = async () => {
    try {
      setSaving(true)
      
      if (!pipeline) return

      // Deletar etapas existentes
      await supabase
        .from('pipeline_etapas')
        .delete()
        .eq('pipeline_id', pipeline.id)

      // Criar novas etapas
      for (const etapa of etapasData) {
        await supabase
          .from('pipeline_etapas')
          .insert({
            pipeline_id: pipeline.id,
            empresa_id: pipeline.empresa_id,
            nome: etapa.nome,
            ordem: etapa.ordem,
            cor: etapa.cor,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }

      toast.success('Etapas salvas com sucesso!')
      onEtapasUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar etapas:', error)
      toast.error('Erro ao salvar etapas')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          Etapas do Pipeline: {pipeline?.nome}
        </h3>
        
        <div className="space-y-4">
          {etapasData.map((etapa, index) => (
            <div key={etapa.id || index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <Input 
                  placeholder="Nome da etapa"
                  value={etapa.nome}
                  onChange={(e) => {
                    const newEtapas = [...etapasData]
                    newEtapas[index].nome = e.target.value
                    setEtapasData(newEtapas)
                  }}
                />
              </div>
              <div className="w-20">
                <Input 
                  type="number"
                  placeholder="Ordem"
                  value={etapa.ordem}
                  onChange={(e) => {
                    const newEtapas = [...etapasData]
                    newEtapas[index].ordem = parseInt(e.target.value) || 1
                    setEtapasData(newEtapas)
                  }}
                />
              </div>
              <div className="w-20">
                <Input 
                  type="color"
                  value={etapa.cor}
                  onChange={(e) => {
                    const newEtapas = [...etapasData]
                    newEtapas[index].cor = e.target.value
                    setEtapasData(newEtapas)
                  }}
                  className="h-10"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newEtapas = etapasData.filter((_, i) => i !== index)
                  setEtapasData(newEtapas)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={() => {
              const novaEtapa = {
                id: `temp-${Date.now()}`,
                nome: 'Nova Etapa',
                ordem: etapasData.length + 1,
                cor: '#6B7280',
                pipeline_id: pipeline?.id
              }
              setEtapasData([...etapasData, novaEtapa])
            }}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Etapa
          </Button>
        </div>
        
        <div className="flex gap-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button 
            className="flex-1"
            onClick={salvarEtapas}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Etapas'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
