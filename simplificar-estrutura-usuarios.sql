-- Simplificar estrutura: usar apenas membros para dados de negócio
-- Remover dependência desnecessária do auth.users

-- 1. Adicionar campos necessários na tabela membros
ALTER TABLE public.membros 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS telefone VARCHAR(20),
ADD COLUMN IF NOT EXISTS data_nascimento DATE,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Comentários para documentar
COMMENT ON COLUMN public.membros.avatar_url IS 'URL da imagem de avatar do membro';
COMMENT ON COLUMN public.membros.telefone IS 'Telefone do membro';
COMMENT ON COLUMN public.membros.data_nascimento IS 'Data de nascimento do membro';
COMMENT ON COLUMN public.membros.bio IS 'Biografia/descrição do membro';

-- 3. Verificar estrutura final
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'membros' 
ORDER BY ordinal_position;

-- 4. Explicação da simplificação
SELECT 
    '✅ Estrutura Simplificada' as status,
    'Apenas tabela membros para dados de negócio' as descricao,
    'auth.users apenas para autenticação' as observacao; 