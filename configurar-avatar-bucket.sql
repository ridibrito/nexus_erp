-- Configuração do bucket de avatars no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Criar bucket de avatars (se não existir)
-- Nota: O bucket deve ser criado manualmente no Dashboard do Supabase
-- Nome: avatars
-- Público: true

-- 2. Políticas RLS para o bucket avatars

-- Permitir que usuários autenticados façam upload de seus próprios avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários autenticados vejam seus próprios avatars
CREATE POLICY "Users can view own avatar" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários autenticados atualizem seus próprios avatars
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários autenticados removam seus próprios avatars
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Política mais permissiva para desenvolvimento (temporária)
-- Comentar as políticas acima e usar esta durante o desenvolvimento
/*
CREATE POLICY "Allow authenticated users to manage avatars" ON storage.objects
FOR ALL USING (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);
*/

-- 3. Função para obter URL do avatar do usuário atual
CREATE OR REPLACE FUNCTION get_user_avatar_url()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT avatar_url 
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Função para atualizar avatar do usuário
CREATE OR REPLACE FUNCTION update_user_avatar(avatar_url TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{avatar_url}',
    to_jsonb(avatar_url)
  )
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON FUNCTION get_user_avatar_url() IS 'Obtém a URL do avatar do usuário atual';
COMMENT ON FUNCTION update_user_avatar(TEXT) IS 'Atualiza o avatar do usuário atual'; 