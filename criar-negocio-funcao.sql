-- Script para criar negócio usando função personalizada
-- Execute este script no SQL Editor do Supabase

-- 1. Criar uma função para inserir negócio com empresa_id garantido
CREATE OR REPLACE FUNCTION inserir_negocio_teste()
RETURNS UUID AS $$
DECLARE
    v_negocio_id UUID;
    v_empresa_id UUID := 'd9c4338e-42b1-421c-a119-60cabfcb88ac'::UUID;
    v_usuario_id UUID;
    v_pipeline_id UUID;
    v_etapa_id UUID;
BEGIN
    -- Obter IDs necessários
    SELECT id INTO v_usuario_id FROM public.usuarios LIMIT 1;
    SELECT id INTO v_pipeline_id FROM public.pipelines LIMIT 1;
    SELECT id INTO v_etapa_id FROM public.pipeline_etapas 
    WHERE pipeline_id = v_pipeline_id ORDER BY ordem LIMIT 1;
    
    -- Gerar UUID para o negócio
    v_negocio_id := gen_random_uuid();
    
    -- Inserir o negócio com empresa_id explícito
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
    
    RETURN v_negocio_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Executar a função
SELECT '=== EXECUTANDO FUNÇÃO ===' as info;
SELECT inserir_negocio_teste() as negocio_id;

-- 3. Verificar se foi criado
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

-- 4. Limpar a função (opcional)
-- DROP FUNCTION IF EXISTS inserir_negocio_teste();
