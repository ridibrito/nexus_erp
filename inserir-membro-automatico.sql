-- =====================================================
-- INSERIR MEMBRO AUTOMÁTICO
-- =====================================================

-- 1. Adicionar colunas necessárias (se não existirem)
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS nome VARCHAR(255);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS cargo VARCHAR(100);
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS permissoes JSONB DEFAULT '{}';
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.membros ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. Inserir membro automaticamente
DO $$
DECLARE
    workspace_id UUID;
    user_id UUID;
BEGIN
    -- Obter o primeiro workspace
    SELECT id INTO workspace_id FROM public.workspaces LIMIT 1;
    
    IF workspace_id IS NULL THEN
        RAISE EXCEPTION 'Nenhum workspace encontrado. Crie um workspace primeiro.';
    END IF;
    
    -- Obter o usuário atual (ajuste o email conforme necessário)
    SELECT id INTO user_id FROM auth.users WHERE email = 'ricardo@nexus.com.br' LIMIT 1;
    
    IF user_id IS NULL THEN
        -- Se não encontrar, pegar o primeiro usuário
        SELECT id INTO user_id FROM auth.users LIMIT 1;
        
        IF user_id IS NULL THEN
            RAISE EXCEPTION 'Nenhum usuário encontrado.';
        END IF;
    END IF;
    
    -- Inserir o membro
    INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active)
    VALUES (workspace_id, user_id, 'Ricardo Admin', 'ricardo@nexus.com.br', 'Administrador', true)
    ON CONFLICT (user_id, workspace_id) DO NOTHING;
    
    RAISE NOTICE 'Membro inserido com sucesso!';
    RAISE NOTICE 'Workspace ID: %', workspace_id;
    RAISE NOTICE 'User ID: %', user_id;
END $$;

-- 3. Verificar se foi inserido
SELECT * FROM public.membros; 