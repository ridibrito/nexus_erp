-- Script para verificar triggers e criar negócio
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se há triggers que podem estar interferindo
SELECT '=== VERIFICANDO TRIGGERS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'negocios'
AND trigger_schema = 'public';

-- 2. Verificar se há funções que podem estar sendo chamadas
SELECT '=== VERIFICANDO FUNÇÕES ===' as info;
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition LIKE '%negocios%'
AND routine_schema = 'public';

-- 3. Verificar se há defaults na tabela
SELECT '=== VERIFICANDO DEFAULTS ===' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'negocios' 
AND table_schema = 'public'
AND column_name = 'empresa_id';

-- 4. Tentar inserir usando uma abordagem diferente - sem subqueries
SELECT '=== OBTENDO IDs NECESSÁRIOS ===' as info;
SELECT id as usuario_id, nome as usuario_nome FROM public.usuarios LIMIT 1;
SELECT id as pipeline_id, nome as pipeline_nome FROM public.pipelines LIMIT 1;
SELECT pe.id as etapa_id, pe.nome as etapa_nome 
FROM public.pipeline_etapas pe
JOIN public.pipelines p ON pe.pipeline_id = p.id
WHERE p.id = (SELECT id FROM public.pipelines LIMIT 1)
ORDER BY pe.ordem LIMIT 1;

-- 5. Tentar inserir com empresa_id explícito usando UUID direto
SELECT '=== TENTANDO INSERT COM UUID DIRETO ===' as info;
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
    empresa_id,
    created_at,
    updated_at
) VALUES (
    'Site E-commerce - Cliente ABC',
    'Desenvolvimento de site e-commerce completo para a empresa ABC',
    NULL,
    '6255188a-43e6-4b4c-bf29-ad8c68917993'::UUID,
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID,
    25000.00,
    75,
    'alta',
    'a8c05dd7-73bd-4153-ad32-190bf3110702'::UUID,
    '2024-01-20',
    '2024-03-15',
    'd9c4338e-42b1-421c-a119-60cabfcb88ac'::UUID,
    NOW(),
    NOW()
);

-- 6. Verificar se foi criado
SELECT '=== VERIFICANDO NEGÓCIO CRIADO ===' as info;
SELECT 
    n.id,
    n.titulo,
    n.descricao,
    n.valor,
    n.probabilidade,
    n.prioridade,
    n.proximo_contato,
    n.data_fechamento,
    n.empresa_id,
    u.nome as responsavel,
    p.nome as pipeline,
    pe.nome as etapa
FROM public.negocios n
LEFT JOIN public.usuarios u ON n.responsavel_id = u.id
LEFT JOIN public.pipelines p ON n.pipeline_id = p.id
LEFT JOIN public.pipeline_etapas pe ON n.etapa_id = pe.id
WHERE n.titulo = 'Site E-commerce - Cliente ABC'
ORDER BY n.created_at DESC
LIMIT 1;
