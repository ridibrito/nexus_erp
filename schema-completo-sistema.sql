-- Schema Completo do Sistema ERP Nexus
-- Execute este código no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. ESTRUTURA BASE (Workspaces e Usuários)
-- =====================================================

-- Tabela de Workspaces (Multi-empresas)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Membros (Usuários dos Workspaces)
CREATE TABLE public.membros (
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'membro' CHECK (role IN ('admin', 'membro')),
    permissions JSONB DEFAULT '{"financeiro": false, "vendas": false, "estoque": false, "relatorios": false}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (workspace_id, user_id)
);

-- Tabela de Convites para Novos Usuários
CREATE TABLE public.convites_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'membro' CHECK (role IN ('admin', 'membro')),
    permissions JSONB DEFAULT '{"financeiro": false, "vendas": false, "estoque": false, "relatorios": false}',
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 2. DADOS DA EMPRESA PRÓPRIA
-- =====================================================

-- Tabela de Empresas Próprias
CREATE TABLE public.empresas_proprias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj TEXT UNIQUE,
    inscricao_estadual TEXT,
    inscricao_municipal TEXT,
    email TEXT,
    telefone TEXT,
    endereco JSONB,
    certificado_path TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. GESTÃO DE CLIENTES
-- =====================================================

-- Tabela de Clientes
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome_fantasia TEXT NOT NULL,
    razao_social TEXT,
    cnpj TEXT,
    inscricao_estadual TEXT,
    email TEXT,
    telefone TEXT,
    endereco JSONB,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'prospecto')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Contatos dos Clientes
CREATE TABLE public.contatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    cargo TEXT,
    is_contato_principal BOOLEAN DEFAULT false,
    is_contato_cobranca BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 4. SISTEMA DE NEGÓCIOS (CRM)
-- =====================================================

-- Tabela de Pipelines
CREATE TABLE public.pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT DEFAULT '#3B82F6',
    is_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Etapas dos Pipelines
CREATE TABLE public.pipeline_etapas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    cor TEXT DEFAULT '#6B7280',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Negócios
CREATE TABLE public.negocios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    contato_id UUID REFERENCES public.contatos(id),
    pipeline_id UUID REFERENCES public.pipelines(id) ON DELETE CASCADE NOT NULL,
    etapa_id UUID REFERENCES public.pipeline_etapas(id) ON DELETE CASCADE NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    valor DECIMAL(10, 2) NOT NULL,
    probabilidade INTEGER DEFAULT 0 CHECK (probabilidade >= 0 AND probabilidade <= 100),
    responsavel_id UUID REFERENCES auth.users(id),
    proximo_contato DATE,
    data_fechamento DATE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'ganho', 'perdido', 'cancelado')),
    prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 5. SISTEMA FINANCEIRO
-- =====================================================

-- Tabela de Cobranças
CREATE TABLE public.cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    contato_id UUID REFERENCES public.contatos(id),
    negocio_id UUID REFERENCES public.negocios(id),
    numero_nota TEXT,
    valor DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida', 'cancelada')),
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    forma_pagamento TEXT,
    stripe_invoice_id TEXT,
    stripe_hosted_invoice_url TEXT,
    nfse_status TEXT DEFAULT 'pendente' CHECK (nfse_status IN ('pendente', 'solicitada', 'emitida', 'erro')),
    nfse_id TEXT,
    nfse_url_pdf TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Contas a Pagar
CREATE TABLE public.contas_a_pagar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    categoria_id UUID,
    fornecedor TEXT,
    data_vencimento DATE NOT NULL,
    status TEXT DEFAULT 'a_pagar' CHECK (status IN ('a_pagar', 'paga', 'cancelada')),
    data_pagamento DATE,
    forma_pagamento TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Movimentações Bancárias
