import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.log('🔍 Middleware - Iniciando para rota:', req.nextUrl.pathname)
  
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

  console.log('🔍 Middleware - Sessão encontrada:', !!session)
  console.log('🔍 Middleware - User email:', session?.user?.email)

  // Rotas que requerem autenticação
  const protectedRoutes = ['/', '/dashboard', '/clientes', '/perfil']
  
  // Verificar se a rota atual requer autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route + '/')
  )

  console.log('🔍 Middleware - É rota protegida:', isProtectedRoute)

  // Se não está autenticado e tentando acessar rota protegida
  if (!session && isProtectedRoute) {
    console.log('🚫 Acesso negado - Redirecionando para login')
    const redirectUrl = new URL('/auth/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Se está autenticado e tentando acessar rota de auth
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/')
  if (session && isAuthRoute) {
    console.log('✅ Usuário autenticado tentando acessar auth, redirecionando para dashboard')
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  console.log('✅ Middleware - Permitindo acesso')
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
