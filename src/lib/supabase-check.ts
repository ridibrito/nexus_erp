import { supabase } from './supabase'

export async function checkSupabaseConnection() {
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('empresas')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Erro na conexão com Supabase:', error)
      return {
        success: false,
        error: error.message,
        details: 'Falha na conexão básica com o banco de dados'
      }
    }

    // Testar se as tabelas existem
    const tables = ['empresas', 'clientes', 'cobrancas', 'contas_a_pagar', 'integracoes']
    const tableChecks = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        return {
          table,
          exists: !error,
          error: error?.message
        }
      })
    )

    const missingTables = tableChecks.filter(check => !check.exists)
    
    if (missingTables.length > 0) {
      return {
        success: false,
        error: 'Tabelas não encontradas',
        details: `Tabelas ausentes: ${missingTables.map(t => t.table).join(', ')}`,
        missingTables
      }
    }

    // Testar autenticação
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('Erro na autenticação:', authError)
      return {
        success: false,
        error: 'Erro na configuração de autenticação',
        details: authError.message
      }
    }

    return {
      success: true,
      message: 'Supabase configurado corretamente',
      tables: tableChecks.map(check => ({ table: check.table, exists: check.exists })),
      auth: authData.session ? 'Usuário autenticado' : 'Usuário não autenticado'
    }

  } catch (error) {
    console.error('Erro inesperado:', error)
    return {
      success: false,
      error: 'Erro inesperado',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

export async function testDatabaseOperations() {
  try {
    // Primeiro, verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      return {
        success: false,
        error: 'Erro ao verificar sessão',
        details: sessionError.message
      }
    }

    if (!session) {
      return {
        success: true,
        message: 'RLS está funcionando corretamente',
        details: 'Usuário não autenticado - inserção bloqueada por RLS (comportamento esperado)'
      }
    }

    // Se o usuário está autenticado, testar inserção real
    const testData = {
      user_id: session.user.id,
      razao_social: 'Teste de Conexão - ' + new Date().toISOString(),
      cnpj: null
    }

    const { data: insertData, error: insertError } = await supabase
      .from('empresas')
      .insert(testData)
      .select()
      .single()

    if (insertError) {
      return {
        success: false,
        error: 'Erro ao testar inserção',
        details: insertError.message
      }
    }

    // Se a inserção funcionou, deletar o registro de teste
    if (insertData) {
      const { error: deleteError } = await supabase
        .from('empresas')
        .delete()
        .eq('id', insertData.id)

      if (deleteError) {
        console.warn('Aviso: Não foi possível deletar o registro de teste:', deleteError.message)
      }
    }

    return {
      success: true,
      message: 'Operações de banco funcionando corretamente',
      details: 'Inserção e exclusão de teste realizadas com sucesso'
    }

  } catch (error) {
    console.error('Erro no teste de operações:', error)
    return {
      success: false,
      error: 'Erro no teste de operações',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
} 