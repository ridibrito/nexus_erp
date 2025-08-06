-- Verificar a estrutura real da tabela empresas_proprias
-- Execute este script no Supabase SQL Editor

-- 1. Verificar todas as colunas da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'empresas_proprias' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'empresas_proprias'
);

-- 3. Verificar dados existentes (se houver)
SELECT * FROM public.empresas_proprias LIMIT 5; 