'use server'

import { revalidatePath } from 'next/cache'

export async function criarClienteSimple(formData: FormData) {
  try {
    // Extrair dados do formulário
    const tipo = formData.get('tipo') as string
    const nome = formData.get('nome') as string
    const email = formData.get('email') as string
    const telefone = formData.get('telefone') as string
    const cpf = formData.get('cpf') as string
    const cnpj = formData.get('cnpj') as string
    const endereco = formData.get('endereco') as string

    // Validação básica
    if (!nome || !email) {
      return { success: false, error: 'Nome e email são obrigatórios' }
    }

    // Preparar dados do cliente
    const clienteData: any = {
      empresa_id: '00000000-0000-0000-0000-000000000000', // UUID fixo para teste
      tipo,
      email,
      telefone: telefone || null,
      status: 'ativo'
    }

    // Definir nome baseado no tipo
    if (tipo === 'pessoa_fisica') {
      clienteData.nome = nome
      if (cpf) clienteData.cpf = cpf.replace(/\D/g, '')
    } else {
      clienteData.razao_social = nome
      if (cnpj) clienteData.cnpj = cnpj.replace(/\D/g, '')
    }

    // Adicionar endereço se fornecido
    if (endereco) {
      try {
        clienteData.endereco = JSON.parse(endereco)
      } catch {
        clienteData.endereco = { endereco }
      }
    }

    console.log('📝 Dados do cliente (versão simples):', clienteData)

    // Por enquanto, apenas simular sucesso
    // Em produção, aqui você faria a inserção no banco
    console.log('✅ Cliente criado (simulado):', clienteData)
    revalidatePath('/clientes')
    
    return { success: true, data: { id: 'temp-id', ...clienteData } }
  } catch (error) {
    console.error('❌ Erro geral:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
