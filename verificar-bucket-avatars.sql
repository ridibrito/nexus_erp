-- Verificar se o bucket de avatars existe
SELECT name, public FROM storage.buckets WHERE name = 'avatars';

-- Se não existir, criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar se foi criado
SELECT name, public FROM storage.buckets WHERE name = 'avatars'; 