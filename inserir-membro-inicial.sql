-- =====================================================
-- INSERIR MEMBRO INICIAL
-- =====================================================

-- Primeiro, vamos verificar se a tabela membros existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros') THEN
        RAISE EXCEPTION 'Tabela membros não existe. Execute primeiro o script criar-tabela-membros.sql';
    END IF;
END $$;

-- Obter o primeiro workspace
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
    
    -- Obter o usuário atual (você pode ajustar o email)
    SELECT id INTO user_id FROM auth.users WHERE email = 'seu-email@exemplo.com' LIMIT 1;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não encontrado. Ajuste o email no script.';
    END IF;
    
    -- Inserir o membro
    INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active)
    VALUES (workspace_id, user_id, 'Usuário Admin', 'admin@exemplo.com', 'Administrador', true)
    ON CONFLICT (user_id, workspace_id) DO NOTHING;
    
    RAISE NOTICE 'Membro inserido com sucesso! Workspace ID: %, User ID: %', workspace_id, user_id;
END $$;

-- =====================================================
-- INSTRUÇÕES
-- =====================================================

/*
1. Substitua 'seu-email@exemplo.com' pelo seu email real
2. Execute este script no Supabase
3. Verifique se o membro foi criado:
   SELECT * FROM public.membros;
*/ 