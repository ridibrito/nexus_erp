// Script para configurar schema de permissões no Supabase
// Execute com: node setup-schema-permissoes.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não encontradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const schemaSQL = `
-- Schema para sistema de permissões e multi-usuários
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj TEXT UNIQUE,
    inscricao_estadual TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários da empresa (relacionamento many-to-many)
CREATE TABLE IF NOT EXISTS public.empresa_usuarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    permissions JSONB DEFAULT '{"financeiro": false, "vendas": false, "estoque": false, "relatorios": false}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(empresa_id, user_id)
);

-- Tabela de convites para usuários
CREATE TABLE IF NOT EXISTS public.convites_usuarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    permissions JSONB DEFAULT '{"financeiro": false, "vendas": false, "estoque": false, "relatorios": false}',
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS on_empresas_updated ON public.empresas;
CREATE TRIGGER on_empresas_updated
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_empresa_usuarios_updated ON public.empresa_usuarios;
CREATE TRIGGER on_empresa_usuarios_updated
    BEFORE UPDATE ON public.empresa_usuarios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar empresa automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user_empresa()
RETURNS TRIGGER AS $$
DECLARE
    empresa_id UUID;
BEGIN
    -- Criar empresa baseada nos dados do usuário
    INSERT INTO public.empresas (razao_social, nome_fantasia, cnpj, email)
    VALUES (
        COALESCE(NEW.raw_user_meta_data->>'razao_social', 'Empresa ' || NEW.raw_user_meta_data->>'name'),
        COALESCE(NEW.raw_user_meta_data->>'nome_fantasia', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'cnpj',
        NEW.email
    ) RETURNING id INTO empresa_id;

    -- Adicionar usuário como admin da empresa
    INSERT INTO public.empresa_usuarios (empresa_id, user_id, role, permissions)
    VALUES (
        empresa_id,
        NEW.id,
        'admin',
        '{"financeiro": true, "vendas": true, "estoque": true, "relatorios": true}'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar empresa automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created_empresa ON auth.users;
CREATE TRIGGER on_auth_user_created_empresa
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_empresa();

-- Políticas RLS para empresas
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver empresas onde estão associados
CREATE POLICY "Users can view associated companies" ON public.empresas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.empresa_usuarios eu
            WHERE eu.empresa_id = empresas.id AND eu.user_id = auth.uid()
        )
    );

-- Apenas admins podem atualizar empresas
CREATE POLICY "Admins can update companies" ON public.empresas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.empresa_usuarios eu
            WHERE eu.empresa_id = empresas.id 
            AND eu.user_id = auth.uid() 
            AND eu.role = 'admin'
        )
    );

-- Políticas RLS para empresa_usuarios
ALTER TABLE public.empresa_usuarios ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver membros de empresas onde estão associados
CREATE POLICY "Users can view company members" ON public.empresa_usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.empresa_usuarios eu
            WHERE eu.empresa_id = empresa_usuarios.empresa_id AND eu.user_id = auth.uid()
        )
    );

-- Apenas admins podem gerenciar usuários
CREATE POLICY "Admins can manage users" ON public.empresa_usuarios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.empresa_usuarios eu
            WHERE eu.empresa_id = empresa_usuarios.empresa_id 
            AND eu.user_id = auth.uid() 
            AND eu.role = 'admin'
        )
    );

-- Políticas RLS para convites
ALTER TABLE public.convites_usuarios ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem gerenciar convites
CREATE POLICY "Admins can manage invites" ON public.convites_usuarios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.empresa_usuarios eu
            WHERE eu.empresa_id = convites_usuarios.empresa_id 
            AND eu.user_id = auth.uid() 
            AND eu.role = 'admin'
        )
    );

-- Funções auxiliares

