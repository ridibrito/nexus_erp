-- Script para criar um negócio de teste no CRM
-- Execute este script no SQL Editor do Supabase

-- Inserir um negócio de teste
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
    NULL, -- cliente opcional
    (SELECT id FROM public.pipelines LIMIT 1), -- primeiro pipeline
    (SELECT id FROM public.pipeline_etapas 
     WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) 
     ORDER BY ordem LIMIT 1), -- primeira etapa
    25000.00, -- valor
    75, -- probabilidade
    'alta', -- prioridade
    (SELECT id FROM public.usuarios LIMIT 1), -- primeiro usuário
    '2024-01-20', -- próximo contato
    '2024-03-15', -- data de fechamento
    'd9c4338e-42b1-421c-a119-60cabfcb88ac', -- empresa_id da aplicação
    NOW(),
    NOW()
);

-- Verificar se foi criado
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
