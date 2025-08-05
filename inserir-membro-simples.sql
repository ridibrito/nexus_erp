-- =====================================================
-- INSERIR MEMBRO SIMPLES
-- =====================================================

-- 1. Adicionar colunas necessárias (se não existirem)
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS nome VARCHAR(255);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS permissoes JSONB DEFAULT '{}';
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Inserir membro (substitua pelos valores reais)
INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active) 
VALUES (
    'SEU_WORKSPACE_ID_AQUI',  -- Substitua pelo ID real do workspace
    'SEU_USER_ID_AQUI',       -- Substitua pelo ID real do usuário
    'Seu Nome',               -- Substitua pelo seu nome
    'seu@email.com',          -- Substitua pelo seu email
    'Administrador',          -- Substitua pelo cargo
    true
);

-- =====================================================
-- COMO OBTER OS IDs
-- =====================================================

/*
1. Para obter workspace_id:
   SELECT id FROM public.workspaces LIMIT 1;

2. Para obter user_id:
   SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';

3. Substitua os valores no INSERT acima pelos IDs obtidos
*/ 