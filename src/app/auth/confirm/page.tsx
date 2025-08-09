'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Verificar se há um token de confirmação na URL
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const type = urlParams.get('type')

        if (!token) {
          setStatus('error')
          setMessage('Token de confirmação não encontrado na URL.')
          return
        }

        if (type === 'signup') {
          // Confirmar email
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          })

          if (error) {
            console.error('Erro ao confirmar email:', error)
            setStatus('error')
            setMessage('Erro ao confirmar email. Tente novamente.')
          } else {
            setStatus('success')
            setMessage('Email confirmado com sucesso! Você pode fazer login agora.')
          }
        } else if (type === 'recovery') {
          // Reset de senha
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          })

          if (error) {
            console.error('Erro ao verificar token de recuperação:', error)
            setStatus('error')
            setMessage('Erro ao verificar token de recuperação. Tente novamente.')
          } else {
            setStatus('success')
            setMessage('Token verificado com sucesso! Você pode definir uma nova senha.')
          }
        } else {
          setStatus('error')
          setMessage('Tipo de confirmação inválido.')
        }
      } catch (error) {
        console.error('Erro inesperado:', error)
        setStatus('error')
        setMessage('Erro inesperado ao processar confirmação.')
      }
    }

    confirmEmail()
  }, [])

  const handleGoToLogin = () => {
    router.push('/auth/login')
  }

  const handleGoToResetPassword = () => {
    router.push('/auth/reset-password')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Confirmação de Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Processando sua confirmação
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {status === 'loading' && 'Processando...'}
              {status === 'success' && 'Confirmação Realizada'}
              {status === 'error' && 'Erro na Confirmação'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {status === 'loading' && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <p className="text-green-600">{message}</p>
                <Button onClick={handleGoToLogin} className="w-full">
                  Ir para Login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                <p className="text-red-600">{message}</p>
                <div className="space-y-2">
                  <Button onClick={handleGoToLogin} variant="outline" className="w-full">
                    Ir para Login
                  </Button>
                  <Button onClick={handleGoToResetPassword} variant="outline" className="w-full">
                    Recuperar Senha
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
