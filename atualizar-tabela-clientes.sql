-- Atualizar tabela clientes para suportar pessoa física e jurídica
-- Este script adiciona os campos necessários para ambos os tipos

-- 1. Adicionar coluna tipo
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'tipo'
    ) THEN
        RAISE NOTICE 'Adicionando coluna tipo...';
        ALTER TABLE public.clientes ADD COLUMN tipo VARCHAR(20) DEFAULT 'pessoa_juridica';
        RAISE NOTICE 'Coluna tipo adicionada!';
    ELSE
        RAISE NOTICE 'Coluna tipo já existe.';
    END IF;
END $$;

-- 2. Adicionar coluna nome (para pessoa física)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'nome'
    ) THEN
        RAISE NOTICE 'Adicionando coluna nome...';
        ALTER TABLE public.clientes ADD COLUMN nome VARCHAR(255);
        RAISE NOTICE 'Coluna nome adicionada!';
    ELSE
        RAISE NOTICE 'Coluna nome já existe.';
    END IF;
END $$;

-- 3. Adicionar coluna cpf (para pessoa física)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'cpf'
    ) THEN
        RAISE NOTICE 'Adicionando coluna cpf...';
        ALTER TABLE public.clientes ADD COLUMN cpf VARCHAR(14);
        RAISE NOTICE 'Coluna cpf adicionada!';
    ELSE
        RAISE NOTICE 'Coluna cpf já existe.';
    END IF;
END $$;

-- 4. Atualizar registros existentes para ter tipo correto
DO $$
BEGIN
    RAISE NOTICE 'Atualizando registros existentes...';
    
    -- Se tem nome_fant, é pessoa jurídica
    UPDATE public.clientes 
    SET tipo = 'pessoa_juridica'
    WHERE tipo IS NULL AND nome_fant IS NOT NULL;
    
    -- Se tem nome mas não tem nome_fant, é pessoa física
    UPDATE public.clientes 
    SET tipo = 'pessoa_fisica'
    WHERE tipo IS NULL AND nome IS NOT NULL AND nome_fant IS NULL;
    
    -- Se não tem nenhum dos dois, definir como pessoa jurídica por padrão
    UPDATE public.clientes 
    SET tipo = 'pessoa_juridica'
    WHERE tipo IS NULL;
    
    RAISE NOTICE 'Registros atualizados!';
END $$;

-- 5. Definir tipo como NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'tipo' AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'Definindo tipo como NOT NULL...';
        ALTER TABLE public.clientes ALTER COLUMN tipo SET NOT NULL;
        RAISE NOTICE 'tipo definido como NOT NULL!';
    ELSE
        RAISE NOTICE 'tipo já é NOT NULL.';
    END IF;
END $$;

-- 6. Tornar nome_fant opcional (pode ser NULL para pessoa física)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'clientes' AND column_name = 'nome_fant' AND is_nullable = 'NO'
    ) THEN
        RAISE NOTICE 'Tornando nome_fant opcional...';
        ALTER TABLE public.clientes ALTER COLUMN nome_fant DROP NOT NULL;
        RAISE NOTICE 'nome_fant agora é opcional!';
    ELSE
        RAISE NOTICE 'nome_fant já é opcional.';
    END IF;
END $$;

-- 7. Mostrar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;

-- 8. Mostrar dados da tabela
SELECT * FROM public.clientes;
