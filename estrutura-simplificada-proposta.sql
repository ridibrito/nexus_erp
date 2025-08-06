-- PROPOSTA: Estrutura Simplificada
-- Remover entidades desnecessárias e unificar conceitos

-- 1. ESTRUTURA ATUAL (COMPLEXA):
-- workspaces → empresas_proprias → membros + auth.users
-- (4 entidades para a mesma coisa)

-- 2. ESTRUTURA PROPOSTA (SIMPLES):
-- empresas → usuarios
-- (2 entidades, conceito claro)

-- 3. NOVA ESTRUTURA:

-- EMPRESA (única entidade de negócio)
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

-- USUARIO (pessoa que trabalha na empresa)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
    auth_user_id UUID, -- Referência opcional ao Supabase Auth
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    telefone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. VANTAGENS DA SIMPLIFICAÇÃO:
-- ✅ Conceito claro: Empresa tem Usuários
-- ✅ Sem duplicação: Uma pessoa = Um usuário
-- ✅ Menos entidades: 2 em vez de 4
-- ✅ Mais simples: Fácil de entender e manter
-- ✅ Performance: Menos joins, consultas mais rápidas

-- 5. MIGRAÇÃO DOS DADOS:
-- workspaces → empresas
-- membros → usuarios
-- empresas_proprias → dados da empresa principal

SELECT 
    '✅ Estrutura Simplificada' as status,
    'Empresa → Usuários' as conceito,
    '2 entidades em vez de 4' as vantagem; 