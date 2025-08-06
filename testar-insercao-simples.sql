-- Testar inserção simples sem ON CONFLICT

-- 1. Verificar dados atuais
SELECT 
  'DADOS ATUAIS' as info,
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  endereco
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 2. Deletar registro existente se houver
DELETE FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. Inserir dados de teste
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

-- 4. Verificar se a inserção funcionou
SELECT 
  'INSERÇÃO TESTE' as info,
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

-- 5. Testar atualização
UPDATE empresas_proprias 
SET 
  razao_social = 'Nexus ERP Atualizado LTDA',
  nome_fantasia = 'Nexus ERP Atualizado',
  endereco = '{"logradouro": "Avenida Atualizada", "numero": "200", "complemento": "Sala 20", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
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
  updated_at
FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 