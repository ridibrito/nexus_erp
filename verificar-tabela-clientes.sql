-- Verificar e corrigir tabela clientes
-- Este script verifica se a tabela clientes existe e tem a estrutura correta

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

-- 2. Verificar se a coluna empresa_id existe
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

-- 3. Verificar se a coluna nome_fant existe
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

-- 4. Verificar se a coluna status existe
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

-- 5. Migrar workspace_id para empresa_id se necessário
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'workspace_id'
    ) THEN
        RAISE NOTICE 'Coluna workspace_id encontrada. Migrando para empresa_id...';
        
        -- Atualizar empresa_id com valores de workspace_id
        UPDATE public.clientes 
        SET empresa_id = workspace_id 
        WHERE empresa_id IS NULL AND workspace_id IS NOT NULL;
        
        -- Remover coluna workspace_id
        ALTER TABLE public.clientes DROP COLUMN IF EXISTS workspace_id;
        
        RAISE NOTICE 'Migração de workspace_id para empresa_id concluída!';
    ELSE
        RAISE NOTICE 'Coluna workspace_id não encontrada.';
    END IF;
END $$;

-- 6. Definir empresa_id como NOT NULL se ainda não estiver
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

-- 7. Definir nome_fant como NOT NULL se ainda não estiver
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

-- 8. Inserir cliente de teste se não houver nenhum
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

-- 9. Mostrar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;

-- 10. Mostrar dados da tabela
SELECT * FROM public.clientes;
