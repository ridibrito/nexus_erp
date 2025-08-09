-- Script para diagnosticar o problema com empresa_id
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a estrutura completa da tabela negocios
SELECT '=== ESTRUTURA COMPLETA DA TABELA NEGOCIOS ===' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'negocios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há triggers que podem estar interferindo
SELECT '=== TRIGGERS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'negocios'
AND trigger_schema = 'public';

-- 3. Verificar se há RLS (Row Level Security) ativo
SELECT '=== RLS POLICIES ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'negocios';

-- 4. Verificar se há constraints que podem estar interferindo
SELECT '=== CONSTRAINTS ===' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'negocios' 
AND tc.table_schema = 'public';

-- 5. Verificar se há funções que podem estar sendo chamadas
SELECT '=== FUNCTIONS THAT MIGHT AFFECT NEGOCIOS ===' as info;
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition LIKE '%negocios%'
AND routine_schema = 'public';

-- 6. Tentar inserir com empresa_id NULL para ver se há default
SELECT '=== TESTANDO INSERT COM EMPRESA_ID NULL ===' as info;
-- Vamos tentar inserir sem especificar empresa_id para ver se há um default
INSERT INTO public.negocios (
    titulo,
    descricao,
    cliente_id,
    pipeline_id,
    etapa_id,
    valor,
    probabilidade,
    prioridade,
    responsavel_id,
    proximo_contato,
    data_fechamento,
    created_at,
    updated_at
) VALUES (
    'Teste Sem Empresa ID',
    'Teste para verificar se há default',
    NULL,
    (SELECT id FROM public.pipelines LIMIT 1),
    (SELECT id FROM public.pipeline_etapas 
     WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) 
     ORDER BY ordem LIMIT 1),
    1000.00,
    50,
    'baixa',
    (SELECT id FROM public.usuarios LIMIT 1),
    '2024-01-01',
    '2024-02-01',
    NOW(),
    NOW()
);

-- 7. Verificar se foi inserido
SELECT '=== VERIFICANDO INSERÇÃO ===' as info;
SELECT 
    id,
    titulo,
    empresa_id,
    created_at
FROM public.negocios 
WHERE titulo = 'Teste Sem Empresa ID'
ORDER BY created_at DESC
LIMIT 1;
