-- SIMPLIFICAR ESTRUTURA COMPLETA
-- Criar tabelas e migrar dados em uma única execução

-- 1. CRIAR TABELAS SIMPLIFICADAS

-- EMPRESA (substitui workspace + empresa_propria)
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    razao_social VARCHAR(255),
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(18),
    inscricao_estadual VARCHAR(20),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco JSONB DEFAULT '{}',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- USUARIO (substitui membros)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    auth_user_id UUID, -- Referência opcional ao Supabase Auth
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    telefone VARCHAR(20),
    avatar_url TEXT,
    role TEXT DEFAULT 'usuario' CHECK (role IN ('admin', 'membro', 'usuario')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MIGRAR DADOS DA EMPRESA

INSERT INTO public.empresas (
    id, nome, razao_social, nome_fantasia, cnpj, 
    inscricao_estadual, email, telefone, endereco, 
    is_active, created_at, updated_at
)
SELECT 
    w.id,
    COALESCE(ep.razao_social, w.nome) as nome,
    ep.razao_social,
    ep.nome_fantasia,
    ep.cnpj,
    ep.inscricao_estadual,
    ep.email,
    ep.telefone,
    COALESCE(ep.endereco, '{}') as endereco,
    true as is_active,
    w.created_at,
    w.updated_at
FROM public.workspaces w
LEFT JOIN public.empresas_proprias ep ON w.id = ep.workspace_id
WHERE w.id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' -- Nexus workspace
ON CONFLICT (id) DO NOTHING;

-- 3. MIGRAR USUÁRIOS

INSERT INTO public.usuarios (
    id, empresa_id, auth_user_id, nome, email, 
    cargo, role, is_active, created_at, updated_at
)
SELECT 
    gen_random_uuid() as id,
    m.workspace_id as empresa_id,
    m.user_id as auth_user_id,
    COALESCE(u.raw_user_meta_data->>'nome', 'Usuário') as nome,
    COALESCE(u.email, 'usuario@empresa.com') as email,
    'Usuário' as cargo,
    m.role,
    m.is_active,
    m.created_at,
    m.updated_at
FROM public.membros m
LEFT JOIN auth.users u ON m.user_id = u.id
WHERE m.workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac' -- Nexus workspace
ON CONFLICT DO NOTHING;

-- 4. ATUALIZAR REFERÊNCIAS NAS OUTRAS TABELAS

-- Atualizar clientes
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES public.empresas(id);

UPDATE public.clientes 
SET empresa_id = workspace_id 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Atualizar negócios
ALTER TABLE public.negocios 
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES public.empresas(id);

UPDATE public.negocios 
SET empresa_id = workspace_id 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- Atualizar pipelines
ALTER TABLE public.pipelines 
ADD COLUMN IF NOT EXISTS empresa_id UUID REFERENCES public.empresas(id);

UPDATE public.pipelines 
SET empresa_id = workspace_id 
WHERE workspace_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 5. VERIFICAR MIGRAÇÃO

SELECT 
    '✅ Migração Concluída' as status,
    COUNT(*) as total_empresas
FROM public.empresas;

SELECT 
    '👥 Usuários Migrados' as status,
    COUNT(*) as total_usuarios
FROM public.usuarios;

-- 6. MOSTRAR DADOS MIGRADOS

SELECT 
    '🏢 Empresa' as tipo,
    id,
    nome,
    razao_social
FROM public.empresas;

SELECT 
    '👤 Usuário' as tipo,
    id,
    nome,
    email,
    role
FROM public.usuarios;

-- 7. EXPLICAÇÃO DA SIMPLIFICAÇÃO

SELECT 
    '🎯 Estrutura Simplificada' as conceito,
    'Empresa → Usuários' as relacionamento,
    '2 entidades em vez de 4' as vantagem,
    'Sem workspace desnecessário' as beneficio; 