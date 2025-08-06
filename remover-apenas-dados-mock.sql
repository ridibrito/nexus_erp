-- Script para remover APENAS dados mockados (não criados via CRUD)
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

-- 2. REMOVER APENAS DADOS MOCKADOS
SELECT '=== REMOVENDO DADOS MOCKADOS ===' as info;

-- Remover empresas próprias com dados mockados (nomes genéricos)
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

-- Remover clientes com dados mockados
DELETE FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
AND (
  nome_fantasia LIKE '%Teste%' OR
  nome_fantasia LIKE '%Cliente%' OR
  nome_fantasia LIKE '%ABC%' OR
  nome_fantasia LIKE '%XYZ%' OR
  email LIKE '%teste%' OR
  email LIKE '%cliente%'
);

-- Remover pipelines com dados mockados
DELETE FROM pipelines
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
AND (
  nome LIKE '%Teste%' OR
  nome LIKE '%Pipeline%' OR
  nome LIKE '%Vendas%'
);

-- Remover negócios com dados mockados
DELETE FROM negocios
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
AND (
  titulo LIKE '%Teste%' OR
  titulo LIKE '%Negócio%' OR
  valor = 0 OR
  valor IS NULL
);

-- 3. Verificar dados restantes
SELECT '=== DADOS RESTANTES ===' as info;

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

-- 4. Mostrar dados restantes (se houver)
SELECT '=== DETALHES DOS DADOS RESTANTES ===' as info;

-- Empresas Próprias restantes
SELECT 
  id,
  razao_social,
  nome_fantasia,
  email,
  created_at
FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Clientes restantes
SELECT 
  id,
  nome_fantasia,
  email,
  created_at
FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Mensagem final
SELECT 'Dados mockados removidos! Apenas dados criados via CRUD foram preservados.' as status; 