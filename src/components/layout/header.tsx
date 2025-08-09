'use client'

import { Bell, Search, User, Settings, LogOut, ChevronDown, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  
  // Mock data para e-mails não lidos (futuramente virá de um contexto)
  const unreadCount = 5

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Erro ao fazer logout')
    }
  }

  const handlePerfilClick = () => {
    router.push('/perfil')
  }

  const getUserName = () => {
    if (!user) return 'Usuário'
    
    // Tentar pegar o nome do metadata do usuário
    const name = user.user_metadata?.name
    if (name) return name
    
    // Se não tiver nome, usar o email
    return user.email?.split('@')[0] || 'Usuário'
  }

  const getUserEmail = () => {
    return user?.email || 'usuario@exemplo.com'
  }

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar..."
            className="pl-10 bg-gray-50 border-gray-200 rounded-md focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/email">
          <Button variant="ghost" size="icon" className="relative">
            <Mail className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
            3
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                {getUserAvatar() ? (
                  <img
                    src={getUserAvatar()}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">{getUserName()}</div>
                <div className="text-xs text-gray-500">{getUserEmail()}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handlePerfilClick}>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/configuracoes')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 