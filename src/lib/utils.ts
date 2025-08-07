import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Máscara para CNPJ (XX.XXX.XXX/XXXX-XX)
export function maskCNPJ(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // Limita a 14 dígitos
}

// Máscara para CPF (XXX.XXX.XXX-XX)
export function maskCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // Limita a 11 dígitos
}

// Máscara para telefone ((XX) XXXXX-XXXX)
export function maskPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1') // Limita a 11 dígitos
}

// Máscara para CEP (XXXXX-XXX)
export function maskCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  return numbers
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1') // Limita a 8 dígitos
}

// Função para remover máscaras
export function removeMask(value: string): string {
  return value.replace(/\D/g, '')
}

// Validação de CNPJ
export function validateCNPJ(cnpj: string): boolean {
  const numbers = removeMask(cnpj)
  
  if (numbers.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * (i < 4 ? 5 - i : 13 - i)
  }
  let digit = sum % 11
  digit = digit < 2 ? 0 : 11 - digit
  
  if (parseInt(numbers[12]) !== digit) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * (i < 5 ? 6 - i : 14 - i)
  }
  digit = sum % 11
  digit = digit < 2 ? 0 : 11 - digit
  
  return parseInt(numbers[13]) === digit
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Máscara para valores monetários (R$)
export function maskCurrency(value: string): string {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  // Converte para centavos
  const cents = numbers.padEnd(3, '0')
  const reais = cents.slice(0, -2)
  const centavos = cents.slice(-2)
  
  // Formata com vírgula e ponto
  const formattedReais = reais.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  
  // Retorna formatado como R$ X.XXX,XX
  return `R$ ${formattedReais || '0'},${centavos}`
}

// Remove máscara de moeda e retorna número
export function unmaskCurrency(value: string): number {
  if (!value || value.trim() === '') return 0
  
  const numbers = value.replace(/\D/g, '')
  if (numbers === '') return 0
  
  const result = parseFloat(numbers) / 100
  return isNaN(result) ? 0 : result
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
} 