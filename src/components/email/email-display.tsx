'use client'

import { Button } from '@/components/ui/button'
import { EmailContent, getEmailContent } from '../../types/email'
import { useEffect, useState } from 'react'
import { Reply, Forward, Trash2, Download, Paperclip } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EmailDisplayProps {
  emailId: string | null
}

export function EmailDisplay({ emailId }: EmailDisplayProps) {
  const [email, setEmail] = useState<EmailContent | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!emailId) {
      setEmail(null)
      return
    }

    const loadEmail = async () => {
      setLoading(true)
      try {
        const emailData = await getEmailContent(emailId)
        setEmail(emailData)
      } catch (error) {
        console.error('Erro ao carregar e-mail:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEmail()
  }, [emailId])

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!emailId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">Selecione um e-mail</div>
          <div className="text-sm">Escolha um e-mail da lista para visualizar seu conteúdo</div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">Carregando...</div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">E-mail não encontrado</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{email.subject}</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Reply className="h-4 w-4 mr-2" />
              Responder
            </Button>
            <Button variant="ghost" size="sm">
              <Forward className="h-4 w-4 mr-2" />
              Encaminhar
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>De:</strong> {email.from}</div>
          <div><strong>Para:</strong> {email.to}</div>
          <div><strong>Data:</strong> {formatDate(email.date)}</div>
        </div>
      </div>

      {/* Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <Paperclip className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Anexos</span>
          </div>
          <div className="space-y-2">
            {email.attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{attachment.name}</span>
                  <span className="text-xs text-gray-500">({formatFileSize(attachment.size)})</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
        />
      </div>
    </div>
  )
}
