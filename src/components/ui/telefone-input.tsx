'use client'

import { useState } from 'react'
import { Input } from './input'
import { Label } from './label'
import { MaskedInput } from './masked-input'
import { Button } from './button'
import { Plus, X } from 'lucide-react'
import { maskPhone } from '@/lib/utils'

interface Telefone {
  numero: string
  tipo: string
}

interface TelefoneInputProps {
  value?: Telefone[]
  onChange: (telefones: Telefone[]) => void
  label?: string
}

const tiposTelefone = [
  'Comercial',
  'Celular',
  'Residencial',
  'WhatsApp',
  'Fax'
]

export function TelefoneInput({ 
  value = [], 
  onChange, 
  label = "Telefones" 
}: TelefoneInputProps) {
  const [telefones, setTelefones] = useState<Telefone[]>(value)

  const addTelefone = () => {
    const novoTelefone: Telefone = {
      numero: '',
      tipo: 'Comercial'
    }
    const novosTelefones = [...telefones, novoTelefone]
    setTelefones(novosTelefones)
    onChange(novosTelefones)
  }

  const removeTelefone = (index: number) => {
    const novosTelefones = telefones.filter((_, i) => i !== index)
    setTelefones(novosTelefones)
    onChange(novosTelefones)
  }

  const updateTelefone = (index: number, field: keyof Telefone, value: string) => {
    const novosTelefones = telefones.map((telefone, i) => {
      if (i === index) {
        return { ...telefone, [field]: value }
      }
      return telefone
    })
    setTelefones(novosTelefones)
    onChange(novosTelefones)
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-2 mt-1">
        {telefones.map((telefone, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs">🇧🇷</span>
              </div>
            </div>
            
            <div className="flex-1">
              <MaskedInput
                value={telefone.numero}
                onValueChange={(value) => updateTelefone(index, 'numero', value)}
                placeholder="(__) _____-____"
                mask={maskPhone}
                className="w-full"
              />
            </div>
            
            <select
              value={telefone.tipo}
              onChange={(e) => updateTelefone(index, 'tipo', e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {tiposTelefone.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTelefone(index)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTelefone}
          className="flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar telefone</span>
        </Button>
      </div>
    </div>
  )
}
