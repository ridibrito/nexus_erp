-- Corrigir tabela clientes - Remover workspace e usar empresa
-- Este script remove completamente as referências ao workspace

-- 1. Verificar se a tabela existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clientes') THEN
        RAISE NOTICE 'Tabela clientes não existe. Criando...';
        
        CREATE TABLE public.clientes (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            empresa_id UUID NOT NULL,
            nome_fant VARCHAR(255) NOT NULL,
            razao_social VARCHAR(255),
            cnpj VARCHAR(18),
            email VARCHAR(255),
            telefone VARCHAR(20),
            status VARCHAR(20) DEFAULT 'ativo',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        RAISE NOTICE 'Tabela clientes criada com sucesso!';
    ELSE
        RAISE NOTICE 'Tabela clientes já existe.';
    END IF;
END $$;

-- 2. Verificar se existe coluna workspace_id e remover
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'workspace_id'
    ) THEN
        RAISE NOTICE 'Coluna workspace_id encontrada. Removendo...';
        ALTER TABLE public.clientes DROP COLUMN workspace_id;
        RAISE NOTICE 'Coluna workspace_id removida!';
    ELSE
        RAISE NOTICE 'Coluna workspace_id não encontrada.';
    END IF;
END $$;

-- 3. Verificar se existe coluna workspace e remover
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'workspace'
    ) THEN
        RAISE NOTICE 'Coluna workspace encontrada. Removendo...';
        ALTER TABLE public.clientes DROP COLUMN workspace;
        RAISE NOTICE 'Coluna workspace removida!';
    ELSE
        RAISE NOTICE 'Coluna workspace não encontrada.';
    END IF;
END $$;

-- 4. Verificar se existe coluna workspace_id_old e remover
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'workspace_id_old'
    ) THEN
        RAISE NOTICE 'Coluna workspace_id_old encontrada. Removendo...';
        ALTER TABLE public.clientes DROP COLUMN workspace_id_old;
        RAISE NOTICE 'Coluna workspace_id_old removida!';
    ELSE
        RAISE NOTICE 'Coluna workspace_id_old não encontrada.';
    END IF;
END $$;

-- 5. Garantir que empresa_id existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'empresa_id'
    ) THEN
        RAISE NOTICE 'Coluna empresa_id não existe. Adicionando...';
        ALTER TABLE public.clientes ADD COLUMN empresa_id UUID;
        RAISE NOTICE 'Coluna empresa_id adicionada!';
    ELSE
        RAISE NOTICE 'Coluna empresa_id já existe.';
    END IF;
END $$;

-- 6. Garantir que nome_fant existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'nome_fant'
    ) THEN
        RAISE NOTICE 'Coluna nome_fant não existe. Adicionando...';
        ALTER TABLE public.clientes ADD COLUMN nome_fant VARCHAR(255);
        RAISE NOTICE 'Coluna nome_fant adicionada!';
    ELSE
        RAISE NOTICE 'Coluna nome_fant já existe.';
    END IF;
END $$;

-- 7. Garantir que status existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'status'
    ) THEN
        RAISE NOTICE 'Coluna status não existe. Adicionando...';
        ALTER TABLE public.clientes ADD COLUMN status VARCHAR(20) DEFAULT 'ativo';
        RAISE NOTICE 'Coluna status adicionada!';
    ELSE
        RAISE NOTICE 'Coluna status já existe.';
    END IF;
END $$;

-- 8. Lidar com a coluna nome_fantasia (migrar dados para nome_fant se necessário)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'nome_fantasia'
    ) THEN
        RAISE NOTICE 'Coluna nome_fantasia encontrada. Migrando dados...';
        
        -- Atualizar nome_fant com dados de nome_fantasia se nome_fant estiver vazio
        UPDATE public.clientes 
        SET nome_fant = nome_fantasia 
        WHERE (nome_fant IS NULL OR nome_fant = '') AND nome_fantasia IS NOT NULL;
        
        -- Remover a coluna nome_fantasia
        ALTER TABLE public.clientes DROP COLUMN nome_fantasia;
        RAISE NOTICE 'Coluna nome_fantasia removida!';
    ELSE
        RAISE NOTICE 'Coluna nome_fantasia não encontrada.';
    END IF;
END $$;

-- 9. Definir empresa_id como NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'empresa_id' AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'Definindo empresa_id como NOT NULL...';
        ALTER TABLE public.clientes ALTER COLUMN empresa_id SET NOT NULL;
        RAISE NOTICE 'empresa_id definido como NOT NULL!';
    ELSE
        RAISE NOTICE 'empresa_id já é NOT NULL.';
    END IF;
END $$;

-- 10. Definir nome_fant como NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'nome_fant' AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'Definindo nome_fant como NOT NULL...';
        ALTER TABLE public.clientes ALTER COLUMN nome_fant SET NOT NULL;
        RAISE NOTICE 'nome_fant definido como NOT NULL!';
    ELSE
        RAISE NOTICE 'nome_fant já é NOT NULL.';
    END IF;
END $$;

-- 11. Atualizar empresa_id para registros que não têm
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.clientes 
        WHERE empresa_id IS NULL
    ) THEN
        RAISE NOTICE 'Atualizando empresa_id para registros vazios...';
        
        UPDATE public.clientes 
        SET empresa_id = (SELECT id FROM public.empresas LIMIT 1)
        WHERE empresa_id IS NULL;
        
        RAISE NOTICE 'empresa_id atualizado!';
    ELSE
        RAISE NOTICE 'Todos os registros já têm empresa_id.';
    END IF;
END $$;

-- 12. Atualizar nome_fant para registros que não têm
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.clientes 
        WHERE nome_fant IS NULL OR nome_fant = ''
    ) THEN
        RAISE NOTICE 'Atualizando nome_fant para registros vazios...';
        
        UPDATE public.clientes 
        SET nome_fant = 'Cliente Sem Nome'
        WHERE nome_fant IS NULL OR nome_fant = '';
        
        RAISE NOTICE 'nome_fant atualizado!';
    ELSE
        RAISE NOTICE 'Todos os registros já têm nome_fant.';
    END IF;
END $$;

-- 13. Inserir cliente de teste se não houver nenhum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.clientes LIMIT 1) THEN
        RAISE NOTICE 'Inserindo cliente de teste...';
        
        INSERT INTO public.clientes (
            empresa_id,
            nome_fant,
            razao_social,
            cnpj,
            email,
            telefone,
            status
        ) VALUES (
            (SELECT id FROM public.empresas LIMIT 1),
            'Empresa Teste Ltda',
            'Empresa Teste Ltda',
            '12.345.678/0001-90',
            'contato@empresateste.com',
            '(11) 99999-9999',
            'ativo'
        );
        
        RAISE NOTICE 'Cliente de teste inserido!';
    ELSE
        RAISE NOTICE 'Já existem clientes na tabela.';
    END IF;
END $$;

-- 14. Mostrar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;

-- 15. Mostrar dados da tabela
SELECT * FROM public.clientes;
