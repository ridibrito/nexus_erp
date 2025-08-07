-- Testar tabela empresas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela empresas existe
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'empresas'
) as tabela_empresas_existe;

-- 2. Verificar estrutura da tabela empresas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'empresas'
ORDER BY ordinal_position;

-- 3. Verificar se há dados na tabela empresas
SELECT COUNT(*) as total_empresas FROM empresas;

-- 4. Listar todas as empresas
SELECT * FROM empresas;

-- 5. Verificar se a empresa padrão existe
SELECT * FROM empresas WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 6. Verificar se há usuários com empresa_id
SELECT 
    u.id,
    u.auth_user_id,
    u.empresa_id,
    e.nome as empresa_nome
FROM usuarios u
LEFT JOIN empresas e ON u.empresa_id = e.id
WHERE u.is_active = true;

-- 7. Testar RLS - verificar se as políticas estão ativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'empresas';
