-- Script direto para criar um negócio de teste
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar os dados disponíveis
SELECT '=== DADOS DISPONÍVEIS ===' as info;

SELECT 'Usuários:' as tipo, id, nome, empresa_id FROM public.usuarios LIMIT 5;
SELECT 'Pipelines:' as tipo, id, nome FROM public.pipelines LIMIT 5;
SELECT 'Clientes:' as tipo, id, nome_fant FROM public.clientes LIMIT 5;

-- 2. Verificar se há usuários com empresa_id
SELECT COUNT(*) as total_usuarios FROM public.usuarios;
SELECT COUNT(*) as usuarios_com_empresa FROM public.usuarios WHERE empresa_id IS NOT NULL;

-- 3. Se não há usuários com empresa_id, vamos atualizar o primeiro usuário
UPDATE public.usuarios 
SET empresa_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' 
WHERE empresa_id IS NULL 
AND id = (SELECT id FROM public.usuarios WHERE empresa_id IS NULL ORDER BY created_at ASC LIMIT 1);

-- 4. Verificar se a atualização funcionou
SELECT 'Usuários após atualização:' as tipo, id, nome, empresa_id FROM public.usuarios WHERE empresa_id IS NOT NULL LIMIT 3;

-- 5. Agora vamos inserir o negócio de teste
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
) 
SELECT 
    'Negócio de Teste',
    'Este é um negócio criado para teste do sistema',
    NULL, -- cliente_id opcional
    p.id, -- pipeline_id
    pe.id, -- etapa_id
    50000.00, -- valor
    75, -- probabilidade
    'alta', -- prioridade
    u.id, -- responsavel_id
    '2024-01-15', -- próximo contato
    '2024-02-15', -- data de fechamento
    u.empresa_id, -- empresa_id do usuário
    NOW(),
    NOW()
FROM public.usuarios u
CROSS JOIN (
    SELECT id FROM public.pipelines LIMIT 1
) p
CROSS JOIN (
    SELECT id FROM public.pipeline_etapas 
    WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) 
    ORDER BY ordem LIMIT 1
) pe
WHERE u.empresa_id IS NOT NULL
LIMIT 1;

-- 6. Verificar se foi criado
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
