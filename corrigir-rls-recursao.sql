-- Script para corrigir a recursão infinita nas políticas RLS
-- Execute este script no Supabase SQL Editor

-- 1. Desabilitar RLS temporariamente para corrigir as políticas
ALTER TABLE public.membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "membros_select_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_insert_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_update_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_delete_policy" ON public.membros;

DROP POLICY IF EXISTS "empresas_proprias_select_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_insert_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_update_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_delete_policy" ON public.empresas_proprias;

DROP POLICY IF EXISTS "workspaces_select_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_insert_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_policy" ON public.workspaces;

-- 3. Criar políticas simples e seguras
-- Políticas para membros
CREATE POLICY "membros_select_policy" ON public.membros
    FOR SELECT USING (true);

CREATE POLICY "membros_insert_policy" ON public.membros
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "membros_update_policy" ON public.membros
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "membros_delete_policy" ON public.membros
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para empresas_proprias
CREATE POLICY "empresas_proprias_select_policy" ON public.empresas_proprias
    FOR SELECT USING (true);

CREATE POLICY "empresas_proprias_insert_policy" ON public.empresas_proprias
    FOR INSERT WITH CHECK (true);

CREATE POLICY "empresas_proprias_update_policy" ON public.empresas_proprias
    FOR UPDATE USING (true);

CREATE POLICY "empresas_proprias_delete_policy" ON public.empresas_proprias
    FOR DELETE USING (true);

-- Políticas para workspaces
CREATE POLICY "workspaces_select_policy" ON public.workspaces
    FOR SELECT USING (true);

CREATE POLICY "workspaces_insert_policy" ON public.workspaces
    FOR INSERT WITH CHECK (true);

CREATE POLICY "workspaces_update_policy" ON public.workspaces
    FOR UPDATE USING (true);

CREATE POLICY "workspaces_delete_policy" ON public.workspaces
    FOR DELETE USING (true);

-- 4. Reabilitar RLS
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- 5. Verificar se o usuário é membro do workspace Nexus
SELECT 
  m.user_id,
  m.workspace_id,
  m.cargo,
  m.is_active,
  w.nome as workspace_nome
FROM public.membros m
JOIN public.workspaces w ON w.id = m.workspace_id
WHERE m.user_id = auth.uid()
AND m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 6. Se não for membro, adicionar
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

-- 7. Testar inserção na tabela empresas_proprias
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