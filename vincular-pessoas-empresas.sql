-- Script para vincular pessoas a empresas
-- Cada empresa pode ter várias pessoas, mas uma pessoa só pode ter uma empresa

-- 1. Adicionar coluna empresa_vinculada_id na tabela clientes para pessoas físicas
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS empresa_vinculada_id UUID REFERENCES public.clientes(id);

-- 2. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_vinculada 
ON public.clientes(empresa_vinculada_id);

-- 3. Adicionar constraint para garantir que apenas pessoas físicas podem ter empresa vinculada
ALTER TABLE public.clientes 
ADD CONSTRAINT check_empresa_vinculada_tipo 
CHECK (
  (tipo = 'pessoa_fisica' AND empresa_vinculada_id IS NOT NULL) OR
  (tipo = 'pessoa_juridica' AND empresa_vinculada_id IS NULL)
);

-- 4. Adicionar constraint para garantir que uma pessoa só pode ter uma empresa
-- Usando índice único em vez de constraint para compatibilidade
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pessoa_empresa 
ON public.clientes(empresa_vinculada_id) 
WHERE empresa_vinculada_id IS NOT NULL;

-- 5. Verificar se existem dados para migrar
DO $$
DECLARE
    cliente_record RECORD;
BEGIN
    -- Para cada pessoa física existente, tentar vincular a uma empresa
    FOR cliente_record IN 
        SELECT id, nome, cpf, empresa_id 
        FROM public.clientes 
        WHERE tipo = 'pessoa_fisica' 
        AND empresa_vinculada_id IS NULL
    LOOP
        -- Tentar encontrar uma empresa na mesma empresa_id
        UPDATE public.clientes 
        SET empresa_vinculada_id = (
            SELECT id 
            FROM public.clientes 
            WHERE tipo = 'pessoa_juridica' 
            AND empresa_id = cliente_record.empresa_id
            LIMIT 1
        )
        WHERE id = cliente_record.id;
    END LOOP;
END $$;

-- 6. Inserir dados de exemplo se não existirem
INSERT INTO public.clientes (
    empresa_id, 
    tipo, 
    nome_fant, 
    razao_social, 
    cnpj, 
    email, 
    telefone, 
    status
) 
SELECT 
    (SELECT id FROM public.empresas LIMIT 1),
    'pessoa_juridica',
    'Empresa Exemplo Ltda',
    'Empresa Exemplo Ltda',
    '12.345.678/0001-90',
    'contato@empresaexemplo.com',
    '(11) 99999-9999',
    'ativo'
WHERE NOT EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE tipo = 'pessoa_juridica' 
    AND nome_fant = 'Empresa Exemplo Ltda'
);

INSERT INTO public.clientes (
    empresa_id, 
    tipo, 
    nome, 
    cpf, 
    email, 
    telefone, 
    status,
    empresa_vinculada_id
) 
SELECT 
    (SELECT id FROM public.empresas LIMIT 1),
    'pessoa_fisica',
    'João Silva',
    '123.456.789-00',
    'joao.silva@email.com',
    '(11) 88888-8888',
    'ativo',
    (SELECT id FROM public.clientes WHERE tipo = 'pessoa_juridica' AND nome_fant = 'Empresa Exemplo Ltda' LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 FROM public.clientes 
    WHERE tipo = 'pessoa_fisica' 
    AND nome = 'João Silva'
);

-- 7. Verificar estrutura final
SELECT 
    'Estrutura da tabela clientes:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'clientes' 
ORDER BY ordinal_position;
