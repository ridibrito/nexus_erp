'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RefreshCw, Search } from 'lucide-react'
import { Email, getEmailsInFolder } from '../../types/email'
import { useEffect, useState } from 'react'
import { EmailListItem } from './email-list-item'

interface EmailListProps {
  folder: string
  onEmailSelect: (emailId: string) => void
  selectedEmailId: string | null
}

export function EmailList({ folder, onEmailSelect, selectedEmailId }: EmailListProps) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true)
      try {
        const emailsData = await getEmailsInFolder(folder)
        setEmails(emailsData)
      } catch (error) {
        console.error('Erro ao carregar e-mails:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEmails()
  }, [folder])

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const emailsData = await getEmailsInFolder(folder)
      setEmails(emailsData)
    } catch (error) {
      console.error('Erro ao atualizar e-mails:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar e-mails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Carregando...</div>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">
              {searchTerm ? 'Nenhum e-mail encontrado' : 'Nenhum e-mail nesta pasta'}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmailId === email.id}
                onSelect={() => onEmailSelect(email.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
