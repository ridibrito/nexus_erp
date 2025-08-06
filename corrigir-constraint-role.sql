-- CORRIGIR CONSTRAINT DE ROLE
-- O valor 'membro' não está sendo aceito, precisamos incluir todos os valores

-- 1. Verificar valores atuais na tabela membros
SELECT DISTINCT role FROM public.membros;

-- 2. Corrigir a constraint para incluir todos os valores possíveis
ALTER TABLE public.usuarios 
DROP CONSTRAINT IF EXISTS usuarios_role_check;

ALTER TABLE public.usuarios 
ADD CONSTRAINT usuarios_role_check 
CHECK (role IN ('admin', 'membro', 'usuario'));

-- 3. Verificar se a constraint foi aplicada
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name = 'usuarios_role_check';

-- 4. Tentar migração novamente
INSERT INTO public.usuarios (
    id, empresa_id, auth_user_id, nome, email, 
    cargo, role, is_active, created_at, updated_at
)
SELECT 
    gen_random_uuid() as id,
    m.workspace_id as empresa_id,
    m.user_id as auth_user_id,
    COALESCE(u.raw_user_meta_data->>'nome', 'Usuário') as nome,
    COALESCE(u.email, 'usuario@empresa.com') as email,
    'Usuário' as cargo,
    m.role,
    m.is_active,
    m.created_at,
    m.updated_at
FROM public.membros m
LEFT JOIN auth.users u ON m.user_id = u.id
WHERE m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' -- Nexus workspace
ON CONFLICT DO NOTHING;

-- 5. Verificar resultado
SELECT 
    '✅ Migração de Usuários' as status,
    COUNT(*) as total_usuarios
FROM public.usuarios; 