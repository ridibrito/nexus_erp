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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      } as any,
    }
  )

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

  // Debug: verificar cookies
  const cookieNames = req.cookies.getAll().map(c => c.name)
  console.log('🔍 Middleware - Cookies:', cookieNames)
  
  // Verificar cookies específicos do Supabase
  const supabaseCookies = req.cookies.getAll().filter(c => c.name.includes('sb-'))
  console.log('🔍 Middleware - Supabase Cookies:', supabaseCookies.map(c => c.name))
  
  // Obter sessão
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('🔍 Middleware - Sessão:', session ? 'Autenticado' : 'Não autenticado')
  console.log('🔍 Middleware - Session User:', session?.user?.email)
  console.log('🔍 Middleware - Session User ID:', session?.user?.id)

  // Se não está autenticado e tentando acessar rota protegida
  if (!session?.user && isProtected) {
    console.log('🚫 Acesso negado - Redirecionando para login')
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', path)
    return NextResponse.redirect(url)
  }

  // Se está autenticado e tentando acessar rota de auth
  if (session?.user && isAuthRoute) {
    console.log('✅ Usuário autenticado tentando acessar auth, redirecionando para dashboard')
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Se está autenticado mas tentando acessar rota de admin
  if (session?.user && path.startsWith('/configuracoes')) {
    try {
      // Verificar se o usuário é admin
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('cargo')
        .eq('auth_user_id', session.user.id)
        .eq('is_active', true)
        .single()

      // Se não é admin, redirecionar para dashboard
      if (!usuario || usuario.cargo !== 'Administrador') {
        const url = req.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error('Erro ao verificar permissões de admin:', error)
      // Em caso de erro, permitir acesso temporariamente
      console.log('Permitindo acesso temporário devido a erro na verificação')
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|map)$).*)',
  ],
}
