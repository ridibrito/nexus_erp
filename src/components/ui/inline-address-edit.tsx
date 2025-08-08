'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Edit, Check, X } from 'lucide-react'

interface Endereco {
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
}

interface InlineAddressEditProps {
  endereco: Endereco
  onSave: (endereco: Endereco) => Promise<void>
  className?: string
}

export function InlineAddressEdit({ endereco, onSave, className = '' }: InlineAddressEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [addressData, setAddressData] = useState<Endereco>(endereco || {})
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setAddressData(endereco || {})
  }, [endereco])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(addressData)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao salvar endereço:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setAddressData(endereco || {})
    setIsEditing(false)
  }

  const handleFieldChange = (field: keyof Endereco, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatEndereco = (endereco: Endereco) => {
    const parts = []
    if (endereco.logradouro) parts.push(endereco.logradouro)
    if (endereco.numero) parts.push(endereco.numero)
    if (endereco.bairro) parts.push(endereco.bairro)
    if (endereco.cidade) parts.push(endereco.cidade)
    if (endereco.estado) parts.push(endereco.estado)
    
    return parts.length > 0 ? parts.join(', ') : 'Endereço não informado'
  }

  if (isEditing) {
    return (
      <div ref={containerRef} className={`space-y-3 ${className}`}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Logradouro</label>
            <Input
              value={addressData.logradouro || ''}
              onChange={(e) => handleFieldChange('logradouro', e.target.value)}
              placeholder="Rua, Avenida, etc."
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Número</label>
            <Input
              value={addressData.numero || ''}
              onChange={(e) => handleFieldChange('numero', e.target.value)}
              placeholder="123"
              className="text-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs text-gray-500">Complemento</label>
          <Input
            value={addressData.complemento || ''}
            onChange={(e) => handleFieldChange('complemento', e.target.value)}
            placeholder="Apto, Sala, etc."
            className="text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Bairro</label>
            <Input
              value={addressData.bairro || ''}
              onChange={(e) => handleFieldChange('bairro', e.target.value)}
              placeholder="Centro"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">CEP</label>
            <Input
              value={addressData.cep || ''}
              onChange={(e) => handleFieldChange('cep', e.target.value)}
              placeholder="00000-000"
              className="text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500">Cidade</label>
            <Input
              value={addressData.cidade || ''}
              onChange={(e) => handleFieldChange('cidade', e.target.value)}
              placeholder="São Paulo"
              className="text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Estado</label>
            <Input
              value={addressData.estado || ''}
              onChange={(e) => handleFieldChange('estado', e.target.value)}
              placeholder="SP"
              className="text-sm"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center justify-between group ${className}`}>
      <span className="text-sm text-gray-900">
        {formatEndereco(endereco || {})}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 hover:bg-gray-100 rounded"
      >
        <Edit className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  )
}
