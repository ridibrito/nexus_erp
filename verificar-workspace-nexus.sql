-- Script para verificar e corrigir o workspace Nexus
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se o workspace Nexus existe
SELECT 
  id,
  nome,
  descricao,
  created_at,
  updated_at
FROM public.workspaces 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 2. Verificar se o usuário atual é membro do workspace
SELECT 
  m.user_id,
  m.workspace_id,
  m.cargo,
  m.is_active,
  m.created_at,
  m.updated_at,
  w.nome as workspace_nome
FROM public.membros m
JOIN public.workspaces w ON w.id = m.workspace_id
WHERE m.user_id = auth.uid()
AND m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. Se o usuário não for membro, adicionar como membro ativo
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

-- 4. Verificar se a tabela empresas_proprias existe e tem dados
SELECT 
  id,
  workspace_id,
  razao_social,
  nome_fantasia,
  created_at,
  updated_at
FROM public.empresas_proprias 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Resultado final - verificar tudo
SELECT 
  'Workspace' as tipo,
  w.id,
  w.nome,
  w.descricao
FROM public.workspaces w
WHERE w.id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'

UNION ALL

SELECT 
  'Membro' as tipo,
  m.workspace_id as id,
  m.cargo as nome,
  CASE WHEN m.is_active THEN 'Ativo' ELSE 'Inativo' END as descricao
FROM public.membros m
WHERE m.user_id = auth.uid()
AND m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'

UNION ALL

SELECT 
  'Empresa' as tipo,
  ep.workspace_id as id,
  COALESCE(ep.razao_social, 'Não configurada') as nome,
  COALESCE(ep.nome_fantasia, '') as descricao
FROM public.empresas_proprias ep
WHERE ep.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'; 