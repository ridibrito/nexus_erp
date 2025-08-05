-- =====================================================
-- VERIFICAÇÃO E CRIAÇÃO DE TABELAS FALTANTES
-- =====================================================

-- 1. Verificar quais tabelas existem
DO $$
DECLARE
    tabela_existe BOOLEAN;
BEGIN
    -- Verificar workspaces
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'workspaces'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela workspaces...';
        CREATE TABLE public.workspaces (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            nome VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela workspaces já existe';
    END IF;

    -- Verificar membros
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'membros'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela membros...';
        CREATE TABLE public.membros (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
            user_id UUID NOT NULL,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            cargo VARCHAR(100),
            permissoes JSONB DEFAULT '{}',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela membros já existe';
    END IF;

    -- Verificar clientes
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'clientes'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela clientes...';
        CREATE TABLE public.clientes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
            razao_social VARCHAR(255) NOT NULL,
            nome_fantasia VARCHAR(255),
            cnpj VARCHAR(18),
            cpf VARCHAR(14),
            email VARCHAR(255),
            telefone VARCHAR(20),
            endereco JSONB DEFAULT '{}',
            observacoes TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela clientes já existe';
    END IF;

    -- Verificar pipelines
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'pipelines'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela pipelines...';
        CREATE TABLE public.pipelines (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
            nome VARCHAR(255) NOT NULL,
            descricao TEXT,
            cor VARCHAR(7) DEFAULT '#3B82F6',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela pipelines já existe';
    END IF;

    -- Verificar pipeline_etapas
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'pipeline_etapas'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela pipeline_etapas...';
        CREATE TABLE public.pipeline_etapas (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
            nome VARCHAR(255) NOT NULL,
            descricao TEXT,
            cor VARCHAR(7) DEFAULT '#6B7280',
            ordem INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela pipeline_etapas já existe';
    END IF;

    -- Verificar negocios
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'negocios'
    ) INTO tabela_existe;
    
    IF NOT tabela_existe THEN
        RAISE NOTICE 'Criando tabela negocios...';
        CREATE TABLE public.negocios (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
            cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
            pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE RESTRICT,
            etapa_id UUID NOT NULL REFERENCES public.pipeline_etapas(id) ON DELETE RESTRICT,
            titulo VARCHAR(255) NOT NULL,
            descricao TEXT,
            valor DECIMAL(15,2),
            probabilidade INTEGER DEFAULT 50,
            data_prevista_fechamento DATE,
            observacoes TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
        );
    ELSE
        RAISE NOTICE 'Tabela negocios já existe';
    END IF;

END $$;

-- 2. Criar trigger para updated_at (se não existir)
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Aplicar triggers (se não existirem)
DO $$
BEGIN
    -- Trigger para workspaces
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_workspaces_updated_at') THEN
        CREATE TRIGGER handle_workspaces_updated_at
            BEFORE UPDATE ON public.workspaces
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;

    -- Trigger para membros
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_membros_updated_at') THEN
        CREATE TRIGGER handle_membros_updated_at
            BEFORE UPDATE ON public.membros
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;

    -- Trigger para clientes
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_clientes_updated_at') THEN
        CREATE TRIGGER handle_clientes_updated_at
            BEFORE UPDATE ON public.clientes
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;

    -- Trigger para pipelines
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_pipelines_updated_at') THEN
        CREATE TRIGGER handle_pipelines_updated_at
            BEFORE UPDATE ON public.pipelines
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;

    -- Trigger para pipeline_etapas
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_pipeline_etapas_updated_at') THEN
        CREATE TRIGGER handle_pipeline_etapas_updated_at
            BEFORE UPDATE ON public.pipeline_etapas
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;

    -- Trigger para negocios
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_negocios_updated_at') THEN
        CREATE TRIGGER handle_negocios_updated_at
            BEFORE UPDATE ON public.negocios
            FOR EACH ROW
            EXECUTE FUNCTION handle_updated_at();
    END IF;
END $$;

-- 4. Habilitar RLS em todas as tabelas
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS básicas
DO $$
BEGIN
    -- Políticas para workspaces
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workspaces' AND policyname = 'Usuários podem ver workspaces') THEN
        CREATE POLICY "Usuários podem ver workspaces" ON public.workspaces FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workspaces' AND policyname = 'Usuários podem gerenciar workspaces') THEN
        CREATE POLICY "Usuários podem gerenciar workspaces" ON public.workspaces FOR ALL USING (true);
    END IF;

    -- Políticas para membros
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros' AND policyname = 'Usuários podem ver membros') THEN
        CREATE POLICY "Usuários podem ver membros" ON public.membros FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'membros' AND policyname = 'Usuários podem gerenciar membros') THEN
        CREATE POLICY "Usuários podem gerenciar membros" ON public.membros FOR ALL USING (true);
    END IF;

    -- Políticas para clientes
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários podem ver clientes') THEN
        CREATE POLICY "Usuários podem ver clientes" ON public.clientes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clientes' AND policyname = 'Usuários podem gerenciar clientes') THEN
        CREATE POLICY "Usuários podem gerenciar clientes" ON public.clientes FOR ALL USING (true);
    END IF;

    -- Políticas para pipelines
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pipelines' AND policyname = 'Usuários podem ver pipelines') THEN
        CREATE POLICY "Usuários podem ver pipelines" ON public.pipelines FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pipelines' AND policyname = 'Usuários podem gerenciar pipelines') THEN
        CREATE POLICY "Usuários podem gerenciar pipelines" ON public.pipelines FOR ALL USING (true);
    END IF;

    -- Políticas para pipeline_etapas
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pipeline_etapas' AND policyname = 'Usuários podem ver pipeline_etapas') THEN
        CREATE POLICY "Usuários podem ver pipeline_etapas" ON public.pipeline_etapas FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pipeline_etapas' AND policyname = 'Usuários podem gerenciar pipeline_etapas') THEN
        CREATE POLICY "Usuários podem gerenciar pipeline_etapas" ON public.pipeline_etapas FOR ALL USING (true);
    END IF;

    -- Políticas para negocios
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'negocios' AND policyname = 'Usuários podem ver negocios') THEN
        CREATE POLICY "Usuários podem ver negocios" ON public.negocios FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'negocios' AND policyname = 'Usuários podem gerenciar negocios') THEN
        CREATE POLICY "Usuários podem gerenciar negocios" ON public.negocios FOR ALL USING (true);
    END IF;