-- Função para obter dados da empresa do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_empresa()
RETURNS TABLE (
    empresa_id UUID,
    razao_social TEXT,
    nome_fantasia TEXT,
    cnpj TEXT,
    inscricao_estadual TEXT,
    email TEXT,
    telefone TEXT,
    endereco TEXT,
    user_role TEXT,
    user_permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.razao_social,
        e.nome_fantasia,
        e.cnpj,
        e.inscricao_estadual,
        e.email,
        e.telefone,
        e.endereco,
        eu.role,
        eu.permissions
    FROM public.empresas e
    INNER JOIN public.empresa_usuarios eu ON e.id = eu.empresa_id
    WHERE eu.user_id = auth.uid() AND eu.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter usuários de uma empresa
CREATE OR REPLACE FUNCTION public.get_empresa_usuarios()
RETURNS TABLE (
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    role TEXT,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        eu.user_id,
        u.email,
        u.raw_user_meta_data->>'name' as user_name,
        eu.role,
        eu.permissions,
        eu.created_at,
        u.last_sign_in_at
    FROM public.empresa_usuarios eu
    INNER JOIN auth.users u ON eu.user_id = u.id
    WHERE eu.empresa_id = (
        SELECT empresa_id FROM public.get_user_empresa()
    )
    AND eu.is_active = true
    ORDER BY eu.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para atualizar dados da empresa
CREATE OR REPLACE FUNCTION public.update_empresa_data(
    p_razao_social TEXT DEFAULT NULL,
    p_nome_fantasia TEXT DEFAULT NULL,
    p_cnpj TEXT DEFAULT NULL,
    p_inscricao_estadual TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_telefone TEXT DEFAULT NULL,
    p_endereco TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    empresa_id UUID;
BEGIN
    -- Obter ID da empresa do usuário atual
    SELECT e.id INTO empresa_id
    FROM public.empresas e
    INNER JOIN public.empresa_usuarios eu ON e.id = eu.empresa_id
    WHERE eu.user_id = auth.uid() AND eu.role = 'admin' AND eu.is_active = true
    LIMIT 1;

    IF empresa_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Atualizar dados da empresa
    UPDATE public.empresas SET
        razao_social = COALESCE(p_razao_social, razao_social),
        nome_fantasia = COALESCE(p_nome_fantasia, nome_fantasia),
        cnpj = COALESCE(p_cnpj, cnpj),
        inscricao_estadual = COALESCE(p_inscricao_estadual, inscricao_estadual),
        email = COALESCE(p_email, email),
        telefone = COALESCE(p_telefone, telefone),
        endereco = COALESCE(p_endereco, endereco)
    WHERE id = empresa_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentários
COMMENT ON TABLE public.empresas IS 'Empresas do sistema ERP Nexus';
COMMENT ON TABLE public.empresa_usuarios IS 'Relacionamento entre usuários e empresas';
COMMENT ON TABLE public.convites_usuarios IS 'Convites para novos usuários';
COMMENT ON FUNCTION public.get_user_empresa() IS 'Obtém dados da empresa do usuário atual';
COMMENT ON FUNCTION public.get_empresa_usuarios() IS 'Obtém lista de usuários da empresa atual';
COMMENT ON FUNCTION public.update_empresa_data() IS 'Atualiza dados da empresa (apenas admins)';
`

async function setupSchema() {
  console.log('🚀 Configurando Schema de Permissões no Supabase...\n')

  try {
    // Executar o schema SQL
    const { error } = await supabase.rpc('exec_sql', { sql: schemaSQL })
    
    if (error) {
      console.error('❌ Erro ao executar schema:', error)
      console.log('\n📋 Execute manualmente no SQL Editor do Supabase:')
      console.log('1. Acesse: https://supabase.com/dashboard/project/[SEU_PROJETO]/sql')
      console.log('2. Cole o conteúdo do arquivo schema-permissoes.sql')
      console.log('3. Clique em "Run"')
      return
    }

    console.log('✅ Schema executado com sucesso!')
    
    // Verificar se as funções foram criadas
    console.log('\n🔍 Verificando funções criadas...')
    
    const functions = [
      'get_user_empresa',
      'get_empresa_usuarios', 
      'update_empresa_data'
    ]

    for (const func of functions) {
      try {
        const { error } = await supabase.rpc(func)
        if (error && error.message.includes('does not exist')) {
          console.log(`❌ Função ${func} não encontrada`)
        } else {
          console.log(`✅ Função ${func} criada com sucesso`)
        }
      } catch (err) {
        console.log(`❌ Erro ao verificar função ${func}:`, err.message)
      }
    }

    console.log('\n🎉 Schema configurado com sucesso!')
    console.log('📝 O sistema agora pode usar dados reais do Supabase')
    
  } catch (error) {
    console.error('❌ Erro durante configuração:', error)
    console.log('\n📋 Execute manualmente no SQL Editor do Supabase:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/[SEU_PROJETO]/sql')
    console.log('2. Cole o conteúdo do arquivo schema-permissoes.sql')
    console.log('3. Clique em "Run"')
  }
}

setupSchema() 