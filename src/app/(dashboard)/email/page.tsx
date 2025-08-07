'use client'

import { EmailSidebar } from '@/components/email/email-sidebar'
import { EmailList } from '@/components/email/email-list'
import { EmailDisplay } from '@/components/email/email-display'
import { useState } from 'react'

export default function EmailPage() {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)
  const [selectedFolder, setSelectedFolder] = useState('entrada')

  return (
    <div className="h-full flex">
      <div className="w-1/5 border-r border-gray-200">
        <EmailSidebar 
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
        />
      </div>
      <div className="w-2/5 border-r border-gray-200">
        <EmailList 
          folder={selectedFolder}
          onEmailSelect={setSelectedEmailId}
          selectedEmailId={selectedEmailId}
        />
      </div>
      <div className="w-2/5">
        <EmailDisplay 
          emailId={selectedEmailId}
        />
      </div>
    </div>
  )
}