CREATE TABLE public.movimentacoes_bancarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    conta_bancaria_id UUID,
    tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida')),
    descricao TEXT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_movimentacao DATE NOT NULL,
    categoria_id UUID,
    cobranca_id UUID REFERENCES public.cobrancas(id),
    conta_pagar_id UUID REFERENCES public.contas_a_pagar(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 6. SISTEMA DE PROJETOS E SERVIÇOS
-- =====================================================

-- Tabela de Categorias de Serviços
CREATE TABLE public.categorias_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Serviços
CREATE TABLE public.servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    categoria_id UUID REFERENCES public.categorias_servicos(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    valor_padrao DECIMAL(10, 2),
    is_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Projetos
CREATE TABLE public.projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    negocio_id UUID REFERENCES public.negocios(id),
    nome TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE,
    data_fim DATE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado', 'pausado')),
    valor_total DECIMAL(10, 2),
    responsavel_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Itens do Projeto
CREATE TABLE public.projeto_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE CASCADE NOT NULL,
    servico_id UUID REFERENCES public.servicos(id),
    descricao TEXT NOT NULL,
    quantidade DECIMAL(10, 2) DEFAULT 1,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 7. SISTEMA DE CONTRATOS
-- =====================================================

-- Tabela de Contratos
CREATE TABLE public.contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    projeto_id UUID REFERENCES public.projetos(id),
    numero_contrato TEXT UNIQUE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    valor_total DECIMAL(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'concluido', 'cancelado', 'suspenso')),
    tipo_pagamento TEXT CHECK (tipo_pagamento IN ('unico', 'parcelado', 'recorrente')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Parcelas do Contrato
CREATE TABLE public.contrato_parcelas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE NOT NULL,
    numero_parcela INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida')),
    cobranca_id UUID REFERENCES public.cobrancas(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 8. SISTEMA DE NFS-E
-- =====================================================

-- Tabela de NFS-e
CREATE TABLE public.nfse (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cobranca_id UUID REFERENCES public.cobrancas(id) ON DELETE CASCADE NOT NULL,
    numero_nfse TEXT UNIQUE,
    codigo_verificacao TEXT,
    data_emissao DATE NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'emitida', 'cancelada', 'erro')),
    url_pdf TEXT,
    xml_content TEXT,
    sefaz_response JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 9. SISTEMA DE CATEGORIAS E CONFIGURAÇÕES
-- =====================================================

-- Tabela de Categorias Financeiras
CREATE TABLE public.categorias_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
    descricao TEXT,
    cor TEXT DEFAULT '#6B7280',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Formas de Pagamento
CREATE TABLE public.formas_pagamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    is_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Condições de Pagamento
CREATE TABLE public.condicoes_pagamento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    dias_vencimento INTEGER DEFAULT 0,
    is_ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 10. TRIGGERS E FUNÇÕES
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER on_workspaces_updated
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_membros_updated
    BEFORE UPDATE ON public.membros
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_empresas_proprias_updated
    BEFORE UPDATE ON public.empresas_proprias
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_clientes_updated
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_contatos_updated
    BEFORE UPDATE ON public.contatos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_pipelines_updated
    BEFORE UPDATE ON public.pipelines
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_pipeline_etapas_updated
    BEFORE UPDATE ON public.pipeline_etapas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_negocios_updated
    BEFORE UPDATE ON public.negocios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_cobrancas_updated
    BEFORE UPDATE ON public.cobrancas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_contas_a_pagar_updated
    BEFORE UPDATE ON public.contas_a_pagar
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_movimentacoes_bancarias_updated
    BEFORE UPDATE ON public.movimentacoes_bancarias
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_categorias_servicos_updated
    BEFORE UPDATE ON public.categorias_servicos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_servicos_updated
    BEFORE UPDATE ON public.servicos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_projetos_updated
    BEFORE UPDATE ON public.projetos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_projeto_itens_updated
    BEFORE UPDATE ON public.projeto_itens
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_contratos_updated
    BEFORE UPDATE ON public.contratos
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_contrato_parcelas_updated
    BEFORE UPDATE ON public.contrato_parcelas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_nfse_updated
    BEFORE UPDATE ON public.nfse
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_categorias_financeiras_updated
    BEFORE UPDATE ON public.categorias_financeiras
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_formas_pagamento_updated
    BEFORE UPDATE ON public.formas_pagamento
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_condicoes_pagamento_updated
    BEFORE UPDATE ON public.condicoes_pagamento
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 11. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para criar workspace automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
    workspace_id UUID;
BEGIN
    -- Criar workspace para o novo usuário
    INSERT INTO public.workspaces (nome)
    VALUES ('Workspace ' || COALESCE(NEW.raw_user_meta_data->>'name', NEW.email))
    RETURNING id INTO workspace_id;

    -- Adicionar usuário como admin do workspace
    INSERT INTO public.membros (workspace_id, user_id, role, permissions)
    VALUES (
        workspace_id,
        NEW.id,
        'admin',
        '{"financeiro": true, "vendas": true, "estoque": true, "relatorios": true}'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar workspace automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created_workspace ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_workspace();

-- Função para obter dados do workspace do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_workspace()
RETURNS TABLE (
    workspace_id UUID,
    workspace_nome TEXT,
    user_role TEXT,
    user_permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.nome,
        m.role,
        m.permissions
    FROM public.workspaces w
    INNER JOIN public.membros m ON w.id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 12. POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contas_a_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contrato_parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condicoes_pagamento ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (exemplo para algumas tabelas)
-- Workspaces: usuários podem ver apenas seus workspaces
CREATE POLICY "Users can view their workspaces" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = workspaces.id AND m.user_id = auth.uid()
        )
    );

-- Membros: usuários podem ver membros de seus workspaces
CREATE POLICY "Users can view workspace members" ON public.membros
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = membros.workspace_id AND m.user_id = auth.uid()
        )
    );

