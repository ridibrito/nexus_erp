'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, CreditCard, FileText, Upload, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const certificadoSchema = z.object({
  senha: z.string().min(1, 'Senha é obrigatória'),
})

type CertificadoFormData = z.infer<typeof certificadoSchema>

export default function ConfiguracoesIntegracoesPage() {
  const [stripeConnected, setStripeConnected] = useState(false)
  const [certificadoUploaded, setCertificadoUploaded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificadoFormData>({
    resolver: zodResolver(certificadoSchema),
  })

  const handleStripeConnect = async () => {
    try {
      // TODO: Implementar OAuth 2.0 do Stripe
      const authUrl = `https://connect.stripe.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&response_type=code&scope=read_write&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URI!)}`
      window.location.href = authUrl
    } catch (error) {
      toast.error('Erro ao conectar com Stripe')
      console.error(error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.pfx')) {
      setSelectedFile(file)
    } else {
      toast.error('Por favor, selecione um arquivo .pfx válido')
    }
  }

  const handleCertificadoUpload = async (data: CertificadoFormData) => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo')
      return
    }

    setIsUploading(true)
    try {
      // TODO: Implementar upload para Supabase Storage
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('senha', data.senha)

      // Simular upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCertificadoUploaded(true)
      toast.success('Certificado digital enviado com sucesso!')
    } catch (error) {
      toast.error('Erro ao enviar certificado digital')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/configuracoes" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Configurações
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground mt-2">
            Configure as integrações necessárias para automatizar seu fluxo financeiro
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Stripe Integration */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-highlight" />
                  <div>
                    <CardTitle>Gateway de Pagamento (Stripe)</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Conecte sua conta Stripe para gerar cobranças automaticamente
                    </p>
                  </div>
                </div>
                {stripeConnected ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Conectado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Não conectado</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Benefícios da integração:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Geração automática de cobranças</li>
                    <li>• Links de pagamento seguros</li>
                    <li>• Notificações automáticas de pagamento</li>
                    <li>• Conciliação automática</li>
                  </ul>
                </div>
                
                <Button 
                  onClick={handleStripeConnect}
                  disabled={stripeConnected}
                  className="w-full md:w-auto"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {stripeConnected ? 'Conectado' : 'Conectar com Stripe'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Certificado Digital */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-highlight" />
                  <div>
                    <CardTitle>Certificado Digital A1</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Faça upload do seu certificado digital para emissão de NFS-e
                    </p>
                  </div>
                </div>
                {certificadoUploaded ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Enviado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <XCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Não enviado</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleCertificadoUpload)} className="space-y-4">
                <div>
                  <label htmlFor="certificado" className="block text-sm font-medium mb-2">
                    Arquivo do Certificado (.pfx)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="certificado"
                      type="file"
                      accept=".pfx"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                    {selectedFile && (
                      <span className="text-sm text-muted-foreground">
                        {selectedFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="senha" className="block text-sm font-medium mb-2">
                    Senha do Certificado *
                  </label>
                  <Input
                    id="senha"
                    type="password"
                    {...register('senha')}
                    placeholder="Digite a senha do certificado"
                    className={errors.senha ? 'border-destructive' : ''}
                  />
                  {errors.senha && (
                    <p className="text-sm text-destructive mt-1">{errors.senha.message}</p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Informações importantes:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• O certificado deve estar válido</li>
                    <li>• O arquivo será armazenado de forma segura</li>
                    <li>• A senha será criptografada</li>
                    <li>• Apenas você terá acesso aos dados</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  disabled={!selectedFile || isUploading || certificadoUploaded}
                  className="w-full md:w-auto"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Enviando...' : 'Enviar Certificado'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Status das Integrações */}
          <Card>
            <CardHeader>
              <CardTitle>Status das Integrações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Dados da Empresa</span>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">Configurado</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Gateway de Pagamento</span>
                  {stripeConnected ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Conectado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Não conectado</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="font-medium">Certificado Digital</span>
                  {certificadoUploaded ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Enviado</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Não enviado</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 