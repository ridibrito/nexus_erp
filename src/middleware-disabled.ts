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
  let res = NextResponse.next()

  const path = req.nextUrl.pathname
  
  // Ignorar rotas do DevTools e outras rotas técnicas
  if (path.includes('.well-known') || path.includes('devtools') || path.includes('chrome')) {
    return res
  }
  
  // Permitir rotas de teste
  if (path.startsWith('/test-')) {
    return res
  }
  
  const isAuthRoute = path.startsWith('/auth')
  const isProtected = PROTECTED.some(p => path === p || path.startsWith(p + '/'))

  console.log('🔍 Middleware - Rota:', path)
  console.log('🔍 Middleware - Auth Route:', isAuthRoute)
  console.log('🔍 Middleware - Protected:', isProtected)

  // TEMPORÁRIO: Permitir acesso a todas as rotas
  console.log('⚠️ Middleware temporariamente desabilitado - permitindo acesso')
  
  // TODO: Reativar quando resolver o problema de sessão
  // const supabase = createServerClient(...)
  // const { data: { session } } = await supabase.auth.getSession()
  // if (!session?.user && isProtected) { ... }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
}
