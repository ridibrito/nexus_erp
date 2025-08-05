-- Schema para Agência de Marketing - Serviços, Contratos e Cobranças
-- Execute este código no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Categorias de Serviços
CREATE TABLE IF NOT EXISTS public.categorias_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    cor TEXT DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Serviços
CREATE TABLE IF NOT EXISTS public.servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    categoria_id UUID REFERENCES public.categorias_servicos(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo_cobranca TEXT NOT NULL CHECK (tipo_cobranca IN ('recorrente', 'pontual', 'hora', 'projeto')),
    valor_base DECIMAL(10, 2) NOT NULL,
    unidade_cobranca TEXT CHECK (unidade_cobranca IN ('mes', 'ano', 'hora', 'projeto', 'unidade')),
    tempo_estimado_horas INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Contratos
CREATE TABLE IF NOT EXISTS public.contratos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    numero_contrato TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'cancelado', 'finalizado')),
    valor_total DECIMAL(10, 2) NOT NULL,
    forma_pagamento TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Itens do Contrato (Serviços vinculados)
CREATE TABLE IF NOT EXISTS public.contrato_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE CASCADE NOT NULL,
    servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE NOT NULL,
    quantidade DECIMAL(10, 2) DEFAULT 1,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    frequencia_cobranca TEXT CHECK (frequencia_cobranca IN ('mensal', 'trimestral', 'semestral', 'anual', 'unica')),
    data_primeira_cobranca DATE,
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabela de Projetos (Vendas Pontuais)
CREATE TABLE IF NOT EXISTS public.projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('proposta', 'aprovado', 'em_andamento', 'revisao', 'finalizado', 'cancelado')),
    data_inicio DATE,
    data_fim_prevista DATE,
    data_fim_real DATE,
    valor_total DECIMAL(10, 2) NOT NULL,
    valor_pago DECIMAL(10, 2) DEFAULT 0,
    percentual_conclusao INTEGER DEFAULT 0 CHECK (percentual_conclusao >= 0 AND percentual_conclusao <= 100),
    responsavel_id UUID REFERENCES auth.users(id),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Tabela de Itens do Projeto (Serviços vinculados)
CREATE TABLE IF NOT EXISTS public.projeto_servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE CASCADE NOT NULL,
    servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE NOT NULL,
    quantidade DECIMAL(10, 2) DEFAULT 1,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido')),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabela de Cobranças (Atualizada para agência)
CREATE TABLE IF NOT EXISTS public.cobrancas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    contrato_id UUID REFERENCES public.contratos(id) ON DELETE SET NULL,
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
    numero_nota TEXT,
    tipo_cobranca TEXT NOT NULL CHECK (tipo_cobranca IN ('recorrente', 'pontual', 'projeto')),
    descricao TEXT NOT NULL,
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

-- 8. Tabela de Despesas (Atualizada para agência)
CREATE TABLE IF NOT EXISTS public.despesas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    projeto_id UUID REFERENCES public.projetos(id) ON DELETE SET NULL,
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

-- Triggers para updated_at (apenas se não existirem)
DO $$
BEGIN
    -- Categorias de serviços
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_categorias_servicos_updated') THEN
        CREATE TRIGGER on_categorias_servicos_updated
            BEFORE UPDATE ON public.categorias_servicos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Serviços
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_servicos_updated') THEN
        CREATE TRIGGER on_servicos_updated
            BEFORE UPDATE ON public.servicos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Contratos
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_contratos_updated') THEN
        CREATE TRIGGER on_contratos_updated
            BEFORE UPDATE ON public.contratos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Contrato serviços
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_contrato_servicos_updated') THEN
        CREATE TRIGGER on_contrato_servicos_updated
            BEFORE UPDATE ON public.contrato_servicos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Projetos
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_projetos_updated') THEN
        CREATE TRIGGER on_projetos_updated
            BEFORE UPDATE ON public.projetos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    -- Projeto serviços
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_projeto_servicos_updated') THEN
        CREATE TRIGGER on_projeto_servicos_updated
            BEFORE UPDATE ON public.projeto_servicos
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- HABILITAR ROW LEVEL SECURITY (RLS) E CRIAR POLÍTICAS

