'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Building2, CheckCircle, AlertCircle, Search } from 'lucide-react'
import { buscarCNPJ, formatarCNPJ, validarCNPJ } from '@/lib/api/brasil-api'
import { toast } from 'sonner'

interface CNPJInputProps {
  value: string
  onChange: (value: string) => void
  onDataLoaded?: (data: any) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function CNPJInput({ 
  value, 
  onChange, 
  onDataLoaded, 
  placeholder = "00.000.000/0000-00",
  className = "",
  disabled = false
}: CNPJInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [showSearchButton, setShowSearchButton] = useState(false)

  useEffect(() => {
    if (value && value.replace(/[^\d]/g, '').length === 14) {
      setShowSearchButton(true)
      setIsValid(validarCNPJ(value))
    } else {
      setShowSearchButton(false)
      setIsValid(null)
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const numericValue = inputValue.replace(/[^\d]/g, '')
    
    if (numericValue.length <= 14) {
      let formattedValue = numericValue
      if (numericValue.length > 0) {
        formattedValue = numericValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
      }
      onChange(formattedValue)
    }
  }

  const handleSearchCNPJ = async () => {
    if (!value || value.replace(/[^\d]/g, '').length !== 14) {
      toast.error('CNPJ deve ter 14 dígitos')
      return
    }

    if (!validarCNPJ(value)) {
      toast.error('CNPJ inválido')
      return
    }

    setIsLoading(true)
    try {
      const data = await buscarCNPJ(value)
      
      if (data) {
        toast.success('Dados da Receita Federal carregados com sucesso!')
        
        // Preencher automaticamente os campos se onDataLoaded for fornecido
        if (onDataLoaded) {
          console.log('Dados da BrasilAPI sendo passados para onDataLoaded:', data)
          onDataLoaded({
            razao_social: data.razao_social,
            nome_fantasia: data.nome_fantasia || '',
            logradouro: data.logradouro,
            numero: data.numero,
            complemento: data.complemento || '',
            bairro: data.bairro,
            municipio: data.municipio,
            uf: data.uf,
            cep: data.cep,
            telefone: data.ddd_telefone_1 || data.telefone || '',
            email: data.email || '',
            cnae: data.cnae_fiscal_descricao || '',
            porte: data.porte || '',
            natureza_juridica: data.natureza_juridica || '',
            situacao_cadastral: data.descricao_situacao_cadastral || '',
            inscricao_municipal: data.inscricao_municipal || '',
            inscricao_estadual: data.inscricao_estadual || '',
            capital_social: data.capital_social || 0
          })
        }
      }
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar dados da Receita Federal')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
    }
    
    if (isValid === true) {
      return <CheckCircle className="h-4 w-4 text-green-600" />
    }
    
    if (isValid === false) {
      return <AlertCircle className="h-4 w-4 text-red-600" />
    }
    
    return <Building2 className="h-4 w-4 text-gray-400" />
  }

  const getStatusText = () => {
    if (isLoading) return 'Consultando...'
    if (isValid === true) return 'CNPJ válido'
    if (isValid === false) return 'CNPJ inválido'
    return 'Aguardando CNPJ'
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative">
        <Input
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-20"
        />
        
        {/* Bandeira da Receita Federal */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <Badge variant="outline" className="text-xs bg-red-50 border-red-200 text-red-700">
            <Building2 className="h-3 w-3 mr-1" />
            RF
          </Badge>
        </div>
      </div>

      {/* Status e Botão de Busca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-xs text-gray-600">{getStatusText()}</span>
        </div>
        
        {showSearchButton && isValid && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleSearchCNPJ}
            disabled={isLoading || disabled}
            className="text-xs"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Search className="h-3 w-3 mr-1" />
            )}
            Buscar na RF
          </Button>
        )}
      </div>

      {/* Informações adicionais */}
      {isValid === true && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          ✓ CNPJ válido - Pode consultar dados da Receita Federal
        </div>
      )}
      
      {isValid === false && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          ✗ CNPJ inválido - Verifique os dígitos
        </div>
      )}
    </div>
  )
}
