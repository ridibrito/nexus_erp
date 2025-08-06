-- Script para criar workspace e adicionar usuário como membro
-- Execute este script no Supabase SQL Editor

-- 1. Criar workspace padrão se não existir
INSERT INTO public.workspaces (id, nome, descricao, created_at, updated_at)
VALUES (
  'default-workspace-id',
  'Workspace Padrão',
  'Workspace padrão do sistema',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Adicionar usuário atual como membro do workspace
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do usuário atual
-- Você pode encontrar o user_id no Supabase Auth > Users
INSERT INTO public.membros (user_id, workspace_id, cargo, is_active, created_at, updated_at)
VALUES (
  'SEU_USER_ID_AQUI', -- Substitua pelo seu user_id
  'default-workspace-id',
  'Administrador',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (user_id, workspace_id) DO UPDATE SET
  is_active = true,
  updated_at = NOW();

-- 3. Verificar se foi criado corretamente
SELECT 
  w.id as workspace_id,
  w.nome as workspace_nome,
  m.user_id,
  m.cargo,
  m.is_active
FROM public.workspaces w
LEFT JOIN public.membros m ON m.workspace_id = w.id
WHERE w.id = 'default-workspace-id'; 