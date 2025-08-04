'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Receipt,
  Users,
  FileText,
  Calculator,
  Settings,
  BarChart3,
  CreditCard,
  Building2,
  HelpCircle,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Calendar,
  Shield,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Cobranças', href: '/cobrancas', icon: Receipt },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'NFS-e', href: '/nfs-e', icon: FileText },
  { name: 'Despesas', href: '/despesas', icon: Calculator },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Pagamentos', href: '/pagamentos', icon: CreditCard },
  { name: 'Empresa', href: '/configuracoes/empresa', icon: Building2 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      <div className="flex items-center h-16 px-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-lg text-white">Nexus ERP</span>
        </div>
      </div>
      <div className="px-4 py-4 border-b border-gray-700">
        <Button variant="ghost" className="w-full justify-between text-gray-300 hover:text-white hover:bg-gray-700">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span className="text-sm">Empresa Atual</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'sidebar-item',
                isActive
                  ? 'sidebar-item-active'
                  : 'sidebar-item-inactive'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link
          href="/perfil"
          className={cn(
            'sidebar-item',
            pathname === '/perfil' ? 'sidebar-item-active' : 'sidebar-item-inactive'
          )}
        >
          <User className="h-4 w-4" />
          <span>Meu Perfil</span>
        </Link>
        <Link
          href="/ajuda"
          className="sidebar-item sidebar-item-inactive"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Ajuda</span>
        </Link>
      </div>
    </div>
  )
} 