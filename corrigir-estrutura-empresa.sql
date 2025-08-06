-- Garantir que todos os campos necessários existam na tabela empresas_proprias

-- Verificar se a coluna endereco existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'endereco'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN endereco JSONB DEFAULT '{}';
  END IF;
END $$;

-- Verificar se a coluna telefone existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'telefone'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN telefone VARCHAR(20);
  END IF;
END $$;

-- Verificar se a coluna email existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'email'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN email VARCHAR(255);
  END IF;
END $$;

-- Verificar se a coluna inscricao_estadual existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'inscricao_estadual'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN inscricao_estadual VARCHAR(50);
  END IF;
END $$;

-- Verificar se a coluna cnpj existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'cnpj'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN cnpj VARCHAR(20);
  END IF;
END $$;

-- Verificar se a coluna nome_fantasia existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'nome_fantasia'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN nome_fantasia VARCHAR(255);
  END IF;
END $$;

-- Verificar se a coluna razao_social existe, se não, criar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'razao_social'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN razao_social VARCHAR(255);
  END IF;
END $$;

-- Atualizar registros existentes com endereco vazio para ter estrutura padrão
UPDATE empresas_proprias 
SET endereco = '{"logradouro": "", "numero": "", "complemento": "", "bairro": "", "cidade": "", "estado": "", "cep": ""}'
WHERE endereco IS NULL OR endereco = '{}' OR endereco = 'null';

-- Verificar estrutura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Testar inserção de dados completos
INSERT INTO empresas_proprias (
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  email,
  telefone,
  endereco,
  created_at,
  updated_at
) VALUES (
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Nexus ERP LTDA',
  'Nexus ERP',
  '12.345.678/0001-90',
  '123456789',
  'contato@nexus.com',
  '(11) 99999-9999',
  '{"logradouro": "Rua das Empresas", "numero": "100", "complemento": "Sala 10", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
  NOW(),
  NOW()
) ON CONFLICT (workspace_id) DO UPDATE SET
  razao_social = EXCLUDED.razao_social,
  nome_fantasia = EXCLUDED.nome_fantasia,
  cnpj = EXCLUDED.cnpj,
  inscricao_estadual = EXCLUDED.inscricao_estadual,
  email = EXCLUDED.email,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco,
  updated_at = NOW();

-- Verificar dados finais
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  email,
  telefone,
  endereco
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 