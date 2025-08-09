-- Script para criar negócio de forma direta
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos obter os IDs necessários
SELECT '=== OBTENDO IDs ===' as info;

-- Obter primeiro usuário
SELECT id as usuario_id, nome as usuario_nome FROM public.usuarios LIMIT 1;

-- Obter primeiro pipeline
SELECT id as pipeline_id, nome as pipeline_nome FROM public.pipelines LIMIT 1;

-- Obter primeira etapa do primeiro pipeline
SELECT pe.id as etapa_id, pe.nome as etapa_nome, p.nome as pipeline_nome
FROM public.pipeline_etapas pe
JOIN public.pipelines p ON pe.pipeline_id = p.id
WHERE p.id = (SELECT id FROM public.pipelines LIMIT 1)
ORDER BY pe.ordem LIMIT 1;

-- 2. Agora vamos inserir o negócio usando os IDs obtidos acima
-- Substitua os UUIDs pelos valores reais obtidos na consulta acima
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
    '6255188a-43e6-4b4c-bf29-ad8c68917993', -- Substitua pelo pipeline_id real
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890', -- Substitua pelo etapa_id real
    25000.00,
    75,
    'alta',
    'a8c05dd7-73bd-4153-ad32-190bf3110702', -- Substitua pelo usuario_id real
    '2024-01-20',
    '2024-03-15',
    'd9c4338e-42b1-421c-a119-60cabfcb88ac', -- empresa_id da aplicação
    NOW(),
    NOW()
);

-- 3. Verificar se foi criado
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
