import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Cliente } from '@/lib/api'
import { ClienteDetalhesClient } from './cliente-detalhes-client'

interface ClienteDetalhesPageProps {
  params: Promise<{
    id: string
  }>
}

async function getCliente(id: string): Promise<Cliente | null> {
  const supabase = createClient()
  
  const { data: cliente, error } = await supabase
    .from('clientes')
    .select(`
      *,
      empresa_vinculada:clientes!empresa_vinculada_id(
        id,
        nome_fant,
        razao_social,
        cnpj,
        email,
        telefone
      )
    `)
    .eq('id', id)
    .single()

  if (error || !cliente) {
    return null
  }

  return cliente
}

export default async function ClienteDetalhesPage({ params }: ClienteDetalhesPageProps) {
  const resolvedParams = await params
  const cliente = await getCliente(resolvedParams.id)

  if (!cliente) {
    notFound()
  }

  return <ClienteDetalhesClient cliente={cliente} />
}
