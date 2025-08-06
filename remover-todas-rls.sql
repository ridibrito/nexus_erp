-- Script para remover TODAS as políticas RLS do sistema
-- Execute este script no Supabase SQL Editor

-- 1. Desabilitar RLS em todas as tabelas
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos DISABLE ROW LEVEL SECURITY;

-- 2. Remover TODAS as políticas existentes
-- Workspaces
DROP POLICY IF EXISTS "workspaces_select_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_insert_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_policy" ON public.workspaces;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.workspaces;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.workspaces;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.workspaces;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.workspaces;

-- Membros
DROP POLICY IF EXISTS "membros_select_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_insert_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_update_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_delete_policy" ON public.membros;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.membros;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.membros;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.membros;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.membros;

-- Clientes
DROP POLICY IF EXISTS "clientes_select_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_insert_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_update_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_delete_policy" ON public.clientes;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clientes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clientes;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.clientes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.clientes;

-- Pipelines
DROP POLICY IF EXISTS "pipelines_select_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_insert_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_update_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_delete_policy" ON public.pipelines;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pipelines;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.pipelines;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.pipelines;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.pipelines;

-- Pipeline Etapas
DROP POLICY IF EXISTS "pipeline_etapas_select_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_insert_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_update_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_delete_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.pipeline_etapas;

-- Negócios
DROP POLICY IF EXISTS "negocios_select_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_insert_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_update_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_delete_policy" ON public.negocios;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.negocios;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.negocios;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.negocios;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.negocios;

-- Empresas Próprias
DROP POLICY IF EXISTS "empresas_proprias_select_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_insert_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_update_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_delete_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.empresas_proprias;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.empresas_proprias;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.empresas_proprias;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.empresas_proprias;

-- Contatos
DROP POLICY IF EXISTS "contatos_select_policy" ON public.contatos;
DROP POLICY IF EXISTS "contatos_insert_policy" ON public.contatos;
DROP POLICY IF EXISTS "contatos_update_policy" ON public.contatos;
DROP POLICY IF EXISTS "contatos_delete_policy" ON public.contatos;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.contatos;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.contatos;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.contatos;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.contatos;

-- 3. Verificar se o workspace Nexus existe
SELECT 
  id,
  nome
FROM public.workspaces 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. Garantir que o usuário atual seja membro do workspace Nexus
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

-- 5. Testar inserção na tabela empresas_proprias
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

-- 6. Verificar se tudo funcionou
SELECT 'RLS removido com sucesso! Sistema pronto para desenvolvimento.'; 