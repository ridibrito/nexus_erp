-- Script para configurar workspace automaticamente
-- Execute este script no Supabase SQL Editor

-- 1. Criar workspace padrão
INSERT INTO public.workspaces (id, nome, descricao, created_at, updated_at)
VALUES (
  'default-workspace-id',
  'Workspace Padrão',
  'Workspace padrão do sistema',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Função para adicionar usuário atual como membro
CREATE OR REPLACE FUNCTION adicionar_usuario_workspace()
RETURNS void AS $$
BEGIN
  INSERT INTO public.membros (user_id, workspace_id, cargo, is_active, created_at, updated_at)
  VALUES (
    auth.uid(),
    'default-workspace-id',
    'Administrador',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id, workspace_id) DO UPDATE SET
    is_active = true,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Executar a função para o usuário atual
SELECT adicionar_usuario_workspace();

-- 4. Verificar resultado
SELECT 
  w.id as workspace_id,
  w.nome as workspace_nome,
  m.user_id,
  m.cargo,
  m.is_active
FROM public.workspaces w
LEFT JOIN public.membros m ON m.workspace_id = w.id
WHERE w.id = 'default-workspace-id'; 