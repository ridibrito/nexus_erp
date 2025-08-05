-- =====================================================
-- SETUP RÁPIDO - EXECUTE ESTE SCRIPT NO SUPABASE
-- =====================================================

-- 1. Criar tabela membros (se não existir)
CREATE TABLE IF NOT EXISTS public.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL,
    user_id UUID NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    permissoes JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Criar trigger para updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_membros_updated_at ON public.membros;
CREATE TRIGGER handle_membros_updated_at
    BEFORE UPDATE ON public.membros
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 3. Habilitar RLS
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS
DROP POLICY IF EXISTS "Membros podem ver membros do mesmo workspace" ON public.membros;
CREATE POLICY "Membros podem ver membros do mesmo workspace" ON public.membros
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios registros" ON public.membros;
CREATE POLICY "Usuários podem gerenciar seus próprios registros" ON public.membros
    FOR ALL USING (true);

-- 5. Criar índices
CREATE INDEX IF NOT EXISTS idx_membros_workspace_id ON public.membros(workspace_id);
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON public.membros(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_is_active ON public.membros(is_active);

-- 6. Inserir membro inicial (substitua os valores)
-- DESCOMENTE E AJUSTE AS LINHAS ABAIXO:

-- Obter workspace_id:
-- SELECT id FROM public.workspaces LIMIT 1;

-- Obter user_id:
-- SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';

-- Inserir membro (substitua pelos valores reais):
-- INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo) 
-- VALUES ('SEU_WORKSPACE_ID', 'SEU_USER_ID', 'Seu Nome', 'seu@email.com', 'Administrador');

-- =====================================================
-- INSTRUÇÕES
-- =====================================================

/*
1. Execute este script completo no Supabase
2. Depois execute estas consultas para obter os IDs:

   -- Para obter workspace_id:
   SELECT id FROM public.workspaces LIMIT 1;
   
   -- Para obter user_id:
   SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';
   
3. Use os IDs obtidos para inserir o membro:
   INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo) 
   VALUES ('ID_DO_WORKSPACE', 'ID_DO_USUARIO', 'Seu Nome', 'seu@email.com', 'Administrador');
*/ 