-- Políticas para categorias de serviços
ALTER TABLE public.categorias_servicos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categorias_servicos' AND policyname = 'Usuários podem acessar categorias de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar categorias de seus workspaces"
        ON public.categorias_servicos FOR ALL
        USING (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        )
        WITH CHECK (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Políticas para serviços
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'servicos' AND policyname = 'Usuários podem acessar serviços de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar serviços de seus workspaces"
        ON public.servicos FOR ALL
        USING (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        )
        WITH CHECK (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Políticas para contratos
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contratos' AND policyname = 'Usuários podem acessar contratos de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar contratos de seus workspaces"
        ON public.contratos FOR ALL
        USING (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        )
        WITH CHECK (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Políticas para contrato serviços
ALTER TABLE public.contrato_servicos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contrato_servicos' AND policyname = 'Usuários podem acessar itens de contratos de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar itens de contratos de seus workspaces"
        ON public.contrato_servicos FOR ALL
        USING (
            contrato_id IN (
                SELECT c.id FROM public.contratos c
                WHERE c.workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
            )
        )
        WITH CHECK (
            contrato_id IN (
                SELECT c.id FROM public.contratos c
                WHERE c.workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
            )
        );
    END IF;
END $$;

-- Políticas para projetos
ALTER TABLE public.projetos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projetos' AND policyname = 'Usuários podem acessar projetos de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar projetos de seus workspaces"
        ON public.projetos FOR ALL
        USING (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        )
        WITH CHECK (
            workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
        );
    END IF;
END $$;

-- Políticas para projeto serviços
ALTER TABLE public.projeto_servicos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projeto_servicos' AND policyname = 'Usuários podem acessar itens de projetos de seus workspaces') THEN
        CREATE POLICY "Usuários podem acessar itens de projetos de seus workspaces"
        ON public.projeto_servicos FOR ALL
        USING (
            projeto_id IN (
                SELECT p.id FROM public.projetos p
                WHERE p.workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
            )
        )
        WITH CHECK (
            projeto_id IN (
                SELECT p.id FROM public.projetos p
                WHERE p.workspace_id IN (SELECT workspace_id FROM public.membros WHERE user_id = auth.uid())
            )
        );
    END IF;
END $$;

-- Funções auxiliares para agência

-- Função para obter serviços do workspace
CREATE OR REPLACE FUNCTION public.get_workspace_servicos()
RETURNS TABLE (
    id UUID,
    categoria_id UUID,
    categoria_nome TEXT,
    nome TEXT,
    descricao TEXT,
    tipo_cobranca TEXT,
    valor_base DECIMAL,
    unidade_cobranca TEXT,
    tempo_estimado_horas INTEGER,
    is_active BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.categoria_id,
        cs.nome as categoria_nome,
        s.nome,
        s.descricao,
        s.tipo_cobranca,
        s.valor_base,
        s.unidade_cobranca,
        s.tempo_estimado_horas,
        s.is_active
    FROM public.servicos s
    LEFT JOIN public.categorias_servicos cs ON s.categoria_id = cs.id
    WHERE s.workspace_id = (
        SELECT workspace_id FROM public.get_user_empresa()
    )
    AND s.is_active = true
    ORDER BY cs.nome, s.nome;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter contratos do workspace
CREATE OR REPLACE FUNCTION public.get_workspace_contratos()
RETURNS TABLE (
    id UUID,
    cliente_id UUID,
    cliente_nome TEXT,
    numero_contrato TEXT,
    titulo TEXT,
    data_inicio DATE,
    data_fim DATE,
    status TEXT,
    valor_total DECIMAL,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.cliente_id,
        cl.nome_fantasia as cliente_nome,
        c.numero_contrato,
        c.titulo,
        c.data_inicio,
        c.data_fim,
        c.status,
        c.valor_total,
        c.created_at
    FROM public.contratos c
    INNER JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE c.workspace_id = (
        SELECT workspace_id FROM public.get_user_empresa()
    )
    ORDER BY c.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter projetos do workspace
CREATE OR REPLACE FUNCTION public.get_workspace_projetos()
RETURNS TABLE (
    id UUID,
    cliente_id UUID,
    cliente_nome TEXT,
    contrato_id UUID,
    titulo TEXT,
    status TEXT,
    data_inicio DATE,
    data_fim_prevista DATE,
    valor_total DECIMAL,
    valor_pago DECIMAL,
    percentual_conclusao INTEGER,
    responsavel_nome TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.cliente_id,
        cl.nome_fantasia as cliente_nome,
        p.contrato_id,
        p.titulo,
        p.status,
        p.data_inicio,
        p.data_fim_prevista,
        p.valor_total,
        p.valor_pago,
        p.percentual_conclusao,
        u.raw_user_meta_data->>'name' as responsavel_nome,
        p.created_at
    FROM public.projetos p
    INNER JOIN public.clientes cl ON p.cliente_id = cl.id
    LEFT JOIN auth.users u ON p.responsavel_id = u.id
    WHERE p.workspace_id = (
        SELECT workspace_id FROM public.get_user_empresa()
    )
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter cobranças do workspace
CREATE OR REPLACE FUNCTION public.get_workspace_cobrancas()
RETURNS TABLE (
    id UUID,
    cliente_id UUID,
    cliente_nome TEXT,
    contrato_id UUID,
    projeto_id UUID,
    numero_nota TEXT,
    tipo_cobranca TEXT,
    descricao TEXT,
    valor DECIMAL,
    status TEXT,
    data_emissao DATE,
    data_vencimento DATE,
    data_pagamento DATE,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.cliente_id,
        cl.nome_fantasia as cliente_nome,
        c.contrato_id,
        c.projeto_id,
        c.numero_nota,
        c.tipo_cobranca,
        c.descricao,
        c.valor,
        c.status,
        c.data_emissao,
        c.data_vencimento,
        c.data_pagamento,
        c.created_at
    FROM public.cobrancas c
    INNER JOIN public.clientes cl ON c.cliente_id = cl.id
    WHERE c.workspace_id = (
        SELECT workspace_id FROM public.get_user_empresa()
    )
    ORDER BY c.data_vencimento DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON TABLE public.categorias_servicos IS 'Categorias de serviços da agência';
COMMENT ON TABLE public.servicos IS 'Serviços oferecidos pela agência';
COMMENT ON TABLE public.contratos IS 'Contratos recorrentes com clientes';
COMMENT ON TABLE public.contrato_servicos IS 'Serviços vinculados aos contratos';
COMMENT ON TABLE public.projetos IS 'Projetos pontuais/vendas únicas';
COMMENT ON TABLE public.projeto_servicos IS 'Serviços vinculados aos projetos';
COMMENT ON TABLE public.cobrancas IS 'Cobranças (recorrentes e pontuais)';
COMMENT ON TABLE public.despesas IS 'Despesas da agência';

-- Verificar se tudo foi criado corretamente
SELECT 'Schema para agência de marketing executado com sucesso!' as status; 