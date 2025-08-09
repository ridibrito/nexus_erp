import { buscarCliente } from '@/lib/api/clientes'
import { notFound } from 'next/navigation'
import { ClienteDetalhes } from './cliente-detalhes'
import { ProtectedRoute } from '@/components/auth/protected-route'

interface ClientePageProps {
  params: {
    id: string
  }
}

export default async function ClientePage({ params }: ClientePageProps) {
  const result = await buscarCliente(params.id)
  
  if (!result.success) {
    notFound()
  }

  return (
    <ProtectedRoute>
      <ClienteDetalhes cliente={result.data} />
    </ProtectedRoute>
  )
}
