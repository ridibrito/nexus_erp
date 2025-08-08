'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestAuthPage() {
  const [email, setEmail] = useState('ricardo@coruss.com.br')
  const [password, setPassword] = useState('123456')
  const [result, setResult] = useState<any>(null)

  const testLogin = async () => {
    try {
      console.log('🧪 Testando login...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 Resultado do teste:', { data, error })
      setResult({ data, error })

      if (data.session) {
        console.log('✅ Sessão criada:', data.session)
      }
    } catch (error) {
      console.error('❌ Erro no teste:', error)
      setResult({ error })
    }
  }

  const testSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('🔍 Sessão atual:', { session, error })
      setResult({ session, error })
    } catch (error) {
      console.error('❌ Erro ao verificar sessão:', error)
      setResult({ error })
    }
  }

  const testSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      console.log('🚪 Logout:', { error })
      setResult({ error })
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      setResult({ error })
    }
  }

  const testSignUp = async () => {
    try {
      console.log('🧪 Testando registro...')
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Usuário Teste'
          }
        }
      })

      console.log('📊 Resultado do registro:', { data, error })
      setResult({ data, error })

      if (data.user) {
        console.log('✅ Usuário criado:', data.user)
      }
    } catch (error) {
      console.error('❌ Erro no registro:', error)
      setResult({ error })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Teste de Autenticação</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

                     <div className="space-y-2">
             <Button onClick={testSignUp} className="w-full">
               Testar Registro
             </Button>
             <Button onClick={testLogin} variant="outline" className="w-full">
               Testar Login
             </Button>
             <Button onClick={testSession} variant="outline" className="w-full">
               Verificar Sessão
             </Button>
             <Button onClick={testSignOut} variant="destructive" className="w-full">
               Logout
             </Button>
           </div>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-bold mb-2">Resultado:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
