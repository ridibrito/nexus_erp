'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { useAppState } from '@/hooks/use-app-state'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { updateActivity, isInitialized } = useAppState()

  // Atualizar atividade quando o componente montar
  useEffect(() => {
    if (isInitialized) {
      updateActivity()
    }
  }, [isInitialized, updateActivity])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 