-- Clientes: usuários podem ver clientes de seus workspaces
CREATE POLICY "Users can view workspace clients" ON public.clientes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = clientes.workspace_id AND m.user_id = auth.uid()
        )
    );

-- =====================================================
-- 13. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes
CREATE INDEX idx_membros_user_id ON public.membros(user_id);
CREATE INDEX idx_membros_workspace_id ON public.membros(workspace_id);
CREATE INDEX idx_clientes_workspace_id ON public.clientes(workspace_id);
CREATE INDEX idx_contatos_cliente_id ON public.contatos(cliente_id);
CREATE INDEX idx_negocios_workspace_id ON public.negocios(workspace_id);
CREATE INDEX idx_negocios_cliente_id ON public.negocios(cliente_id);
CREATE INDEX idx_negocios_etapa_id ON public.negocios(etapa_id);
CREATE INDEX idx_cobrancas_workspace_id ON public.cobrancas(workspace_id);
CREATE INDEX idx_cobrancas_cliente_id ON public.cobrancas(cliente_id);
CREATE INDEX idx_cobrancas_status ON public.cobrancas(status);
CREATE INDEX idx_cobrancas_data_vencimento ON public.cobrancas(data_vencimento);
CREATE INDEX idx_contas_a_pagar_workspace_id ON public.contas_a_pagar(workspace_id);
CREATE INDEX idx_contas_a_pagar_status ON public.contas_a_pagar(status);
CREATE INDEX idx_contas_a_pagar_data_vencimento ON public.contas_a_pagar(data_vencimento);

-- =====================================================
-- 14. COMENTÁRIOS E DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.workspaces IS 'Workspaces (multi-empresas) do sistema';
COMMENT ON TABLE public.membros IS 'Usuários associados aos workspaces';
COMMENT ON TABLE public.empresas_proprias IS 'Dados da empresa própria do workspace';
COMMENT ON TABLE public.clientes IS 'Clientes cadastrados no workspace';
COMMENT ON TABLE public.contatos IS 'Contatos dos clientes';
COMMENT ON TABLE public.pipelines IS 'Pipelines de vendas/negócios';
COMMENT ON TABLE public.pipeline_etapas IS 'Etapas dos pipelines';
COMMENT ON TABLE public.negocios IS 'Negócios/oportunidades de vendas';
COMMENT ON TABLE public.cobrancas IS 'Cobranças geradas para clientes';
COMMENT ON TABLE public.contas_a_pagar IS 'Contas a pagar da empresa';
COMMENT ON TABLE public.movimentacoes_bancarias IS 'Movimentações bancárias';
COMMENT ON TABLE public.categorias_servicos IS 'Categorias de serviços oferecidos';
COMMENT ON TABLE public.servicos IS 'Serviços cadastrados';
COMMENT ON TABLE public.projetos IS 'Projetos para clientes';
COMMENT ON TABLE public.projeto_itens IS 'Itens dos projetos';
COMMENT ON TABLE public.contratos IS 'Contratos com clientes';
COMMENT ON TABLE public.contrato_parcelas IS 'Parcelas dos contratos';
COMMENT ON TABLE public.nfse IS 'Notas fiscais de serviço eletrônicas';
COMMENT ON TABLE public.categorias_financeiras IS 'Categorias para receitas e despesas';
COMMENT ON TABLE public.formas_pagamento IS 'Formas de pagamento aceitas';
COMMENT ON TABLE public.condicoes_pagamento IS 'Condições de pagamento';

-- =====================================================
-- 15. VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Schema completo do sistema ERP Nexus criado com sucesso!' as status;
SELECT COUNT(*) as total_tabelas FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'; 