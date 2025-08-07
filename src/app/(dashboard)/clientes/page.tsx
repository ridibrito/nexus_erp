import { clientesAPI } from '@/lib/api'
import { ClientesClient } from './clientes-client'

export default async function ClientesPage() {
  // Buscar dados no servidor
  const clientes = await clientesAPI.listar()
  
  return <ClientesClient initialData={clientes} />
} 