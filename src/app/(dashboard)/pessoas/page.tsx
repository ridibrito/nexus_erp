import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function PessoasPage() {
  return (
    <ProtectedRoute>
      <PessoasContent />
    </ProtectedRoute>
  )
}

function PessoasContent() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <Link href="/pessoas/novo">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Pessoa
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Gerencie suas pessoas aqui. Você pode criar pessoas e relacioná-las opcionalmente a empresas.
        </p>
        
        <div className="mt-6">
          <Link href="/pessoas/novo">
            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira pessoa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
