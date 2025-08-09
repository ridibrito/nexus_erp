import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas protegidas que requerem autenticação
const PROTECTED = [
  '/dashboard', 
  '/cobrancas', 
  '/clientes', 
  '/perfil', 
  '/pessoas', 
  '/negocios', 
  '/configuracoes', 
  '/relatorios', 
  '/contas-receber', 
  '/contas-pagar', 
  '/movimentacoes-bancarias', 
  '/projetos', 
  '/contratos', 
  '/servicos', 
  '/nfs-e', 
  '/despesas',
  '/email'
]

export async function middleware(req: NextRequest) {
  // MIDDLEWARE COMPLETAMENTE DESABILITADO - usando AuthGuard no lado do cliente
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
}
