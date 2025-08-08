'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from './input'
import { Label } from './label'
import { Button } from './button'
import { Search, Building2, X } from 'lucide-react'
import { buscarEmpresas } from '@/lib/actions/pessoas'

interface Empresa {
  id: string
  nome: string
  razao_social?: string
  cnpj?: string
}

interface EmpresaSelectProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
}

export function EmpresaSelect({ 
  value, 
  onChange, 
  placeholder = "Buscar empresa...",
  label = "Empresa",
  required = false 
}: EmpresaSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Buscar empresas quando o componente montar
  useEffect(() => {
    loadEmpresas()
  }, [])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Buscar empresa selecionada quando value mudar
  useEffect(() => {
    if (value && empresas.length > 0) {
      const empresa = empresas.find(e => e.id === value)
      if (empresa) {
        setSelectedEmpresa(empresa)
      }
    }
  }, [value, empresas])

  const loadEmpresas = async (termo?: string) => {
    setLoading(true)
    try {
      const result = await buscarEmpresas(termo)
      if (result.success && result.data) {
        setEmpresas(result.data)
      }
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (termo: string) => {
    setSearchTerm(termo)
    await loadEmpresas(termo)
  }

  const handleSelectEmpresa = (empresa: Empresa) => {
    setSelectedEmpresa(empresa)
    onChange(empresa.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    setSelectedEmpresa(null)
    onChange('')
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="empresa-select">{label}</Label>
      <div className="relative mt-1">
        <Input
          id="empresa-select"
          type="text"
          value={selectedEmpresa ? selectedEmpresa.nome : searchTerm}
          onChange={(e) => {
            if (!selectedEmpresa) {
              handleSearch(e.target.value)
            }
          }}
          onFocus={() => {
            if (!selectedEmpresa) {
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          required={required}
          className="pr-10"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {selectedEmpresa && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Carregando...
            </div>
          ) : empresas.length > 0 ? (
            <div>
              {empresas.map((empresa) => (
                <button
                  key={empresa.id}
                  type="button"
                  onClick={() => handleSelectEmpresa(empresa)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium">{empresa.nome}</div>
                    {empresa.cnpj && (
                      <div className="text-sm text-gray-500">
                        CNPJ: {empresa.cnpj}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Nenhuma empresa encontrada
            </div>
          )}
        </div>
      )}
    </div>
  )
}