END $$;

-- 6. Criar índices (se não existirem)
CREATE INDEX IF NOT EXISTS idx_membros_workspace_id ON public.membros(workspace_id);
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON public.membros(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_is_active ON public.membros(is_active);
CREATE INDEX IF NOT EXISTS idx_clientes_workspace_id ON public.clientes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipelines_workspace_id ON public.pipelines(workspace_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_etapas_pipeline_id ON public.pipeline_etapas(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_etapas_ordem ON public.pipeline_etapas(ordem);
CREATE INDEX IF NOT EXISTS idx_negocios_workspace_id ON public.negocios(workspace_id);
CREATE INDEX IF NOT EXISTS idx_negocios_cliente_id ON public.negocios(cliente_id);
CREATE INDEX IF NOT EXISTS idx_negocios_pipeline_id ON public.negocios(pipeline_id);
CREATE INDEX IF NOT EXISTS idx_negocios_etapa_id ON public.negocios(etapa_id);

-- 7. Inserir dados iniciais (apenas se não existirem)
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

-- 8. Verificar resultado
SELECT 'Setup de verificação realizado com sucesso!' as status;
SELECT 'Tabelas existentes:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('workspaces', 'membros', 'clientes', 'pipelines', 'pipeline_etapas', 'negocios') ORDER BY table_name; 