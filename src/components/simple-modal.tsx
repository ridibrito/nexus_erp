'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function SimpleModal() {
  const [open, setOpen] = useState(false)

  console.log('SimpleModal renderizado, open:', open)

  return (
    <div className="p-4">
      <Button 
        onClick={() => {
          console.log('Clicando no botão, abrindo modal')
          setOpen(true)
        }}
        className="bg-blue-500 text-white"
      >
        Abrir Modal Simples
      </Button>

      <Dialog open={open} onOpenChange={(newOpen) => {
        console.log('onOpenChange chamado:', newOpen)
        setOpen(newOpen)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modal Simples</DialogTitle>
          </DialogHeader>
          <p>Este é um modal simples de teste.</p>
          <Button onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
} 