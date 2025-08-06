-- Script para corrigir o problema do endereço da empresa
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o campo endereco existe
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
AND column_name = 'endereco';

-- 2. Se não existir, adicionar o campo endereco
ALTER TABLE empresas_proprias 
ADD COLUMN IF NOT EXISTS endereco JSONB;

-- 3. Verificar dados atuais
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  endereco,
  created_at,
  updated_at
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. Atualizar registros existentes com endereco padrão se estiver NULL
UPDATE empresas_proprias 
SET endereco = '{
  "logradouro": "",
  "numero": "",
  "complemento": "",
  "bairro": "",
  "cidade": "",
  "estado": "",
  "cep": ""
}'::jsonb
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' 
AND (endereco IS NULL OR endereco = '{}'::jsonb);

-- 5. Inserir dados de teste com endereco completo
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
  'Empresa Teste LTDA',
  'Empresa Teste',
  '12.345.678/0001-90',
  '123456789',
  'contato@empresateste.com',
  '(11) 99999-9999',
  '{
    "logradouro": "Rua das Flores",
    "numero": "123",
    "complemento": "Sala 101",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  }'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (workspace_id) DO UPDATE SET
  razao_social = EXCLUDED.razao_social,
  nome_fantasia = EXCLUDED.nome_fantasia,
  cnpj = EXCLUDED.cnpj,
  inscricao_estadual = EXCLUDED.inscricao_estadual,
  email = EXCLUDED.email,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco,
  updated_at = NOW();

-- 6. Verificar resultado final
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  endereco,
  created_at,
  updated_at
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 7. Mensagem de sucesso
SELECT 'Endereço da empresa corrigido com sucesso!' as status; 