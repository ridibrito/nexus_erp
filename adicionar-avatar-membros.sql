-- Adicionar campo avatar_url na tabela membros
ALTER TABLE public.membros 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Comentário para documentar o campo
COMMENT ON COLUMN public.membros.avatar_url IS 'URL da imagem de avatar do membro';

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'membros' AND column_name = 'avatar_url'; 