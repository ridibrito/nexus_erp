-- Testar RLS da tabela empresas
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se RLS está ativo na tabela empresas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'empresas';

-- 2. Verificar políticas RLS da tabela empresas
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

-- 3. Testar função get_empresa_id()
SELECT get_empresa_id() as empresa_id_atual;

-- 4. Verificar se a empresa padrão existe
SELECT * FROM empresas WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. Testar acesso direto (deve retornar dados se RLS estiver configurado corretamente)
SELECT 
    id,
    nome,
    cnpj,
    email
FROM empresas 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 6. Verificar se há triggers configurados
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'empresas';

-- 7. Verificar se a função set_empresa_id existe
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'set_empresa_id';
