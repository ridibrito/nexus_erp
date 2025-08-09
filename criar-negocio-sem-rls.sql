-- Script para criar negócio desabilitando RLS temporariamente
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se RLS está ativo na tabela negocios
SELECT '=== VERIFICANDO RLS ===' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'negocios' AND schemaname = 'public';

-- 2. Verificar políticas RLS existentes
SELECT '=== POLÍTICAS RLS EXISTENTES ===' as info;
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

-- 3. Desabilitar RLS temporariamente
SELECT '=== DESABILITANDO RLS ===' as info;
ALTER TABLE public.negocios DISABLE ROW LEVEL SECURITY;

-- 4. Verificar se RLS foi desabilitado
SELECT '=== VERIFICANDO SE RLS FOI DESABILITADO ===' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'negocios' AND schemaname = 'public';

-- 5. Criar negócio de teste
SELECT '=== CRIANDO NEGÓCIO DE TESTE ===' as info;
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
    (SELECT id FROM public.pipelines LIMIT 1),
    (SELECT id FROM public.pipeline_etapas 
     WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) 
     ORDER BY ordem LIMIT 1),
    25000.00,
    75,
    'alta',
    (SELECT id FROM public.usuarios LIMIT 1),
    '2024-01-20',
    '2024-03-15',
    'd9c4338e-42b1-421c-a119-60cabfcb88ac',
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

-- 7. Reabilitar RLS (opcional - descomente se quiser reabilitar)
-- SELECT '=== REABILITANDO RLS ===' as info;
-- ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;
