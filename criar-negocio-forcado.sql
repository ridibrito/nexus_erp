-- Script para criar negócio forçando o empresa_id
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar se há dados
SELECT '=== VERIFICANDO DADOS ===' as info;
SELECT COUNT(*) as total_usuarios FROM public.usuarios;
SELECT COUNT(*) as total_pipelines FROM public.pipelines;
SELECT COUNT(*) as total_etapas FROM public.pipeline_etapas;

-- 2. Vamos usar uma abordagem diferente - inserir com empresa_id explícito
-- Primeiro, vamos criar uma função temporária para inserir o negócio
DO $$
DECLARE
    v_empresa_id UUID := 'd9c4338e-42b1-421c-a119-60cabfcb88ac'::UUID; -- Mesmo ID usado pela aplicação
    v_usuario_id UUID;
    v_pipeline_id UUID;
    v_etapa_id UUID;
BEGIN
    -- Obter IDs necessários
    SELECT id INTO v_usuario_id FROM public.usuarios LIMIT 1;
    SELECT id INTO v_pipeline_id FROM public.pipelines LIMIT 1;
    SELECT id INTO v_etapa_id FROM public.pipeline_etapas 
    WHERE pipeline_id = v_pipeline_id ORDER BY ordem LIMIT 1;
    
    -- Inserir o negócio com empresa_id explícito
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
        'Negócio de Teste Forçado',
        'Este é um negócio criado para teste do sistema com empresa_id forçado',
        NULL,
        v_pipeline_id,
        v_etapa_id,
        50000.00,
        75,
        'alta',
        v_usuario_id,
        '2024-01-15',
        '2024-02-15',
        v_empresa_id, -- empresa_id explícito
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Negócio criado com empresa_id: %', v_empresa_id;
    RAISE NOTICE 'Usuário ID: %, Pipeline ID: %, Etapa ID: %', v_usuario_id, v_pipeline_id, v_etapa_id;
END $$;

-- 3. Verificar se foi criado
SELECT 
    n.id,
    n.titulo,
    n.empresa_id,
    u.nome as responsavel,
    p.nome as pipeline
FROM public.negocios n
LEFT JOIN public.usuarios u ON n.responsavel_id = u.id
LEFT JOIN public.pipelines p ON n.pipeline_id = p.id
WHERE n.titulo = 'Negócio de Teste Forçado'
ORDER BY n.created_at DESC
LIMIT 1;
