-- LIMPAR TUDO COM CASCADE
-- Usar DROP CASCADE para remover tabelas e dependências de uma vez

-- 1. VERIFICAR ESTADO ATUAL
SELECT 
    '🔍 Estado atual' as status,
    (SELECT COUNT(*) FROM public.empresas) as empresas_criadas,
    (SELECT COUNT(*) FROM public.usuarios) as usuarios_criados;

-- 2. REMOVER TABELAS ANTIGAS COM CASCADE
-- Isso vai remover automaticamente todas as políticas RLS e constraints

DROP TABLE IF EXISTS public.convites_usuarios CASCADE;
DROP TABLE IF EXISTS public.membros CASCADE;
DROP TABLE IF EXISTS public.empresas_proprias CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;

-- 3. VERIFICAR SE AS TABELAS FORAM REMOVIDAS
SELECT 
    '📋 Verificando tabelas antigas...' as status,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workspaces') 
         THEN '❌ Ainda existe' 
         ELSE '✅ Removida' 
    END as workspaces,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'empresas_proprias') 
         THEN '❌ Ainda existe' 
         ELSE '✅ Removida' 
    END as empresas_proprias,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'membros') 
         THEN '❌ Ainda existe' 
         ELSE '✅ Removida' 
    END as membros;

-- 4. VERIFICAR TABELAS RESTANTES
SELECT 
    '📋 Tabelas Restantes' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'usuarios', 'clientes', 'negocios', 'pipelines')
ORDER BY table_name;

-- 5. VERIFICAR DADOS MIGRADOS
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

-- 6. RESUMO FINAL
SELECT 
    '🎉 LIMPEZA CONCLUÍDA COM CASCADE!' as resultado,
    'Tabelas antigas e dependências removidas' as status,
    'Estrutura simplificada ativa' as acao,
    'Frontend pode usar nova API' as proximo_passo; 