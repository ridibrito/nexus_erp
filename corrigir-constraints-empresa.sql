-- Corrigir constraints da tabela empresas_proprias

-- 1. Verificar constraints existentes
SELECT 
  'CONSTRAINTS EXISTENTES' as info,
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'empresas_proprias'::regclass;

-- 2. Adicionar constraint única no workspace_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conrelid = 'empresas_proprias'::regclass 
      AND contype = 'u' 
      AND conname LIKE '%workspace_id%'
  ) THEN
    ALTER TABLE empresas_proprias ADD CONSTRAINT empresas_proprias_workspace_id_unique UNIQUE (workspace_id);
    RAISE NOTICE 'Constraint única adicionada em workspace_id';
  ELSE
    RAISE NOTICE 'Constraint única em workspace_id já existe';
  END IF;
END $$;

-- 3. Verificar se há registros duplicados
SELECT 
  'REGISTROS DUPLICADOS' as info,
  workspace_id,
  COUNT(*) as total_registros
FROM empresas_proprias 
GROUP BY workspace_id 
HAVING COUNT(*) > 1;

-- 4. Se houver duplicatas, manter apenas o mais recente
WITH duplicatas AS (
  SELECT 
    workspace_id,
    id,
    ROW_NUMBER() OVER (PARTITION BY workspace_id ORDER BY updated_at DESC, created_at DESC) as rn
  FROM empresas_proprias
)
DELETE FROM empresas_proprias 
WHERE id IN (
  SELECT id FROM duplicatas WHERE rn > 1
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

-- 6. Verificar constraints finais
SELECT 
  'CONSTRAINTS FINAIS' as info,
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'empresas_proprias'::regclass;

-- 7. Testar inserção com ON CONFLICT
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

-- 8. Verificar dados finais
SELECT 
  'DADOS FINAIS' as info,
  id,
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
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 