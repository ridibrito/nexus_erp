-- Corrigir estrutura final da tabela empresas_proprias

-- 1. Garantir que a coluna endereco existe e é do tipo JSONB
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'empresas_proprias' 
      AND column_name = 'endereco'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE empresas_proprias ADD COLUMN endereco JSONB DEFAULT '{}';
  ELSE
    -- Verificar se é JSONB, se não, alterar
    IF (SELECT data_type FROM information_schema.columns 
        WHERE table_name = 'empresas_proprias' 
          AND column_name = 'endereco' 
          AND table_schema = 'public') != 'jsonb' THEN
      ALTER TABLE empresas_proprias ALTER COLUMN endereco TYPE JSONB USING endereco::jsonb;
    END IF;
  END IF;
END $$;

-- 2. Garantir que todas as outras colunas existem
DO $$
BEGIN
  -- Adicionar colunas se não existirem
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'razao_social') THEN
    ALTER TABLE empresas_proprias ADD COLUMN razao_social VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'nome_fantasia') THEN
    ALTER TABLE empresas_proprias ADD COLUMN nome_fantasia VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'cnpj') THEN
    ALTER TABLE empresas_proprias ADD COLUMN cnpj VARCHAR(20);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'inscricao_estadual') THEN
    ALTER TABLE empresas_proprias ADD COLUMN inscricao_estadual VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'email') THEN
    ALTER TABLE empresas_proprias ADD COLUMN email VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'empresas_proprias' AND column_name = 'telefone') THEN
    ALTER TABLE empresas_proprias ADD COLUMN telefone VARCHAR(20);
  END IF;
END $$;

-- 3. Limpar dados existentes e inserir dados de teste
DELETE FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. Inserir dados de teste com endereco completo
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
);

-- 5. Verificar estrutura final
SELECT 
  'ESTRUTURA FINAL' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Verificar dados inseridos
SELECT 
  'DADOS INSERIDOS' as info,
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  email,
  telefone,
  endereco,
  jsonb_typeof(endereco) as tipo_endereco,
  endereco->>'logradouro' as logradouro,
  endereco->>'numero' as numero,
  endereco->>'complemento' as complemento,
  endereco->>'bairro' as bairro,
  endereco->>'cidade' as cidade,
  endereco->>'estado' as estado,
  endereco->>'cep' as cep,
  created_at,
  updated_at
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 7. Testar atualização do endereco
UPDATE empresas_proprias 
SET 
  endereco = '{"logradouro": "Avenida Atualizada", "numero": "200", "complemento": "Sala 20", "bairro": "Vila Nova", "cidade": "São Paulo", "estado": "SP", "cep": "04567-890"}',
  updated_at = NOW()
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 8. Verificar dados após atualização
SELECT 
  'APÓS ATUALIZAÇÃO' as info,
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  endereco,
  jsonb_typeof(endereco) as tipo_endereco,
  endereco->>'logradouro' as logradouro,
  endereco->>'numero' as numero,
  endereco->>'complemento' as complemento,
  endereco->>'bairro' as bairro,
  endereco->>'cidade' as cidade,
  endereco->>'estado' as estado,
  endereco->>'cep' as cep,
  updated_at
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 