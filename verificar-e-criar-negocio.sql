-- Script para verificar estrutura e criar negócio de teste
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a estrutura da tabela negocios
SELECT '=== ESTRUTURA DA TABELA NEGOCIOS ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'negocios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há triggers que podem estar interferindo
SELECT '=== TRIGGERS ===' as info;
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'negocios'
AND trigger_schema = 'public';

-- 3. Verificar dados disponíveis
SELECT '=== DADOS DISPONÍVEIS ===' as info;
SELECT COUNT(*) as total_usuarios FROM public.usuarios;
SELECT COUNT(*) as total_pipelines FROM public.pipelines;
SELECT COUNT(*) as total_etapas FROM public.pipeline_etapas;

-- 4. Tentar inserir usando uma abordagem mais direta
-- Vamos usar uma função para garantir que o empresa_id seja definido
DO $$
DECLARE
    v_empresa_id UUID := 'd9c4338e-42b1-421c-a119-60cabfcb88ac'::UUID;
    v_usuario_id UUID;
    v_pipeline_id UUID;
    v_etapa_id UUID;
    v_negocio_id UUID;
BEGIN
    -- Obter IDs necessários
    SELECT id INTO v_usuario_id FROM public.usuarios LIMIT 1;
    SELECT id INTO v_pipeline_id FROM public.pipelines LIMIT 1;
    SELECT id INTO v_etapa_id FROM public.pipeline_etapas 
    WHERE pipeline_id = v_pipeline_id ORDER BY ordem LIMIT 1;
    
    -- Gerar UUID para o negócio
    v_negocio_id := gen_random_uuid();
    
    -- Inserir o negócio com todos os campos explícitos
    INSERT INTO public.negocios (
        id,
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
        v_negocio_id,
        'Site E-commerce - Cliente ABC',
        'Desenvolvimento de site e-commerce completo para a empresa ABC',
        NULL,
        v_pipeline_id,
        v_etapa_id,
        25000.00,
        75,
        'alta',
        v_usuario_id,
        '2024-01-20',
        '2024-03-15',
        v_empresa_id,
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Negócio criado com ID: %', v_negocio_id;
    RAISE NOTICE 'Empresa ID: %, Usuário ID: %, Pipeline ID: %, Etapa ID: %', 
                 v_empresa_id, v_usuario_id, v_pipeline_id, v_etapa_id;
END $$;

-- 5. Verificar se foi criado
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
