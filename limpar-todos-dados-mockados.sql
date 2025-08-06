-- Script para limpar TODOS os dados mockados do sistema
-- Execute este script no Supabase SQL Editor

-- 1. Verificar dados atuais em todas as tabelas principais
SELECT '=== DADOS ATUAIS ===' as info;

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

-- 2. LIMPAR TODOS OS DADOS MOCKADOS
SELECT '=== LIMPANDO DADOS ===' as info;

-- Deletar dados em ordem (respeitando foreign keys)
-- Pipeline Etapas primeiro (depende de pipelines)
DELETE FROM pipeline_etapas
WHERE pipeline_id IN (
  SELECT id FROM pipelines WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
);

-- Negócios (pode depender de clientes, pipelines, etc.)
DELETE FROM negocios
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Pipelines
DELETE FROM pipelines
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Contatos
DELETE FROM contatos
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Clientes
DELETE FROM clientes
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Empresas Próprias
DELETE FROM empresas_proprias
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

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

-- 4. Mensagem de confirmação
SELECT 'TODOS os dados mockados foram removidos com sucesso! Sistema limpo para dados reais.' as status; 