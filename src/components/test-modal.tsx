'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function TestModal() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>
        Abrir Modal de Teste
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal de Teste</DialogTitle>
          </DialogHeader>
          <p>Este é um modal de teste para verificar se está funcionando.</p>
          <Button onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
} 