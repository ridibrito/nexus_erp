'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2,
  Users,
  Target,
  Settings,
  Mail,
  Database,
  DollarSign,
  FileText,
  CreditCard,
  Calendar,
  Tag,
  BarChart3
} from 'lucide-react'

// Estrutura do sidebar interno de configurações
const configSections = [
  {
    id: 'empresa',
    name: 'Empresa',
    icon: Building2,
    items: [
      { id: 'dados-empresa', name: 'Dados da Empresa' },
      { id: 'enderecos', name: 'Endereços' },
      { id: 'contatos', name: 'Contatos' },
      { id: 'documentos', name: 'Documentos' },
    ]
  },
  {
    id: 'usuarios',
    name: 'Usuários',
    icon: Users,
    items: [
      { id: 'usuarios-ativos', name: 'Usuários Ativos' },
      { id: 'convites', name: 'Convites Pendentes' },
      { id: 'permissoes', name: 'Permissões' },
      { id: 'perfis', name: 'Perfis' },
    ]
  },
  {
    id: 'cadastros',
    name: 'Cadastros',
    icon: Target,
    items: [
      { id: 'categorias-servicos', name: 'Categorias de Serviços' },
      { id: 'servicos', name: 'Serviços' },
      { id: 'modelos-contrato', name: 'Modelos de Contrato' },
      { id: 'templates-projeto', name: 'Templates de Projeto' },
      { id: 'centros-custo', name: 'Centros de Custo' },
      { id: 'categorias-despesa', name: 'Categorias de Despesa' },
      { id: 'formas-pagamento', name: 'Formas de Pagamento' },
      { id: 'condicoes-pagamento', name: 'Condições de Pagamento' },
    ]
  },
  {
    id: 'financeiro',
    name: 'Financeiro',
    icon: DollarSign,
    items: [
      { id: 'nfs-e', name: 'NFS-e' },
      { id: 'contas-bancarias', name: 'Contas Bancárias' },
      { id: 'fornecedores', name: 'Fornecedores' },
      { id: 'centros-custo', name: 'Centros de Custo' },
      { id: 'categorias-financeiras', name: 'Categorias Financeiras' },
      { id: 'formas-pagamento', name: 'Formas de Pagamento' },
      { id: 'condicoes-pagamento', name: 'Condições de Pagamento' },
      { id: 'configuracoes-fiscais', name: 'Configurações Fiscais' },
    ]
  },
  {
    id: 'comunicacao',
    name: 'Comunicação',
    icon: Mail,
    items: [
      { id: 'modelos-email', name: 'Modelos de Email' },
      { id: 'notificacoes', name: 'Notificações' },
      { id: 'integracoes', name: 'Integrações' },
      { id: 'webhooks', name: 'Webhooks' },
    ]
  },
  {
    id: 'sistema',
    name: 'Sistema',
    icon: Settings,
    items: [
      { id: 'aparencia', name: 'Aparência' },
      { id: 'seguranca', name: 'Segurança' },
      { id: 'backup', name: 'Backup' },
      { id: 'logs', name: 'Logs' },
    ]
  }
]

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<string>('empresa')
  const [activeTab, setActiveTab] = useState<string>('dados-empresa')

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    const section = configSections.find(s => s.id === sectionId)
    if (section && section.items.length > 0) {
      setActiveTab(section.items[0].id)
    }
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  const activeSectionData = configSections.find(s => s.id === activeSection)

  return (
    <div className="flex h-full">
      {/* Sidebar Interno */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h2>
          <p className="text-sm text-gray-600">Gerencie os dados do sistema</p>
        </div>

        <nav className="space-y-2">
          {configSections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={cn(
                'flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <section.icon className="h-4 w-4 mr-3" />
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Conteúdo Principal com Tabs */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeSectionData && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{activeSectionData.name}</h1>
                <p className="text-gray-600 mt-2">Configure as opções de {activeSectionData.name.toLowerCase()}</p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  {activeSectionData.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={cn(
                        'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === item.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Conteúdo da Tab Ativa */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{activeSectionData.items.find(item => item.id === activeTab)?.name}</h2>
                
                {/* Conteúdo específico baseado na seção e tab ativa */}
                {activeSection === 'empresa' && activeTab === 'dados-empresa' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Formulário para dados da empresa será implementado aqui.</p>
                  </div>
                )}
                
                {activeSection === 'financeiro' && activeTab === 'nfs-e' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Configurações da NFS-e serão implementadas aqui.</p>
                  </div>
                )}

                {/* Conteúdo padrão para outras tabs */}
                {!((activeSection === 'empresa' && activeTab === 'dados-empresa') || 
                   (activeSection === 'financeiro' && activeTab === 'nfs-e')) && (
                  <div className="space-y-4">
                    <p className="text-gray-600">Conteúdo para {activeSectionData.items.find(item => item.id === activeTab)?.name} será implementado aqui.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 