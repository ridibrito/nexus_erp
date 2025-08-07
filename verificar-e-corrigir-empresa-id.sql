-- Verificar e corrigir empresa_id em todas as tabelas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a coluna empresa_id existe em cada tabela
DO $$
DECLARE
    tbl_name text;
    column_exists boolean;
BEGIN
    FOR tbl_name IN 
        SELECT unnest(ARRAY[
            'clientes',
            'pipelines', 
            'pipeline_etapas',
            'negocios',
            'contatos',
            'cobrancas',
            'despesas',
            'categorias_financeiras',
            'formas_pagamento',
            'movimentacoes_bancarias'
        ])
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = tbl_name 
            AND column_name = 'empresa_id'
        ) INTO column_exists;
        
        IF NOT column_exists THEN
            RAISE NOTICE 'Adicionando empresa_id na tabela %', tbl_name;
            EXECUTE format('ALTER TABLE %I ADD COLUMN empresa_id UUID', tbl_name);
        ELSE
            RAISE NOTICE 'Coluna empresa_id já existe na tabela %', tbl_name;
        END IF;
    END LOOP;
END $$;

-- 2. Verificar se a coluna workspace_id existe e migrar dados
DO $$
DECLARE
    tbl_name text;
    column_exists boolean;
BEGIN
    FOR tbl_name IN 
        SELECT unnest(ARRAY[
            'clientes',
            'pipelines', 
            'pipeline_etapas',
            'negocios',
            'contatos',
            'cobrancas',
            'despesas',
            'categorias_financeiras',
            'formas_pagamento',
            'movimentacoes_bancarias'
        ])
    LOOP
        -- Verificar se workspace_id existe
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = tbl_name 
            AND column_name = 'workspace_id'
        ) INTO column_exists;
        
        IF column_exists THEN
            RAISE NOTICE 'Migrando dados de workspace_id para empresa_id na tabela %', tbl_name;
            -- Migrar dados de workspace_id para empresa_id
            EXECUTE format('UPDATE %I SET empresa_id = workspace_id WHERE empresa_id IS NULL', tbl_name);
            -- Remover coluna workspace_id
            EXECUTE format('ALTER TABLE %I DROP COLUMN workspace_id', tbl_name);
        END IF;
    END LOOP;
END $$;

-- 3. Definir empresa_id como NOT NULL onde necessário
ALTER TABLE clientes ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE pipelines ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE pipeline_etapas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE negocios ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE contatos ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE cobrancas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE despesas ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE categorias_financeiras ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE formas_pagamento ALTER COLUMN empresa_id SET NOT NULL;
ALTER TABLE movimentacoes_bancarias ALTER COLUMN empresa_id SET NOT NULL;

-- 4. Adicionar foreign key constraints se não existirem
DO $$
BEGIN
    -- Verificar se a constraint já existe antes de criar
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_clientes_empresa_id'
    ) THEN
        ALTER TABLE clientes ADD CONSTRAINT fk_clientes_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_pipelines_empresa_id'
    ) THEN
        ALTER TABLE pipelines ADD CONSTRAINT fk_pipelines_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_pipeline_etapas_empresa_id'
    ) THEN
        ALTER TABLE pipeline_etapas ADD CONSTRAINT fk_pipeline_etapas_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_negocios_empresa_id'
    ) THEN
        ALTER TABLE negocios ADD CONSTRAINT fk_negocios_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_contatos_empresa_id'
    ) THEN
        ALTER TABLE contatos ADD CONSTRAINT fk_contatos_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_cobrancas_empresa_id'
    ) THEN
        ALTER TABLE cobrancas ADD CONSTRAINT fk_cobrancas_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_despesas_empresa_id'
    ) THEN
        ALTER TABLE despesas ADD CONSTRAINT fk_despesas_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_categorias_financeiras_empresa_id'
    ) THEN
        ALTER TABLE categorias_financeiras ADD CONSTRAINT fk_categorias_financeiras_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_formas_pagamento_empresa_id'
    ) THEN
        ALTER TABLE formas_pagamento ADD CONSTRAINT fk_formas_pagamento_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_movimentacoes_bancarias_empresa_id'
    ) THEN
        ALTER TABLE movimentacoes_bancarias ADD CONSTRAINT fk_movimentacoes_bancarias_empresa_id 
        FOREIGN KEY (empresa_id) REFERENCES empresas(id);
    END IF;
END $$;

-- 5. Atualizar registros existentes com empresa_id padrão se estiverem NULL
UPDATE clientes SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE pipelines SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE pipeline_etapas SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE negocios SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE contatos SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE cobrancas SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE despesas SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE categorias_financeiras SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE formas_pagamento SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;
UPDATE movimentacoes_bancarias SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' WHERE empresa_id IS NULL;

-- 6. Verificar se a tabela empresas existe e criar se necessário
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Inserir empresa padrão se não existir
INSERT INTO empresas (id, nome, cnpj, email) 
VALUES ('d9c4338e-42b1-421c-a119-60cabfcb88ac', 'Empresa Padrão', '00.000.000/0000-00', 'contato@empresa.com')
ON CONFLICT (id) DO NOTHING;

-- 8. Verificar estrutura final
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN (
    'clientes',
    'pipelines', 
    'pipeline_etapas',
    'negocios',
    'contatos',
    'cobrancas',
    'despesas',
    'categorias_financeiras',
    'formas_pagamento',
    'movimentacoes_bancarias'
)
AND column_name = 'empresa_id'
ORDER BY table_name;
