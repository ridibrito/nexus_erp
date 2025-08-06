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
  Plus,
  UserPlus,
  DollarSign,
  Target,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Building2,
  FolderOpen,
  Folder,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useState } from 'react'
import { NovaCobrancaModal } from '@/components/modals/nova-cobranca-modal'
import { NovoClienteModal } from '@/components/modals/novo-cliente-modal'
import { NovaDespesaModal } from '@/components/modals/nova-despesa-modal'
import { useEffect } from 'react'
import { useAdmin } from '@/hooks/use-admin'

// Estrutura de navegação seguindo a jornada lógica do usuário
const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    type: 'single'
  },
  {
    name: 'Gestão de Negócios',
    icon: Building2,
    type: 'group',
    items: [
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Negócios', href: '/negocios', icon: Target },
      { name: 'Contratos', href: '/contratos', icon: FileText },
      { name: 'Projetos', href: '/projetos', icon: Briefcase },
    ]
  },
  {
    name: 'Financeiro',
    icon: DollarSign,
    type: 'group',
    items: [
      { name: 'Contas a Pagar', href: '/contas-pagar', icon: TrendingDown },
      { name: 'Contas a Receber', href: '/contas-receber', icon: TrendingUp },
      { name: 'Movimentações Bancárias', href: '/movimentacoes-bancarias', icon: BarChart3 },
    ]
  },
  {
    name: 'Relatórios',
    icon: BarChart3,
    type: 'group',
    items: [
      { name: 'DRE', href: '/relatorios/dre', icon: BarChart3 },
      { name: 'Fluxo de Caixa', href: '/relatorios/fluxo-caixa', icon: DollarSign },
      { name: 'Vendas por Serviço', href: '/relatorios/vendas-servicos', icon: Target },
      { name: 'Lucratividade por Projeto', href: '/relatorios/lucratividade-projetos', icon: Briefcase },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const { isAdmin, loading } = useAdmin()
  const [showNovaCobranca, setShowNovaCobranca] = useState(false)
  const [showNovoCliente, setShowNovoCliente] = useState(false)
  const [showNovaDespesa, setShowNovaDespesa] = useState(false)
  
  // Todos os menus ficam fechados por padrão
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])

  // Efeito para controlar o estado dos menus baseado na rota
  useEffect(() => {
    // Fecha todos os menus em todas as páginas por padrão
    setExpandedMenus([])
  }, [pathname])

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? [] // Fecha o menu se já estiver aberto
        : [menuName] // Abre apenas este menu, fechando os outros
    )
  }

  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName)

  const isActive = (href: string) => pathname === href

  const isAnyChildActive = (items: any[]) => {
    return items.some(item => isActive(item.href))
  }

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white">
      {/* Logo Simples */}
      <div className="flex items-center h-16 px-6 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-semibold text-lg text-white">Nexus ERP</span>
        </div>
      </div>

      {/* Menu de Acesso Rápido */}
      <div className="px-4 py-4 border-b border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setShowNovoCliente(true)}
            className="flex items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
            title="Novo Cliente"
          >
            <UserPlus className="h-5 w-5 text-green-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Novo Cliente
            </span>
          </button>
          <button
            onClick={() => setShowNovaCobranca(true)}
            className="flex items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
            title="Nova Conta a Receber"
          >
            <Plus className="h-5 w-5 text-blue-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Nova Conta a Receber
            </span>
          </button>
          <button
            onClick={() => setShowNovaDespesa(true)}
            className="flex items-center justify-center p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group relative"
            title="Nova Conta a Pagar"
          >
            <DollarSign className="h-5 w-5 text-red-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              Nova Conta a Pagar
            </span>
          </button>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (item.type === 'single') {
            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href || '')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          }

          if (item.type === 'group' && item.items) {
            const hasActiveChild = isAnyChildActive(item.items)
            const isExpanded = isMenuExpanded(item.name)

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    hasActiveChild
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                          isActive(subItem.href)
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700'
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return null
        })}
      </nav>

      {/* Configurações - Apenas para Admins */}
      {!loading && isAdmin && (
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/configuracoes"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === '/configuracoes' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </div>
      )}

      {/* Modais */}
      <NovaCobrancaModal 
        isOpen={showNovaCobranca} 
        onClose={() => setShowNovaCobranca(false)} 
      />
      <NovoClienteModal 
        isOpen={showNovoCliente} 
        onClose={() => setShowNovoCliente(false)} 
      />
      <NovaDespesaModal 
        isOpen={showNovaDespesa} 
        onClose={() => setShowNovaDespesa(false)} 
      />
    </div>
  )
} 