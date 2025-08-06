-- 1. Verificar e criar bucket de avatars
SELECT name, public FROM storage.buckets WHERE name = 'avatars';

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Adicionar campo avatar_url na tabela membros
ALTER TABLE public.membros 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. Comentário para documentar o campo
COMMENT ON COLUMN public.membros.avatar_url IS 'URL da imagem de avatar do membro';

-- 4. Verificar se tudo foi configurado corretamente
SELECT 
    'Bucket avatars' as item,
    CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'avatars') 
         THEN '✅ Criado' 
         ELSE '❌ Não encontrado' 
    END as status
UNION ALL
SELECT 
    'Campo avatar_url' as item,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'membros' AND column_name = 'avatar_url'
    ) 
    THEN '✅ Adicionado' 
    ELSE '❌ Não encontrado' 
    END as status;

-- 5. Mostrar estrutura atual da tabela membros
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'membros' 
ORDER BY ordinal_position; 