import { listarClientes } from '@/lib/api/clientes'
import { ClientesClient } from './clientes-client'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default async function ClientesPage() {
  // Buscar dados no servidor
  const result = await listarClientes()
  const clientes = result.success ? result.data : []
  
  return (
    <ProtectedRoute>
      <ClientesClient initialData={clientes} />
    </ProtectedRoute>
  )
} 