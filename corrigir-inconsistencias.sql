-- =====================================================
-- CORRIGIR INCONSISTÊNCIAS NAS TABELAS EXISTENTES
-- =====================================================

-- 1. Corrigir tabela negocios - adicionar colunas faltantes
DO $$
BEGIN
    -- Adicionar pipeline_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'pipeline_id'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN pipeline_id UUID REFERENCES public.pipelines(id);
        RAISE NOTICE 'Coluna pipeline_id adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna pipeline_id já existe na tabela negocios';
    END IF;

    -- Adicionar etapa_id se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'etapa_id'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN etapa_id UUID REFERENCES public.pipeline_etapas(id);
        RAISE NOTICE 'Coluna etapa_id adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna etapa_id já existe na tabela negocios';
    END IF;

    -- Adicionar descricao se não existir
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

    -- Adicionar valor se não existir
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

    -- Adicionar probabilidade se não existir
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

    -- Adicionar observacoes se não existir
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

-- 2. Remover coluna is_ativo da tabela pipelines (se existir)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pipelines' 
        AND column_name = 'is_ativo'
    ) THEN
        ALTER TABLE public.pipelines DROP COLUMN is_ativo;
        RAISE NOTICE 'Coluna is_ativo removida da tabela pipelines';
    ELSE
        RAISE NOTICE 'Coluna is_ativo não existe na tabela pipelines';
    END IF;
END $$;

-- 3. Corrigir tabela membros - remover coluna duplicada
DO $$
BEGIN
    -- Verificar se existe permissions (coluna em inglês)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'membros' 
        AND column_name = 'permissions'
    ) THEN
        -- Se permissions existe e permissoes também, remover permissions
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'membros' 
            AND column_name = 'permissoes'
        ) THEN
            ALTER TABLE public.membros DROP COLUMN permissions;
            RAISE NOTICE 'Coluna permissions removida (mantendo permissoes)';
        ELSE
            -- Se só permissions existe, renomear para permissoes
            ALTER TABLE public.membros RENAME COLUMN permissions TO permissoes;
            RAISE NOTICE 'Coluna permissions renomeada para permissoes';
        END IF;
    ELSE
        RAISE NOTICE 'Coluna permissions não existe na tabela membros';
    END IF;
END $$;

-- 4. Adicionar workspace_id na tabela negocios se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'workspace_id'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN workspace_id UUID REFERENCES public.workspaces(id);
        RAISE NOTICE 'Coluna workspace_id adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna workspace_id já existe na tabela negocios';
    END IF;
END $$;

-- 5. Adicionar updated_at nas tabelas que não têm
DO $$
BEGIN
    -- negocios
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'negocios' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.negocios ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Coluna updated_at adicionada à tabela negocios';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela negocios';
    END IF;

    -- clientes
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'clientes' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.clientes ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Coluna updated_at adicionada à tabela clientes';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela clientes';
    END IF;

    -- membros
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'membros' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.membros ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Coluna updated_at adicionada à tabela membros';
    ELSE
        RAISE NOTICE 'Coluna updated_at já existe na tabela membros';
    END IF;
END $$;

-- 6. Verificar resultado final
SELECT 'Inconsistências corrigidas com sucesso!' as status;
SELECT 'Estrutura final das tabelas:' as info;
SELECT 
    table_name,
    string_agg(column_name, ', ' ORDER BY column_name) as colunas
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('workspaces', 'membros', 'clientes', 'pipelines', 'pipeline_etapas', 'negocios')
GROUP BY table_name
ORDER BY table_name; 