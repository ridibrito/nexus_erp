import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('🔍 Middleware - Rota:', req.nextUrl.pathname)
  console.log('🔍 Middleware - Sessão:', session ? 'Autenticado' : 'Não autenticado')
  console.log('🔍 Middleware - Cookies:', req.cookies.getAll().map(c => c.name))
  console.log('🔍 Middleware - Session User:', session?.user?.email)

  // Rotas que requerem autenticação (dentro do dashboard)
  const protectedRoutes = [
    '/', 
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
  
  // Verificar se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => {
    // Verificar se é exatamente a rota ou se começa com a rota + '/'
    const isProtected = req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
    if (isProtected) {
      console.log('🔒 Rota protegida detectada:', req.nextUrl.pathname, 'para rota:', route)
    }
    return isProtected
  })
  
  console.log('🔍 Middleware - Rota protegida:', isProtectedRoute)
  console.log('🔍 Middleware - Pathname:', req.nextUrl.pathname)

  // Rotas que requerem admin (configurações)
  const adminRoutes = ['/configuracoes']
  const isAdminRoute = adminRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  // Rotas de autenticação
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password']
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  // Rotas públicas (não requerem autenticação)
  const publicRoutes = ['/debug', '/test-auth']
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  // Se não está autenticado e tentando acessar rota protegida
  if (!session && isProtectedRoute) {
    console.log('🚫 Acesso negado - Redirecionando para login')
    const redirectUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se está autenticado e tentando acessar rota de auth
  if (session && isAuthRoute) {
    console.log('✅ Usuário autenticado tentando acessar auth, redirecionando para dashboard')
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se está autenticado mas tentando acessar rota de admin
  if (session && isAdminRoute) {
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
        const redirectUrl = new URL('/', req.url)
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Erro ao verificar permissões de admin:', error)
      // Em caso de erro, permitir acesso temporariamente
      console.log('Permitindo acesso temporário devido a erro na verificação')
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 