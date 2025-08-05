-- =====================================================
-- CORRIGIR TABELA MEMBROS
-- =====================================================

-- 1. Verificar estrutura atual da tabela
DO $$
BEGIN
    RAISE NOTICE 'Verificando estrutura da tabela membros...';
    
    -- Verificar se a tabela existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros') THEN
        RAISE EXCEPTION 'Tabela membros não existe!';
    END IF;
    
    -- Listar colunas existentes
    RAISE NOTICE 'Colunas existentes na tabela membros:';
    FOR col IN 
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'membros'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - % (%%)', col.column_name, col.data_type;
    END LOOP;
END $$;

-- 2. Adicionar colunas que estão faltando
DO $$
BEGIN
    -- Adicionar coluna nome se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'nome') THEN
        ALTER TABLE public.membros ADD COLUMN nome VARCHAR(255);
        RAISE NOTICE 'Coluna nome adicionada';
    END IF;
    
    -- Adicionar coluna email se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'email') THEN
        ALTER TABLE public.membros ADD COLUMN email VARCHAR(255);
        RAISE NOTICE 'Coluna email adicionada';
    END IF;
    
    -- Adicionar coluna cargo se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'cargo') THEN
        ALTER TABLE public.membros ADD COLUMN cargo VARCHAR(100);
        RAISE NOTICE 'Coluna cargo adicionada';
    END IF;
    
    -- Adicionar coluna permissoes se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'permissoes') THEN
        ALTER TABLE public.membros ADD COLUMN permissoes JSONB DEFAULT '{}';
        RAISE NOTICE 'Coluna permissoes adicionada';
    END IF;
    
    -- Adicionar coluna is_active se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'is_active') THEN
        ALTER TABLE public.membros ADD COLUMN is_active BOOLEAN DEFAULT true;
        RAISE NOTICE 'Coluna is_active adicionada';
    END IF;
    
    -- Adicionar coluna updated_at se não existir
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'membros' AND column_name = 'updated_at') THEN
        ALTER TABLE public.membros ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
        RAISE NOTICE 'Coluna updated_at adicionada';
    END IF;
END $$;

-- 3. Criar trigger para updated_at se não existir
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

-- 4. Habilitar RLS
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
DROP POLICY IF EXISTS "Membros podem ver membros do mesmo workspace" ON public.membros;
CREATE POLICY "Membros podem ver membros do mesmo workspace" ON public.membros
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Usuários podem gerenciar seus próprios registros" ON public.membros;
CREATE POLICY "Usuários podem gerenciar seus próprios registros" ON public.membros
    FOR ALL USING (true);

-- 6. Criar índices
CREATE INDEX IF NOT EXISTS idx_membros_workspace_id ON public.membros(workspace_id);
CREATE INDEX IF NOT EXISTS idx_membros_user_id ON public.membros(user_id);
CREATE INDEX IF NOT EXISTS idx_membros_is_active ON public.membros(is_active);

-- 7. Verificar estrutura final
DO $$
BEGIN
    RAISE NOTICE 'Estrutura final da tabela membros:';
    FOR col IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'membros'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE '  - % (%%) [NULL: %%]', col.column_name, col.data_type, col.is_nullable;
    END LOOP;
END $$;

-- =====================================================
-- INSTRUÇÕES
-- =====================================================

/*
1. Execute este script no Supabase
2. Verifique se todas as colunas foram criadas
3. Depois execute as consultas para obter os IDs:

   -- Para obter workspace_id:
   SELECT id FROM public.workspaces LIMIT 1;
   
   -- Para obter user_id:
   SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com';
   
4. Use os IDs obtidos para inserir o membro:
   INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo) 
   VALUES ('ID_DO_WORKSPACE', 'ID_DO_USUARIO', 'Seu Nome', 'seu@email.com', 'Administrador');
*/ 