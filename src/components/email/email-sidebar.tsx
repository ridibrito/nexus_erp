'use client'

import { Button } from '@/components/ui/button'
import { PenSquare, Inbox, Send, FileText, Trash } from 'lucide-react'
import { EmailFolder, getEmailFolders } from '../../types/email'
import { useEffect, useState } from 'react'

interface EmailSidebarProps {
  selectedFolder: string
  onFolderSelect: (folder: string) => void
}

export function EmailSidebar({ selectedFolder, onFolderSelect }: EmailSidebarProps) {
  const [folders, setFolders] = useState<EmailFolder[]>([])

  useEffect(() => {
    const loadFolders = async () => {
      const foldersData = await getEmailFolders()
      setFolders(foldersData)
    }
    loadFolders()
  }, [])

  const getFolderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Inbox':
        return <Inbox className="h-4 w-4" />
      case 'Send':
        return <Send className="h-4 w-4" />
      case 'FileText':
        return <FileText className="h-4 w-4" />
      case 'Trash':
        return <Trash className="h-4 w-4" />
      default:
        return <Inbox className="h-4 w-4" />
    }
  }

  const getFolderDisplayName = (name: string) => {
    switch (name) {
      case 'entrada':
        return 'Entrada'
      case 'enviados':
        return 'Enviados'
      case 'rascunhos':
        return 'Rascunhos'
      case 'lixeira':
        return 'Lixeira'
      default:
        return name
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button className="w-full" size="sm">
          <PenSquare className="h-4 w-4 mr-2" />
          Nova Mensagem
        </Button>
      </div>

      {/* Folders */}
      <div className="flex-1 p-2">
        <nav className="space-y-1">
          {folders.map((folder) => (
            <button
              key={folder.name}
              onClick={() => onFolderSelect(folder.name)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors ${
                selectedFolder === folder.name
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                {getFolderIcon(folder.icon)}
                <span className="ml-3">{getFolderDisplayName(folder.name)}</span>
              </div>
              {folder.unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {folder.unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
