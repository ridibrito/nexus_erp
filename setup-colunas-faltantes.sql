-- =====================================================
-- ADICIONAR COLUNAS FALTANTES NAS TABELAS EXISTENTES
-- =====================================================

-- 1. Verificar e adicionar colunas na tabela pipeline_etapas
DO $$
BEGIN
    -- Verificar se a coluna descricao existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipeline_etapas' 
        AND column_name = 'descricao'
    ) THEN
        ALTER TABLE public.pipeline_etapas ADD COLUMN descricao TEXT;
        RAISE NOTICE 'Coluna descricao adicionada à tabela pipeline_etapas';
    ELSE
        RAISE NOTICE 'Coluna descricao já existe na tabela pipeline_etapas';
    END IF;

    -- Verificar se a coluna cor existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipeline_etapas' 
        AND column_name = 'cor'
    ) THEN
        ALTER TABLE public.pipeline_etapas ADD COLUMN cor VARCHAR(7) DEFAULT '#6B7280';
        RAISE NOTICE 'Coluna cor adicionada à tabela pipeline_etapas';
    ELSE
        RAISE NOTICE 'Coluna cor já existe na tabela pipeline_etapas';
    END IF;

    -- Verificar se a coluna ordem existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipeline_etapas' 
        AND column_name = 'ordem'
    ) THEN
        ALTER TABLE public.pipeline_etapas ADD COLUMN ordem INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'Coluna ordem adicionada à tabela pipeline_etapas';
    ELSE
        RAISE NOTICE 'Coluna ordem já existe na tabela pipeline_etapas';
    END IF;
END $$;

-- 2. Verificar e adicionar colunas na tabela pipelines
DO $$
BEGIN
    -- Verificar se a coluna descricao existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipelines' 
        AND column_name = 'descricao'
    ) THEN
        ALTER TABLE public.pipelines ADD COLUMN descricao TEXT;
        RAISE NOTICE 'Coluna descricao adicionada à tabela pipelines';
    ELSE
        RAISE NOTICE 'Coluna descricao já existe na tabela pipelines';
    END IF;

    -- Verificar se a coluna cor existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipelines' 
        AND column_name = 'cor'
    ) THEN
        ALTER TABLE public.pipelines ADD COLUMN cor VARCHAR(7) DEFAULT '#3B82F6';
        RAISE NOTICE 'Coluna cor adicionada à tabela pipelines';
    ELSE
        RAISE NOTICE 'Coluna cor já existe na tabela pipelines';
    END IF;
END $$;

-- 3. Verificar e adicionar colunas na tabela negocios
DO $$
BEGIN
    -- Verificar se a coluna descricao existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'descricao'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN descricao TEXT;
        RAISE NOTICE 'Coluna descricao adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna descricao já existe na tabela negocios';
    END IF;

    -- Verificar se a coluna valor existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'valor'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN valor DECIMAL(15,2);
        RAISE NOTICE 'Coluna valor adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna valor já existe na tabela negocios';
    END IF;

    -- Verificar se a coluna probabilidade existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'probabilidade'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN probabilidade INTEGER DEFAULT 50;
        RAISE NOTICE 'Coluna probabilidade adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna probabilidade já existe na tabela negocios';
    END IF;

    -- Verificar se a coluna data_prevista_fechamento existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'data_prevista_fechamento'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN data_prevista_fechamento DATE;
        RAISE NOTICE 'Coluna data_prevista_fechamento adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna data_prevista_fechamento já existe na tabela negocios';
    END IF;

    -- Verificar se a coluna observacoes existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN observacoes TEXT;
        RAISE NOTICE 'Coluna observacoes adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna observacoes já existe na tabela negocios';
    END IF;
END $$;

