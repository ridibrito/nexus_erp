-- =====================================================
-- CRIAR WORKSPACE PADRÃO E DADOS INICIAIS
-- =====================================================

-- 1. Criar workspace padrão
INSERT INTO public.workspaces (id, nome, created_at, updated_at)
VALUES (
    'default-workspace-id',
    'Nexus ERP - Workspace Padrão',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Inserir usuário como membro do workspace padrão
-- (Substitua o user_id pelo seu ID real do Supabase)
INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active, created_at, updated_at)
VALUES (
    'default-workspace-id',
    '56022b1a-77cb-40ac-86ca-80b5ae30def1', -- Seu user_id do erro
    'Ricardo Admin',
    'ricardo@coruss.com.br',
    'Administrador',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (workspace_id, user_id) DO NOTHING;

-- 3. Criar pipeline padrão
INSERT INTO public.pipelines (id, workspace_id, nome, descricao, cor, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'default-workspace-id',
    'Vendas',
    'Pipeline de vendas padrão',
    '#3B82F6',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- 4. Criar etapas do pipeline
INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem, created_at, updated_at)
SELECT 
    p.id as pipeline_id,
    'Prospecção' as nome,
    'Primeiro contato com o cliente' as descricao,
    '#6B7280' as cor,
    1 as ordem,
    NOW() as created_at,
    NOW() as updated_at
FROM public.pipelines p
WHERE p.workspace_id = 'default-workspace-id' AND p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem, created_at, updated_at)
SELECT 
    p.id as pipeline_id,
    'Qualificação' as nome,
    'Avaliação da oportunidade' as descricao,
    '#F59E0B' as cor,
    2 as ordem,
    NOW() as created_at,
    NOW() as updated_at
FROM public.pipelines p
WHERE p.workspace_id = 'default-workspace-id' AND p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem, created_at, updated_at)
SELECT 
    p.id as pipeline_id,
    'Proposta' as nome,
    'Envio da proposta comercial' as descricao,
    '#10B981' as cor,
    3 as ordem,
    NOW() as created_at,
    NOW() as updated_at
FROM public.pipelines p
WHERE p.workspace_id = 'default-workspace-id' AND p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem, created_at, updated_at)
SELECT 
    p.id as pipeline_id,
    'Negociação' as nome,
    'Negociação dos termos' as descricao,
    '#8B5CF6' as cor,
    4 as ordem,
    NOW() as created_at,
    NOW() as updated_at
FROM public.pipelines p
WHERE p.workspace_id = 'default-workspace-id' AND p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem, created_at, updated_at)
SELECT 
    p.id as pipeline_id,
    'Fechado' as nome,
    'Negócio fechado com sucesso' as descricao,
    '#059669' as cor,
    5 as ordem,
    NOW() as created_at,
    NOW() as updated_at
FROM public.pipelines p
WHERE p.workspace_id = 'default-workspace-id' AND p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

-- 5. Criar alguns clientes de exemplo
INSERT INTO public.clientes (workspace_id, nome_fant, razao_social, email, telefone, status, created_at, updated_at)
VALUES 
    ('default-workspace-id', 'Empresa ABC Ltda', 'Empresa ABC Ltda', 'contato@empresaabc.com.br', '(11) 99999-9999', 'ativo', NOW(), NOW()),
    ('default-workspace-id', 'Tech Solutions', 'Tech Solutions Ltda', 'contato@techsolutions.com.br', '(11) 88888-8888', 'ativo', NOW(), NOW()),
    ('default-workspace-id', 'Digital Marketing Pro', 'Digital Marketing Pro Ltda', 'contato@digitalmarketingpro.com.br', '(11) 77777-7777', 'prospecto', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 6. Criar alguns negócios de exemplo
INSERT INTO public.negocios (workspace_id, cliente_id, pipeline_id, etapa_id, titulo, descricao, valor, probabilidade, created_at, updated_at)
SELECT 
    'default-workspace-id' as workspace_id,
    c.id as cliente_id,
    p.id as pipeline_id,
    e.id as etapa_id,
    'Desenvolvimento de Website' as titulo,
    'Criação de website institucional responsivo' as descricao,
    15000.00 as valor,
    80 as probabilidade,
    NOW() as created_at,
    NOW() as updated_at
FROM public.clientes c
CROSS JOIN public.pipelines p
CROSS JOIN public.pipeline_etapas e
WHERE c.workspace_id = 'default-workspace-id' 
AND c.nome_fant = 'Empresa ABC Ltda'
AND p.workspace_id = 'default-workspace-id' 
AND p.nome = 'Vendas'
AND e.pipeline_id = p.id 
AND e.nome = 'Proposta'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.negocios (workspace_id, cliente_id, pipeline_id, etapa_id, titulo, descricao, valor, probabilidade, created_at, updated_at)
SELECT 
    'default-workspace-id' as workspace_id,
    c.id as cliente_id,
    p.id as pipeline_id,
    e.id as etapa_id,
    'Marketing Digital' as titulo,
    'Campanha completa de marketing digital' as descricao,
    8000.00 as valor,
    60 as probabilidade,
    NOW() as created_at,
    NOW() as updated_at
FROM public.clientes c
CROSS JOIN public.pipelines p
CROSS JOIN public.pipeline_etapas e
WHERE c.workspace_id = 'default-workspace-id' 
AND c.nome_fant = 'Tech Solutions'
AND p.workspace_id = 'default-workspace-id' 
AND p.nome = 'Vendas'
AND e.pipeline_id = p.id 
AND e.nome = 'Qualificação'
LIMIT 1
ON CONFLICT DO NOTHING;

-- 7. Verificar se tudo foi criado
SELECT 'Workspace padrão criado com sucesso!' as status;
SELECT COUNT(*) as total_workspaces FROM public.workspaces WHERE id = 'default-workspace-id';
SELECT COUNT(*) as total_membros FROM public.membros WHERE workspace_id = 'default-workspace-id';
SELECT COUNT(*) as total_pipelines FROM public.pipelines WHERE workspace_id = 'default-workspace-id';
SELECT COUNT(*) as total_etapas FROM public.pipeline_etapas pe 
JOIN public.pipelines p ON p.id = pe.pipeline_id 
WHERE p.workspace_id = 'default-workspace-id';
SELECT COUNT(*) as total_clientes FROM public.clientes WHERE workspace_id = 'default-workspace-id';
SELECT COUNT(*) as total_negocios FROM public.negocios WHERE workspace_id = 'default-workspace-id'; 