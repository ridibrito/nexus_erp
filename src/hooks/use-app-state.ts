'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface AppState {
  isInitialized: boolean
  currentPage: string
  lastActivity: number
  isIdle: boolean
}

export function useAppState() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState>({
    isInitialized: false,
    currentPage: '/',
    lastActivity: Date.now(),
    isIdle: false
  })

  // Função para atualizar a atividade do usuário
  const updateActivity = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      lastActivity: Date.now(),
      isIdle: false
    }))
  }, [])

  // Função para navegar sem recarregar a página
  const navigateTo = useCallback((path: string) => {
    if (appState.currentPage !== path) {
      setAppState(prev => ({
        ...prev,
        currentPage: path
      }))
      router.push(path)
    }
  }, [router, appState.currentPage])

  // Efeito para detectar atividade do usuário
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      updateActivity()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Timer para detectar inatividade (5 minutos)
    const idleTimer = setInterval(() => {
      const now = Date.now()
      const timeSinceLastActivity = now - appState.lastActivity
      
      if (timeSinceLastActivity > 5 * 60 * 1000) { // 5 minutos
        setAppState(prev => ({
          ...prev,
          isIdle: true
        }))
      }
    }, 60000) // Verificar a cada minuto

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(idleTimer)
    }
  }, [appState.lastActivity, updateActivity])

  // Efeito para inicializar o estado da aplicação
  useEffect(() => {
    if (!appState.isInitialized) {
      setAppState(prev => ({
        ...prev,
        isInitialized: true,
        currentPage: window.location.pathname
      }))
    }
  }, [appState.isInitialized])

  return {
    appState,
    updateActivity,
    navigateTo,
    isInitialized: appState.isInitialized,
    isIdle: appState.isIdle
  }
}
