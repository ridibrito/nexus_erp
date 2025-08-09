-- Script simples para criar um negócio de teste
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar dados disponíveis
SELECT '=== DADOS DISPONÍVEIS ===' as info;
SELECT 'Usuários:' as tipo, id, nome, empresa_id FROM public.usuarios LIMIT 3;
SELECT 'Pipelines:' as tipo, id, nome FROM public.pipelines LIMIT 3;

-- 2. Inserir negócio de teste com empresa_id fixo
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
    (SELECT id FROM public.pipelines LIMIT 1), -- primeiro pipeline
    (SELECT id FROM public.pipeline_etapas 
     WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) 
     ORDER BY ordem LIMIT 1), -- primeira etapa do pipeline
    50000.00, -- valor
    75, -- probabilidade
    'alta', -- prioridade
    (SELECT id FROM public.usuarios LIMIT 1), -- primeiro usuário
    '2024-01-15', -- próximo contato
    '2024-02-15', -- data de fechamento
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- empresa_id fixo
    NOW(),
    NOW()
);

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
WHERE n.titulo = 'Negócio de Teste'
ORDER BY n.created_at DESC
LIMIT 1;
