-- Script para desabilitar RLS durante desenvolvimento
-- Execute este script no Supabase SQL Editor

-- Desabilitar RLS em todas as tabelas principais
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias DISABLE ROW LEVEL SECURITY;

-- Verificar se o workspace Nexus existe
SELECT 
  id,
  nome,
  descricao
FROM public.workspaces 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Garantir que o usuário atual seja membro do workspace Nexus
INSERT INTO public.membros (user_id, workspace_id, cargo, is_active, created_at, updated_at)
VALUES (
  auth.uid(),
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Administrador',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, workspace_id) DO UPDATE SET
  is_active = true,
  cargo = 'Administrador',
  updated_at = NOW();

-- Testar inserção direta na tabela empresas_proprias
INSERT INTO public.empresas_proprias (
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
  '{"logradouro": "Rua Teste", "numero": "123", "complemento": "Sala 1", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
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

-- Verificar se a inserção funcionou
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  email,
  telefone
FROM public.empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 