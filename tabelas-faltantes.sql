-- Tabelas Faltantes para o Sistema ERP Nexus
-- Execute este código no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SISTEMA DE NEGÓCIOS (CRM) - FALTANDO
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
-- 2. SISTEMA DE MOVIMENTAÇÕES BANCÁRIAS - FALTANDO
-- =====================================================

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
    conta_pagar_id UUID REFERENCES public.despesas(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- 3. SISTEMA DE NFS-E - FALTANDO
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
-- 4. SISTEMA DE CATEGORIAS E CONFIGURAÇÕES - FALTANDO
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
-- 5. TRIGGERS PARA AS NOVAS TABELAS
-- =====================================================

-- Função para atualizar updated_at (caso não exista)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at nas novas tabelas
CREATE TRIGGER on_pipelines_updated
    BEFORE UPDATE ON public.pipelines
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_pipeline_etapas_updated
    BEFORE UPDATE ON public.pipeline_etapas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_negocios_updated
    BEFORE UPDATE ON public.negocios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_movimentacoes_bancarias_updated
    BEFORE UPDATE ON public.movimentacoes_bancarias
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
-- 6. POLÍTICAS RLS PARA AS NOVAS TABELAS
-- =====================================================

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_bancarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condicoes_pagamento ENABLE ROW LEVEL SECURITY;

-- Políticas básicas para as novas tabelas
CREATE POLICY "Users can view workspace pipelines" ON public.pipelines
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = pipelines.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace pipeline stages" ON public.pipeline_etapas
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.pipelines p
            INNER JOIN public.membros m ON p.workspace_id = m.workspace_id
            WHERE p.id = pipeline_etapas.pipeline_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace deals" ON public.negocios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = negocios.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace bank movements" ON public.movimentacoes_bancarias
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = movimentacoes_bancarias.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace nfse" ON public.nfse
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = nfse.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace financial categories" ON public.categorias_financeiras
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = categorias_financeiras.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace payment methods" ON public.formas_pagamento
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = formas_pagamento.workspace_id AND m.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace payment conditions" ON public.condicoes_pagamento
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = condicoes_pagamento.workspace_id AND m.user_id = auth.uid()
        )
    );

-- =====================================================
-- 7. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para consultas frequentes nas novas tabelas
CREATE INDEX idx_negocios_workspace_id ON public.negocios(workspace_id);
CREATE INDEX idx_negocios_cliente_id ON public.negocios(cliente_id);
CREATE INDEX idx_negocios_etapa_id ON public.negocios(etapa_id);
CREATE INDEX idx_negocios_pipeline_id ON public.negocios(pipeline_id);
CREATE INDEX idx_negocios_status ON public.negocios(status);

CREATE INDEX idx_pipelines_workspace_id ON public.pipelines(workspace_id);
CREATE INDEX idx_pipeline_etapas_pipeline_id ON public.pipeline_etapas(pipeline_id);
CREATE INDEX idx_pipeline_etapas_ordem ON public.pipeline_etapas(ordem);

CREATE INDEX idx_movimentacoes_bancarias_workspace_id ON public.movimentacoes_bancarias(workspace_id);
CREATE INDEX idx_movimentacoes_bancarias_tipo ON public.movimentacoes_bancarias(tipo);
CREATE INDEX idx_movimentacoes_bancarias_data ON public.movimentacoes_bancarias(data_movimentacao);

CREATE INDEX idx_nfse_workspace_id ON public.nfse(workspace_id);
CREATE INDEX idx_nfse_cobranca_id ON public.nfse(cobranca_id);
CREATE INDEX idx_nfse_status ON public.nfse(status);

CREATE INDEX idx_categorias_financeiras_workspace_id ON public.categorias_financeiras(workspace_id);
CREATE INDEX idx_categorias_financeiras_tipo ON public.categorias_financeiras(tipo);

CREATE INDEX idx_formas_pagamento_workspace_id ON public.formas_pagamento(workspace_id);
CREATE INDEX idx_condicoes_pagamento_workspace_id ON public.condicoes_pagamento(workspace_id);

-- =====================================================
-- 8. DADOS INICIAIS (OPCIONAL)
-- =====================================================

-- NOTA: Os dados iniciais devem ser inseridos manualmente após criar as tabelas
-- ou você pode remover esta seção e inserir os dados conforme necessário

-- Exemplo de como inserir dados (execute após criar as tabelas):
/*
-- Primeiro, obtenha o workspace_id válido:
-- SELECT id FROM public.workspaces LIMIT 1;

-- Depois insira os dados com o workspace_id correto:
INSERT INTO public.categorias_financeiras (workspace_id, nome, tipo, descricao, cor) VALUES
('SEU_WORKSPACE_ID_AQUI', 'Vendas', 'receita', 'Receitas de vendas', '#10B981'),
('SEU_WORKSPACE_ID_AQUI', 'Serviços', 'receita', 'Receitas de serviços', '#3B82F6'),
('SEU_WORKSPACE_ID_AQUI', 'Aluguel', 'despesa', 'Despesas com aluguel', '#EF4444'),
('SEU_WORKSPACE_ID_AQUI', 'Salários', 'despesa', 'Despesas com salários', '#F59E0B'),
('SEU_WORKSPACE_ID_AQUI', 'Marketing', 'despesa', 'Despesas com marketing', '#8B5CF6'),
('SEU_WORKSPACE_ID_AQUI', 'Impostos', 'despesa', 'Despesas com impostos', '#6B7280');

INSERT INTO public.formas_pagamento (workspace_id, nome, descricao) VALUES
('SEU_WORKSPACE_ID_AQUI', 'PIX', 'Pagamento via PIX'),
('SEU_WORKSPACE_ID_AQUI', 'Cartão de Crédito', 'Pagamento via cartão de crédito'),
('SEU_WORKSPACE_ID_AQUI', 'Cartão de Débito', 'Pagamento via cartão de débito'),
('SEU_WORKSPACE_ID_AQUI', 'Boleto Bancário', 'Pagamento via boleto'),
('SEU_WORKSPACE_ID_AQUI', 'Transferência Bancária', 'Pagamento via transferência'),
('SEU_WORKSPACE_ID_AQUI', 'Dinheiro', 'Pagamento em dinheiro');

INSERT INTO public.condicoes_pagamento (workspace_id, nome, descricao, dias_vencimento) VALUES
('SEU_WORKSPACE_ID_AQUI', 'À Vista', 'Pagamento imediato', 0),
('SEU_WORKSPACE_ID_AQUI', '30 dias', 'Pagamento em 30 dias', 30),
('SEU_WORKSPACE_ID_AQUI', '60 dias', 'Pagamento em 60 dias', 60),
('SEU_WORKSPACE_ID_AQUI', '90 dias', 'Pagamento em 90 dias', 90);
*/

-- =====================================================
-- 9. VERIFICAÇÃO FINAL
-- =====================================================

SELECT 'Tabelas faltantes criadas com sucesso!' as status;
SELECT COUNT(*) as total_novas_tabelas FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('pipelines', 'pipeline_etapas', 'negocios', 'movimentacoes_bancarias', 'nfse', 'categorias_financeiras', 'formas_pagamento', 'condicoes_pagamento'); 