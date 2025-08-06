-- Remover campo avatar_url da tabela membros (não é necessário)
ALTER TABLE public.membros 
DROP COLUMN IF EXISTS avatar_url;

-- Verificar que foi removido
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'membros' 
ORDER BY ordinal_position; 