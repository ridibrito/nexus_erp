import { supabase } from '../supabase'

export async function getCurrentEmpresa(): Promise<string | null> {
  console.log('=== INICIANDO getCurrentEmpresa() ===')
  
  // DESABILITADO TEMPORARIAMENTE PARA DESENVOLVIMENTO
  // Retornar sempre um ID padrão para evitar erros
  console.log('Usando empresa padrão para desenvolvimento')
  return 'd9c4338e-42b1-421c-a119-60cabfcb88ac'

  /* CÓDIGO ORIGINAL COMENTADO TEMPORARIAMENTE
  try {
    console.log('Obtendo usuário atual...')
    const { data: { user } } = await supabase.auth.getUser()
    console.log('Usuário obtido:', user ? 'Sim' : 'Não')
    
    if (!user) {
      console.log('Usuário não encontrado, retornando ID padrão')
      return 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
    }

    // Buscar na tabela usuarios para obter a empresa_id
    try {
      console.log('Buscando usuário na tabela usuarios...')
      const { data: usuario } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('auth_user_id', user.id)
        .eq('is_active', true)
        .single()

      console.log('Usuário encontrado na tabela usuarios:', usuario)

      if (usuario?.empresa_id) {
        console.log('Empresa ID encontrada:', usuario.empresa_id)
        return usuario.empresa_id
      }
    } catch (error) {
      console.log('Erro ao buscar usuário na tabela usuarios:', error)
    }

    // Se não encontrar usuário, tente buscar a primeira empresa
    try {
      console.log('Buscando primeira empresa...')
      const { data: empresa } = await supabase
        .from('empresas')
        .select('id')
        .limit(1)
        .single()

      console.log('Empresa encontrada:', empresa)

      if (empresa?.id) {
        console.log('Usando empresa encontrada:', empresa.id)
        return empresa.id
      }
    } catch (error) {
      console.log('Erro ao buscar empresa:', error)
    }

    // Se ainda não encontrar, use um ID padrão (para desenvolvimento)
    console.log('Usando empresa padrão para desenvolvimento')
    return 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
  } catch (error) {
    console.error('Erro ao obter empresa:', error)
    return 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
  }
  */
}
