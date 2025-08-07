import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Negocio } from '@/lib/api'
import { NegocioDetalhesClient } from './negocio-detalhes-client'

interface NegocioDetalhesPageProps {
  params: Promise<{
    id: string
  }>
}

async function getNegocio(id: string): Promise<Negocio | null> {
  const supabase = createClient()
  
  const { data: negocio, error } = await supabase
    .from('negocios')
    .select(`
      *,
      cliente:clientes(
        id,
        nome_fant,
        razao_social,
        nome,
        tipo,
        email,
        telefone
      ),
      pipeline:pipelines(
        id,
        nome,
        cor
      ),
      etapa:pipeline_etapas(
        id,
        nome,
        ordem
      )
    `)
    .eq('id', id)
    .single()

  if (error || !negocio) {
    return null
  }

  return negocio
}

export default async function NegocioDetalhesPage({ params }: NegocioDetalhesPageProps) {
  const resolvedParams = await params
  const negocio = await getNegocio(resolvedParams.id)

  if (!negocio) {
    notFound()
  }

  return <NegocioDetalhesClient negocio={negocio} />
}
