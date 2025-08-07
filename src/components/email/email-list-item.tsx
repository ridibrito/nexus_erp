'use client'

import { Email } from '../../types/email'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onSelect: () => void
}

export function EmailListItem({ email, isSelected, onSelect }: EmailListItemProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  return (
    <div
      onClick={onSelect}
      className={`p-4 cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 border-l-4 border-blue-500'
          : email.isRead
          ? 'bg-white hover:bg-gray-50'
          : 'bg-blue-50/50 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span
              className={`font-medium truncate ${
                email.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
              }`}
            >
              {email.from}
            </span>
            {!email.isRead && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
            )}
          </div>
          <div className="mb-1">
            <span
              className={`text-sm truncate block ${
                email.isRead ? 'text-gray-700' : 'text-gray-900 font-semibold'
              }`}
            >
              {email.subject}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate">
            {email.preview}
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {formatDate(email.date)}
          </span>
        </div>
      </div>
    </div>
  )
}
