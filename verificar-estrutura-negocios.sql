-- Script para verificar a estrutura da tabela negocios
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar a estrutura da tabela negocios
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'negocios' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se há constraints na tabela
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'negocios' 
AND tc.table_schema = 'public';

-- 3. Verificar se há triggers na tabela
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'negocios'
AND trigger_schema = 'public';

-- 4. Verificar os dados atuais da tabela negocios
SELECT 
    id,
    titulo,
    empresa_id,
    created_at
FROM public.negocios 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Verificar se há RLS (Row Level Security) ativo
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
WHERE tablename = 'negocios';
