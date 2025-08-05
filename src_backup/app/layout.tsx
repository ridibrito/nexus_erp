import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP Nexus - Gestão Financeira e Automação Fiscal',
  description: 'Sistema de gestão financeira e automação fiscal para prestadores de serviço brasileiros',
  keywords: 'ERP, gestão financeira, automação fiscal, NFS-e, cobranças',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
} 