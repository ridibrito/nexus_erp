-- LIMPAR TABELAS ANTIGAS
-- Remover workspace, empresas_proprias e membros após migração bem-sucedida

-- 1. VERIFICAR SE A MIGRAÇÃO FOI BEM-SUCEDIDA
SELECT 
    '✅ Verificando migração...' as status,
    (SELECT COUNT(*) FROM public.empresas) as empresas_criadas,
    (SELECT COUNT(*) FROM public.usuarios) as usuarios_criados;

-- 2. VERIFICAR SE OS DADOS FORAM MIGRADOS CORRETAMENTE
SELECT 
    '🏢 Empresa Nexus' as tipo,
    id,
    nome,
    razao_social
FROM public.empresas 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

SELECT 
    '👤 Usuários Migrados' as tipo,
    COUNT(*) as total
FROM public.usuarios 
WHERE empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. REMOVER TABELAS ANTIGAS (apenas se a migração foi bem-sucedida)

-- Remover tabela de convites (depende de membros)
DROP TABLE IF EXISTS public.convites_usuarios;

-- Remover tabela de membros
DROP TABLE IF EXISTS public.membros;

-- Remover tabela de empresas_proprias
DROP TABLE IF EXISTS public.empresas_proprias;

-- Remover tabela de workspaces
DROP TABLE IF EXISTS public.workspaces;

-- 4. VERIFICAR TABELAS RESTANTES
SELECT 
    '📋 Tabelas Restantes' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'usuarios', 'clientes', 'negocios', 'pipelines')
ORDER BY table_name;

-- 5. RESUMO FINAL
SELECT 
    '🎉 LIMPEZA CONCLUÍDA!' as resultado,
    'Estrutura simplificada ativa' as status,
    'Tabelas antigas removidas' as acao,
    'Frontend pode usar nova API' as proximo_passo; 