-- Debug completo da tabela empresas_proprias

-- 1. Verificar estrutura da tabela
SELECT 
  'ESTRUTURA DA TABELA' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se a tabela existe
SELECT 
  'TABELA EXISTE' as info,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'empresas_proprias' 
      AND table_schema = 'public'
  ) as tabela_existe;

-- 3. Verificar se o workspace Nexus existe
SELECT 
  'WORKSPACE NEXUS' as info,
  id,
  nome,
  created_at
FROM workspaces 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. Verificar se o usuário é membro do workspace
SELECT 
  'MEMBRO WORKSPACE' as info,
  m.id,
  m.user_id,
  m.workspace_id,
  m.is_active,
  m.created_at
FROM membros m
WHERE m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Verificar dados atuais da empresa
SELECT 
  'DADOS EMPRESA' as info,
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

-- 6. Verificar se há problemas com o campo endereco
SELECT 
  'PROBLEMAS ENDERECO' as info,
  id,
  workspace_id,
  CASE 
    WHEN endereco IS NULL THEN 'NULL'
    WHEN endereco = '{}' THEN 'VAZIO'
    WHEN endereco = 'null' THEN 'STRING NULL'
    WHEN jsonb_typeof(endereco) = 'object' THEN 'OBJETO VALIDO'
    ELSE 'OUTRO: ' || jsonb_typeof(endereco)
  END as tipo_endereco,
  endereco
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 7. Testar inserção de dados completos
DO $$
DECLARE
  empresa_id UUID;
BEGIN
  -- Inserir dados de teste
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
    'Empresa Debug LTDA',
    'Empresa Debug',
    '12.345.678/0001-90',
    '123456789',
    'debug@empresa.com',
    '(11) 99999-9999',
    '{"logradouro": "Rua Debug", "numero": "123", "complemento": "Sala 1", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
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
    updated_at = NOW()
  RETURNING id INTO empresa_id;
  
  RAISE NOTICE 'Empresa inserida/atualizada com ID: %', empresa_id;
END $$;

-- 8. Verificar dados após inserção
SELECT 
  'DADOS APÓS INSERÇÃO' as info,
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

-- 9. Testar consulta que o frontend faz
SELECT 
  'CONSULTA FRONTEND' as info,
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
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
LIMIT 1; 