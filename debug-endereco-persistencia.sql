-- Debug específico da persistência do campo endereco

-- 1. Verificar estrutura atual da tabela
SELECT 
  'ESTRUTURA ATUAL' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar dados atuais da empresa Nexus
SELECT 
  'DADOS ATUAIS' as info,
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  endereco,
  jsonb_typeof(endereco) as tipo_endereco,
  endereco IS NULL as endereco_null,
  endereco = '{}' as endereco_vazio,
  endereco = 'null' as endereco_string_null
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. Testar inserção com endereco completo
DELETE FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

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
  'Empresa Teste Endereco',
  'Teste Endereco',
  '12.345.678/0001-90',
  '123456789',
  'teste@endereco.com',
  '(11) 99999-9999',
  '{"logradouro": "Rua do Teste", "numero": "123", "complemento": "Sala 1", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
  NOW(),
  NOW()
);

-- 4. Verificar se a inserção funcionou
SELECT 
  'APÓS INSERÇÃO' as info,
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
  endereco->>'cep' as cep
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Testar atualização do endereco
UPDATE empresas_proprias 
SET 
  endereco = '{"logradouro": "Avenida Atualizada", "numero": "456", "complemento": "Sala 2", "bairro": "Vila Nova", "cidade": "São Paulo", "estado": "SP", "cep": "04567-890"}',
  updated_at = NOW()
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 6. Verificar dados após atualização
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
  endereco->>'cep' as cep
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 7. Testar consulta que o frontend faz
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