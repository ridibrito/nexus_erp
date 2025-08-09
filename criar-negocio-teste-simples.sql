-- Script simples para criar um negócio de teste
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos verificar os dados disponíveis
SELECT 'Usuários:' as tipo, id, nome, empresa_id FROM public.usuarios WHERE empresa_id IS NOT NULL LIMIT 3;
SELECT 'Pipelines:' as tipo, id, nome FROM public.pipelines LIMIT 3;
SELECT 'Clientes:' as tipo, id, nome_fant FROM public.clientes LIMIT 3;

-- Verificar se há usuários com empresa_id
SELECT COUNT(*) as usuarios_com_empresa FROM public.usuarios WHERE empresa_id IS NOT NULL;

-- Se não há usuários com empresa_id, vamos criar um negócio com empresa_id fixo
-- Vamos usar o empresa_id do primeiro usuário ou um valor padrão
DO $$
DECLARE
    v_empresa_id UUID;
    v_usuario_id UUID;
    v_pipeline_id UUID;
    v_etapa_id UUID;
BEGIN
    -- Tentar obter empresa_id de um usuário existente
    SELECT empresa_id INTO v_empresa_id 
    FROM public.usuarios 
    WHERE empresa_id IS NOT NULL 
    LIMIT 1;
    
    -- Se não encontrou, usar um valor padrão (você pode ajustar este UUID)
    IF v_empresa_id IS NULL THEN
        v_empresa_id := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID;
    END IF;
    
    -- Obter usuário para responsável
    SELECT id INTO v_usuario_id FROM public.usuarios LIMIT 1;
    
    -- Obter pipeline
    SELECT id INTO v_pipeline_id FROM public.pipelines LIMIT 1;
    
    -- Obter etapa do pipeline
    SELECT id INTO v_etapa_id 
    FROM public.pipeline_etapas 
    WHERE pipeline_id = v_pipeline_id 
    ORDER BY ordem LIMIT 1;
    
    -- Inserir o negócio
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
        'Negócio de Teste',
        'Este é um negócio criado para teste do sistema',
        NULL, -- cliente_id opcional
        v_pipeline_id,
        v_etapa_id,
        50000.00, -- valor
        75, -- probabilidade
        'alta', -- prioridade
        v_usuario_id, -- responsavel_id
        '2024-01-15', -- próximo contato
        '2024-02-15', -- data de fechamento
        v_empresa_id, -- empresa_id
        NOW(),
        NOW()
    );
    
    RAISE NOTICE 'Negócio criado com empresa_id: %', v_empresa_id;
END $$;

-- Verificar se foi criado
SELECT 
    n.id,
    n.titulo,
    n.empresa_id,
    u.nome as responsavel,
    p.nome as pipeline
FROM public.negocios n
LEFT JOIN public.usuarios u ON n.responsavel_id = u.id
LEFT JOIN public.pipelines p ON n.pipeline_id = p.id
WHERE n.titulo = 'Negócio de Teste'
ORDER BY n.created_at DESC
LIMIT 1;
