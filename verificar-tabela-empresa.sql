-- Script para verificar a estrutura da tabela empresas_proprias
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe e sua estrutura
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se existem dados na tabela
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  inscricao_municipal,
  email,
  telefone,
  endereco,
  created_at,
  updated_at
FROM public.empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. Testar inserção de dados de exemplo
INSERT INTO public.empresas_proprias (
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  inscricao_estadual,
  inscricao_municipal,
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
  '987654321',
  'contato@empresateste.com',
  '(11) 99999-9999',
  '{"logradouro": "Rua Teste", "numero": "123", "complemento": "Sala 1", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
  NOW(),
  NOW()
)
ON CONFLICT (workspace_id) DO UPDATE SET
  razao_social = EXCLUDED.razao_social,
  nome_fantasia = EXCLUDED.nome_fantasia,
  cnpj = EXCLUDED.cnpj,
  inscricao_estadual = EXCLUDED.inscricao_estadual,
  inscricao_municipal = EXCLUDED.inscricao_municipal,
  email = EXCLUDED.email,
  telefone = EXCLUDED.telefone,
  endereco = EXCLUDED.endereco,
  updated_at = NOW();

-- 4. Verificar se a inserção funcionou
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  cnpj,
  email,
  telefone,
  endereco
FROM public.empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 