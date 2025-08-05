'use client'

import React, { forwardRef, useEffect, useRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: (value: string) => string
  onValueChange?: (value: string) => void
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, onValueChange, onChange, value, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      let maskedValue = value

      if (mask) {
        maskedValue = mask(value)
      }

      // Atualizar o valor do input
      if (inputRef.current) {
        inputRef.current.value = maskedValue
      }

      // Chamar onChange original se fornecido
      if (onChange) {
        onChange(e)
      }

      // Chamar onValueChange se fornecido
      if (onValueChange) {
        onValueChange(maskedValue)
      }
    }

    // Aplicar máscara ao valor inicial
    useEffect(() => {
      if (value && mask && inputRef.current) {
        const maskedValue = mask(value as string)
        inputRef.current.value = maskedValue
      }
    }, [value, mask])

    return (
      <Input
        className={cn(className)}
        ref={(node) => {
          // Manter referência tanto para ref quanto para inputRef
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          inputRef.current = node
        }}
        onChange={handleChange}
        value={value}
        {...props}
      />
    )
  }
)

MaskedInput.displayName = 'MaskedInput'

export { MaskedInput } 