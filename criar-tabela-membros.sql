-- =====================================================
-- CRIAÇÃO DA TABELA MEMBROS
-- =====================================================

-- Criar tabela membros
CREATE TABLE IF NOT EXISTS public.membros (
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

-- Criar trigger para updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_membros_updated_at
    BEFORE UPDATE ON public.membros
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Habilitar RLS
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Membros podem ver membros do mesmo workspace" ON public.membros
    FOR SELECT USING (
        workspace_id IN (
            SELECT workspace_id FROM public.membros 
            WHERE user_id = auth.uid() AND is_active = true
        )
    );

CREATE POLICY "Usuários podem gerenciar seus próprios registros" ON public.membros
    FOR ALL USING (
        user_id = auth.uid()
    );

-- Índices
CREATE INDEX IF NOT EXISTS idx_membros_workspace_id ON public.membros(workspace_id);
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON public.membros(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_is_active ON public.membros(is_active);

-- Inserir dados de exemplo (substitua pelo seu workspace_id real)
-- INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo) VALUES
-- ('SEU_WORKSPACE_ID_AQUI', '56022b1a-77cb-40ac-86ca-80b5ae30def1', 'Usuário Admin', 'admin@exemplo.com', 'Administrador');

-- =====================================================
-- INSTRUÇÕES PARA EXECUTAR
-- =====================================================

/*
1. Execute este SQL no seu Supabase
2. Substitua 'SEU_WORKSPACE_ID_AQUI' pelo ID real do seu workspace
3. Substitua o user_id pelo ID real do usuário logado
4. Execute o INSERT para criar o primeiro membro

Para obter o workspace_id:
SELECT id FROM public.workspaces LIMIT 1;

Para obter o user_id:
SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';
*/ 