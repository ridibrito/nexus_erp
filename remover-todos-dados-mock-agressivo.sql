-- Script AGESSIVO para remover TODOS os dados mockados
-- Execute este script no Supabase SQL Editor

-- 1. Verificar dados atuais
SELECT '=== VERIFICANDO DADOS ATUAIS ===' as info;

-- Empresas Próprias
SELECT 'Empresas Próprias:' as tabela, COUNT(*) as total
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Clientes
SELECT 'Clientes:' as tabela, COUNT(*) as total
FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Negócios
SELECT 'Negócios:' as tabela, COUNT(*) as total
FROM negocios
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Pipelines
SELECT 'Pipelines:' as tabela, COUNT(*) as total
FROM pipelines
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 2. REMOVER TODOS OS DADOS MOCKADOS (AGESSIVO)
SELECT '=== REMOVENDO TODOS OS DADOS MOCKADOS ===' as info;

-- Remover TODOS os clientes (incluindo ABC, XYZ, etc.)
DELETE FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
AND (
  nome_fantasia LIKE '%ABC%' OR
  nome_fantasia LIKE '%XYZ%' OR
  nome_fantasia LIKE '%Startup%' OR
  nome_fantasia LIKE '%Fornecedor%' OR
  nome_fantasia LIKE '%Cliente%' OR
  nome_fantasia LIKE '%Teste%' OR
  nome_fantasia LIKE '%Empresa%' OR
  email LIKE '%teste%' OR
  email LIKE '%cliente%' OR
  email LIKE '%abc%' OR
  email LIKE '%xyz%'
);

-- Remover TODOS os negócios
DELETE FROM negocios
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Remover TODOS os pipelines
DELETE FROM pipelines
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Remover pipeline etapas (depende de pipelines)
DELETE FROM pipeline_etapas
WHERE pipeline_id IN (
  SELECT id FROM pipelines WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
);

-- Remover TODOS os contatos
DELETE FROM contatos
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Remover empresas próprias com dados mockados
DELETE FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
AND (
  razao_social LIKE '%Teste%' OR
  razao_social LIKE '%Empresa%' OR
  nome_fantasia LIKE '%Teste%' OR
  nome_fantasia LIKE '%Empresa%' OR
  cnpj = '12.345.678/0001-90' OR
  email LIKE '%teste%' OR
  email LIKE '%empresa%'
);

-- 3. Verificar se os dados foram removidos
SELECT '=== VERIFICAÇÃO FINAL ===' as info;

-- Empresas Próprias
SELECT 'Empresas Próprias:' as tabela, COUNT(*) as total
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Clientes
SELECT 'Clientes:' as tabela, COUNT(*) as total
FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Negócios
SELECT 'Negócios:' as tabela, COUNT(*) as total
FROM negocios
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Pipelines
SELECT 'Pipelines:' as tabela, COUNT(*) as total
FROM pipelines
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Pipeline Etapas
SELECT 'Pipeline Etapas:' as tabela, COUNT(*) as total
FROM pipeline_etapas
WHERE pipeline_id IN (
  SELECT id FROM pipelines WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
);

-- Contatos
SELECT 'Contatos:' as tabela, COUNT(*) as total
FROM contatos
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. Mostrar detalhes dos dados restantes (se houver)
SELECT '=== DETALHES DOS DADOS RESTANTES ===' as info;

-- Clientes restantes
SELECT 
  id,
  nome_fantasia,
  email,
  created_at
FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Empresas Próprias restantes
SELECT 
  id,
  razao_social,
  nome_fantasia,
  email,
  created_at
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Mensagem final
SELECT 'TODOS os dados mockados foram removidos agressivamente! Sistema limpo.' as status; 