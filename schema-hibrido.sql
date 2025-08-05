-- Schema Híbrido: Própria Empresa + Gestão de Clientes
-- Execute este código no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Workspaces (Tenants/Multi-empresas)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Membros (Usuários dos Workspaces)
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

-- 3. Tabela de Empresas Próprias (Dados da própria empresa)
CREATE TABLE public.empresas_proprias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj TEXT UNIQUE,
    inscricao_estadual TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Clientes (Empresas Clientes)
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

-- 5. Tabela de Contatos (Pessoas dos Clientes)
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

-- 6. Tabela de Cobranças
CREATE TABLE public.cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    contato_id UUID REFERENCES public.contatos(id),
    numero_nota TEXT,
    valor DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida', 'cancelada')),
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    forma_pagamento TEXT,
    observacoes TEXT,
    stripe_invoice_id TEXT,
    nfse_status TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabela de Despesas
CREATE TABLE public.despesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    descricao TEXT NOT NULL,
    categoria TEXT,
    valor DECIMAL(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida')),
    fornecedor TEXT,
    forma_pagamento TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

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

CREATE TRIGGER on_cobrancas_updated
    BEFORE UPDATE ON public.cobrancas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_despesas_updated
    BEFORE UPDATE ON public.despesas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar workspace automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
    workspace_id UUID;
    empresa_id UUID;
BEGIN
    -- Criar workspace baseado no nome do usuário
    INSERT INTO public.workspaces (nome)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'workspace_name', 'Workspace ' || NEW.raw_user_meta_data->>'name')
    ) RETURNING id INTO workspace_id;

    -- Adicionar usuário como admin do workspace
    INSERT INTO public.membros (workspace_id, user_id, role, permissions)
    VALUES (
        workspace_id,
        NEW.id,
        'admin',
        '{"financeiro": true, "vendas": true, "estoque": true, "relatorios": true}'
    );

    -- Criar empresa própria baseada nos dados do usuário
    INSERT INTO public.empresas_proprias (workspace_id, razao_social, nome_fantasia, cnpj, email)
    VALUES (
        workspace_id,
        COALESCE(NEW.raw_user_meta_data->>'razao_social', 'Empresa ' || NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'nome_fantasia', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'cnpj',
        NEW.email
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar workspace automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created_workspace ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_workspace();

-- HABILITAR ROW LEVEL SECURITY (RLS) E CRIAR POLÍTICAS

-- Políticas para workspaces
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver apenas seus workspaces"
ON public.workspaces FOR SELECT
USING (
    id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

CREATE POLICY "Apenas admins podem gerenciar workspaces"
ON public.workspaces FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.membros 
        WHERE workspace_id = workspaces.id 
        AND user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Políticas para membros
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver membros de seus workspaces"
ON public.membros FOR SELECT
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

CREATE POLICY "Apenas admins podem gerenciar membros"
ON public.membros FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.membros 
        WHERE workspace_id = membros.workspace_id 
        AND user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Políticas para empresas próprias
ALTER TABLE public.empresas_proprias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver empresas de seus workspaces"
ON public.empresas_proprias FOR SELECT
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

CREATE POLICY "Apenas admins podem gerenciar empresas próprias"
ON public.empresas_proprias FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.membros 
        WHERE workspace_id = empresas_proprias.workspace_id 
        AND user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Políticas para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem acessar clientes de seus workspaces"
ON public.clientes FOR ALL
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
)
WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

-- Políticas para contatos
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem acessar contatos de seus workspaces"
ON public.contatos FOR ALL
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
)
WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

-- Políticas para cobranças
ALTER TABLE public.cobrancas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem acessar cobranças de seus workspaces"
ON public.cobrancas FOR ALL
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
)
WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

-- Políticas para despesas
ALTER TABLE public.despesas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem acessar despesas de seus workspaces"
ON public.despesas FOR ALL
USING (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
)
WITH CHECK (
    workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
);

-- Funções auxiliares

-- Função para obter dados da empresa própria do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_empresa()
RETURNS TABLE (
    empresa_id UUID,
    workspace_id UUID,
    razao_social TEXT,
    nome_fantasia TEXT,
    cnpj TEXT,
    inscricao_estadual TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    user_role TEXT,
    user_permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ep.id,
        ep.workspace_id,
        ep.razao_social,
        ep.nome_fantasia,
        ep.cnpj,
        ep.inscricao_estadual,
        ep.email,
        ep.telefone,
        ep.endereco,
        m.role,
        m.permissions
    FROM public.empresas_proprias ep
    INNER JOIN public.membros m ON ep.workspace_id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter usuários do workspace atual
CREATE OR REPLACE FUNCTION public.get_workspace_usuarios()
RETURNS TABLE (
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    role TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.user_id,
        u.email,
        u.raw_user_meta_data->>'name' as user_name,
        m.role,
        m.permissions,
        m.created_at,
        u.last_sign_in_at
    FROM public.membros m
    INNER JOIN auth.users u ON m.user_id = u.id
    WHERE m.workspace_id = (
        SELECT workspace_id FROM public.get_user_empresa()
    )
    AND m.is_active = true
    ORDER BY m.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar dados da empresa própria
CREATE OR REPLACE FUNCTION public.update_empresa_data(
    p_razao_social TEXT DEFAULT NULL,
    p_nome_fantasia TEXT DEFAULT NULL,
    p_cnpj TEXT DEFAULT NULL,
    p_inscricao_estadual TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_telefone TEXT DEFAULT NULL,
    p_endereco TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    empresa_id UUID;
BEGIN
    -- Obter ID da empresa do usuário atual
    SELECT ep.id INTO empresa_id
    FROM public.empresas_proprias ep
    INNER JOIN public.membros m ON ep.workspace_id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.role = 'admin' AND m.is_active = true
    LIMIT 1;

    IF empresa_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Atualizar dados da empresa
    UPDATE public.empresas_proprias SET
        razao_social = COALESCE(p_razao_social, razao_social),
        nome_fantasia = COALESCE(p_nome_fantasia, nome_fantasia),
        cnpj = COALESCE(p_cnpj, cnpj),
        inscricao_estadual = COALESCE(p_inscricao_estadual, inscricao_estadual),
        email = COALESCE(p_email, email),
        telefone = COALESCE(p_telefone, telefone),
        endereco = COALESCE(p_endereco, endereco)
    WHERE id = empresa_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON TABLE public.workspaces IS 'Workspaces/Multi-empresas do sistema';
COMMENT ON TABLE public.membros IS 'Usuários dos workspaces';
COMMENT ON TABLE public.empresas_proprias IS 'Dados da própria empresa';
COMMENT ON TABLE public.clientes IS 'Empresas clientes';
COMMENT ON TABLE public.contatos IS 'Contatos dos clientes';
COMMENT ON TABLE public.cobrancas IS 'Contas a receber';
COMMENT ON TABLE public.despesas IS 'Contas a pagar';

-- Verificar se tudo foi criado corretamente
SELECT 'Schema híbrido executado com sucesso!' as status; 