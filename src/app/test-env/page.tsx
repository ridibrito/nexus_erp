export default function TestEnvPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Variáveis de Ambiente</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Variáveis Públicas:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Definida' : 'Não definida'}</p>
            <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida'}</p>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Teste de Importação:</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p>Verificando se as importações funcionam...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
