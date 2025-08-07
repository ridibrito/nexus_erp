-- Verificar estrutura atual do banco de dados
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se as tabelas existem
SELECT 
  'TABELAS EXISTENTES' as info,
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('empresas', 'usuarios', 'clientes', 'pipelines', 'negocios')
ORDER BY table_name;

-- 2. Verificar estrutura da tabela usuarios
SELECT 
  'ESTRUTURA USUARIOS' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Verificar estrutura da tabela empresas
SELECT 
  'ESTRUTURA EMPRESAS' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Verificar se a tabela clientes existe e sua estrutura
SELECT 
  'EXISTE TABELA CLIENTES?' as info,
  COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'clientes';

-- 5. Se a tabela clientes existe, verificar sua estrutura
SELECT 
  'ESTRUTURA CLIENTES' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Verificar se há dados nas tabelas
SELECT 
  'DADOS EM USUARIOS' as info,
  COUNT(*) as total_usuarios
FROM public.usuarios;

SELECT 
  'DADOS EM EMPRESAS' as info,
  COUNT(*) as total_empresas
FROM public.empresas;

SELECT 
  'DADOS EM CLIENTES' as info,
  COUNT(*) as total_clientes
FROM public.clientes;

SELECT 
  'DADOS EM PIPELINES' as info,
  COUNT(*) as total_pipelines
FROM public.pipelines;

SELECT 
  'DADOS EM NEGOCIOS' as info,
  COUNT(*) as total_negocios
FROM public.negocios;

-- 7. Verificar se há usuários no auth
SELECT 
  'USUÁRIOS NO AUTH' as info,
  COUNT(*) as total_users
FROM auth.users;

-- 8. Verificar se há usuários para empresas específicas
SELECT 
  'USUARIOS POR EMPRESA' as info,
  u.id,
  u.empresa_id,
  u.cargo,
  u.is_active,
  u.nome,
  u.email
FROM public.usuarios u
ORDER BY u.created_at DESC
LIMIT 10;

-- 9. Verificar se as tabelas de negócios existem
SELECT 
  'TABELAS DE NEGOCIOS' as info,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%negocio%'
ORDER BY table_name;

-- 10. Verificar todas as tabelas que começam com 'c'
SELECT 
  'TABELAS QUE COMEÇAM COM C' as info,
  table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'c%'
ORDER BY table_name;