-- 4. Verificar e adicionar colunas na tabela clientes
DO $$
BEGIN
    -- Verificar se a coluna endereco existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes' 
        AND column_name = 'endereco'
    ) THEN
        ALTER TABLE public.clientes ADD COLUMN endereco JSONB DEFAULT '{}';
        RAISE NOTICE 'Coluna endereco adicionada à tabela clientes';
    ELSE
        RAISE NOTICE 'Coluna endereco já existe na tabela clientes';
    END IF;

    -- Verificar se a coluna observacoes existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes' 
        AND column_name = 'observacoes'
    ) THEN
        ALTER TABLE public.clientes ADD COLUMN observacoes TEXT;
        RAISE NOTICE 'Coluna observacoes adicionada à tabela clientes';
    ELSE
        RAISE NOTICE 'Coluna observacoes já existe na tabela clientes';
    END IF;
END $$;

-- 5. Verificar e adicionar colunas na tabela membros
DO $$
BEGIN
    -- Verificar se a coluna permissoes existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'membros' 
        AND column_name = 'permissoes'
    ) THEN
        ALTER TABLE public.membros ADD COLUMN permissoes JSONB DEFAULT '{}';
        RAISE NOTICE 'Coluna permissoes adicionada à tabela membros';
    ELSE
        RAISE NOTICE 'Coluna permissoes já existe na tabela membros';
    END IF;

    -- Verificar se a coluna is_active existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'membros' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.membros ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Coluna is_active adicionada à tabela membros';
    ELSE
        RAISE NOTICE 'Coluna is_active já existe na tabela membros';
    END IF;
END $$;

-- 6. Inserir dados iniciais (apenas se não existirem)
-- Workspace padrão
INSERT INTO public.workspaces (nome) 
VALUES ('Nexus ERP')
ON CONFLICT DO NOTHING;

-- Membro inicial
INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active)
SELECT 
    w.id as workspace_id,
    u.id as user_id,
    'Ricardo Admin' as nome,
    'ricardo@coruss.com.br' as email,
    'Administrador' as cargo,
    true as is_active
FROM public.workspaces w
CROSS JOIN auth.users u
WHERE u.email = 'ricardo@coruss.com.br'
LIMIT 1
ON CONFLICT (user_id, workspace_id) DO NOTHING;

-- Pipeline padrão
INSERT INTO public.pipelines (workspace_id, nome, descricao, cor)
SELECT 
    w.id as workspace_id,
    'Vendas' as nome,
    'Pipeline de vendas padrão' as descricao,
    '#3B82F6' as cor
FROM public.workspaces w
LIMIT 1
ON CONFLICT DO NOTHING;

-- Etapas do pipeline
INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem)
SELECT 
    p.id as pipeline_id,
    'Prospecção' as nome,
    'Primeiro contato com o cliente' as descricao,
    '#6B7280' as cor,
    1 as ordem
FROM public.pipelines p
WHERE p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem)
SELECT 
    p.id as pipeline_id,
    'Qualificação' as nome,
    'Avaliação da oportunidade' as descricao,
    '#F59E0B' as cor,
    2 as ordem
FROM public.pipelines p
WHERE p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem)
SELECT 
    p.id as pipeline_id,
    'Proposta' as nome,
    'Envio da proposta comercial' as descricao,
    '#10B981' as cor,
    3 as ordem
FROM public.pipelines p
WHERE p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem)
SELECT 
    p.id as pipeline_id,
    'Negociação' as nome,
    'Negociação dos termos' as descricao,
    '#8B5CF6' as cor,
    4 as ordem
FROM public.pipelines p
WHERE p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem)
SELECT 
    p.id as pipeline_id,
    'Fechado' as nome,
    'Negócio fechado com sucesso' as descricao,
    '#059669' as cor,
    5 as ordem
FROM public.pipelines p
WHERE p.nome = 'Vendas'
ON CONFLICT DO NOTHING;

-- 7. Verificar resultado
SELECT 'Colunas adicionadas com sucesso!' as status;
SELECT 'Tabelas e colunas:' as info;
SELECT 
    table_name,
    string_agg(column_name, ', ' ORDER BY column_name) as colunas
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('workspaces', 'membros', 'clientes', 'pipelines', 'pipeline_etapas', 'negocios')
GROUP BY table_name
ORDER BY table_name; 