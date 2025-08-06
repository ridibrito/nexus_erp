-- Script para limpar todos os dados mockados da tabela empresas_proprias
-- Execute este script no Supabase SQL Editor

-- 1. Verificar dados atuais
SELECT 
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

-- 2. Deletar todos os registros do workspace Nexus
DELETE FROM empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. Verificar se os dados foram removidos
SELECT 
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

-- 4. Mensagem de confirmação
SELECT 'Dados mockados removidos com sucesso! Agora você pode preencher com dados reais.' as status; 