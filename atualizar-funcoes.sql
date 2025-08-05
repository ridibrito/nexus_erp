-- Script para adicionar apenas as funções que estão faltando
-- Execute este código no SQL Editor do Supabase

-- Função para criar convite para novo usuário
CREATE OR REPLACE FUNCTION public.criar_convite_usuario(
    p_email TEXT,
    p_nome TEXT,
    p_role TEXT DEFAULT 'membro',
    p_permissions JSONB DEFAULT '{"financeiro": false, "vendas": false, "estoque": false, "relatorios": false}'
)
RETURNS TEXT AS $$
DECLARE
    workspace_id UUID;
    token TEXT;
BEGIN
    -- Obter workspace do usuário atual
    SELECT ep.workspace_id INTO workspace_id
    FROM public.empresas_proprias ep
    INNER JOIN public.membros m ON ep.workspace_id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.role = 'admin' AND m.is_active = true
    LIMIT 1;

    IF workspace_id IS NULL THEN
        RAISE EXCEPTION 'Usuário não tem permissão para criar convites';
    END IF;

    -- Gerar token único
    token := encode(gen_random_bytes(32), 'hex');

    -- Criar convite
    INSERT INTO public.convites_usuarios (
        workspace_id, 
        email, 
        nome, 
        role, 
        permissions, 
        token, 
        expires_at,
        created_by
    ) VALUES (
        workspace_id,
        p_email,
        p_nome,
        p_role,
        p_permissions,
        token,
        NOW() + INTERVAL '7 days',
        auth.uid()
    );

    RETURN token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aceitar convite
CREATE OR REPLACE FUNCTION public.aceitar_convite(p_token TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    convite_record RECORD;
BEGIN
    -- Buscar convite válido
    SELECT * INTO convite_record
    FROM public.convites_usuarios
    WHERE token = p_token 
    AND expires_at > NOW() 
    AND accepted_at IS NULL;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Adicionar usuário ao workspace
    INSERT INTO public.membros (
        workspace_id, 
        user_id, 
        role, 
        permissions
    ) VALUES (
        convite_record.workspace_id,
        auth.uid(),
        convite_record.role,
        convite_record.permissions
    );

    -- Marcar convite como aceito
    UPDATE public.convites_usuarios 
    SET accepted_at = NOW()
    WHERE id = convite_record.id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para remover usuário do workspace
CREATE OR REPLACE FUNCTION public.remover_usuario_workspace(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    workspace_id UUID;
BEGIN
    -- Obter workspace do usuário atual
    SELECT ep.workspace_id INTO workspace_id
    FROM public.empresas_proprias ep
    INNER JOIN public.membros m ON ep.workspace_id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.role = 'admin' AND m.is_active = true
    LIMIT 1;

    IF workspace_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Remover usuário (não pode remover a si mesmo)
    IF p_user_id = auth.uid() THEN
        RETURN FALSE;
    END IF;

    DELETE FROM public.membros 
    WHERE workspace_id = workspace_id 
    AND user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar permissões de usuário
CREATE OR REPLACE FUNCTION public.atualizar_permissoes_usuario(
    p_user_id UUID,
    p_permissions JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    workspace_id UUID;
BEGIN
    -- Obter workspace do usuário atual
    SELECT ep.workspace_id INTO workspace_id
    FROM public.empresas_proprias ep
    INNER JOIN public.membros m ON ep.workspace_id = m.workspace_id
    WHERE m.user_id = auth.uid() AND m.role = 'admin' AND m.is_active = true
    LIMIT 1;

    IF workspace_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Atualizar permissões
    UPDATE public.membros 
    SET permissions = p_permissions
    WHERE workspace_id = workspace_id 
    AND user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se as funções foram criadas
SELECT 'Funções de gestão de usuários criadas com sucesso!' as status; 