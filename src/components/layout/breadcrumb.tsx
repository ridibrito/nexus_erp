'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/clientes': 'Clientes',
  '/contratos': 'Contratos',
  '/projetos': 'Projetos',
  '/cobrancas': 'Cobranças',
  '/nfs-e': 'NFS-e',
  '/pagamentos': 'Pagamentos',
  '/despesas': 'Despesas',
  '/configuracoes': 'Configurações',
  '/relatorios': 'Relatórios',
  '/relatorios/vendas': 'Relatórios > Vendas',
  '/relatorios/financeiro': 'Relatórios > Financeiro',
  '/relatorios/projetos': 'Relatórios > Projetos',
}

// Mapeamento de grupos para melhor navegação
const groupMapping: Record<string, string> = {
  '/clientes': 'Gestão de Negócios',
  '/contratos': 'Gestão de Negócios',
  '/projetos': 'Gestão de Negócios',
  '/cobrancas': 'Financeiro',
  '/nfs-e': 'Financeiro',
  '/pagamentos': 'Financeiro',
  '/despesas': 'Financeiro',
}

export function Breadcrumb() {
  const pathname = usePathname()
  
  const getBreadcrumbItems = () => {
    const paths = pathname.split('/').filter(Boolean)
    const items = [{ name: 'Dashboard', href: '/', icon: Home }]
    
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      const routeName = routeNames[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
      const groupName = groupMapping[currentPath]
      
      // Adicionar grupo se existir
      if (groupName && !items.some(item => item.name === groupName)) {
        items.push({
          name: groupName,
          href: '#',
          icon: null,
          isGroup: true
        })
      }
      
      items.push({
        name: routeName,
        href: currentPath,
        icon: null
      })
    })
    
    return items
  }

  const breadcrumbItems = getBreadcrumbItems()

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.name}</span>
          ) : item.isGroup ? (
            <span className="text-gray-600 font-medium">{item.name}</span>
          ) : (
            <Link
              href={item.href}
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.name}</span>
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
} 