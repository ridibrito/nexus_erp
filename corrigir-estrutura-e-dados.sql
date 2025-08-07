-- Corrigir estrutura e criar dados de teste
-- Execute este script no SQL Editor do Supabase

-- 1. Criar empresa padrão se não existir
INSERT INTO public.empresas (id, razao_social, nome_fantasia, cnpj, inscricao_estadual, email, telefone, endereco, is_active, created_at, updated_at)
VALUES (
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Nexus ERP LTDA',
  'Nexus ERP',
  '12.345.678/0001-90',
  '123456789',
  'contato@nexus.com',
  '(11) 99999-9999',
  '{"logradouro": "Rua das Empresas", "numero": "100", "complemento": "Sala 10", "bairro": "Centro", "cidade": "São Paulo", "estado": "SP", "cep": "01234-567"}',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar tabela clientes se não existir
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  nome_fant VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  razao_social VARCHAR(255),
  cnpj VARCHAR(18),
  inscricao_estadual VARCHAR(20),
  email VARCHAR(255),
  telefone VARCHAR(20),
  endereco JSONB,
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela pipelines se não existir
CREATE TABLE IF NOT EXISTS public.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar tabela pipeline_etapas se não existir
CREATE TABLE IF NOT EXISTS public.pipeline_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  cor VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Criar tabela negocios se não existir
CREATE TABLE IF NOT EXISTS public.negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id),
  etapa_id UUID NOT NULL REFERENCES public.pipeline_etapas(id),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor DECIMAL(10,2),
  probabilidade INTEGER DEFAULT 0,
  data_prevista_fechamento DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Função para adicionar usuário atual como admin
CREATE OR REPLACE FUNCTION adicionar_usuario_admin_empresa()
RETURNS void AS $$
BEGIN
  INSERT INTO public.usuarios (empresa_id, auth_user_id, nome, email, cargo, is_active, created_at, updated_at)
  VALUES (
    'd9c4338e-42b1-421c-a119-60cabfcb88ac',
    auth.uid(),
    'Administrador',
    auth.jwt() ->> 'email',
    'Administrador',
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    cargo = 'Administrador',
    is_active = true,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Executar a função para o usuário atual
SELECT adicionar_usuario_admin_empresa();

-- 8. Criar pipeline padrão se não existir
INSERT INTO public.pipelines (id, workspace_id, nome, descricao, cor, created_at, updated_at)
VALUES (
  'pipeline-vendas-padrao',
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Pipeline de Vendas',
  'Pipeline padrão para gerenciamento de vendas',
  '#3B82F6',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 9. Criar etapas do pipeline se não existirem
INSERT INTO public.pipeline_etapas (id, pipeline_id, nome, descricao, ordem, cor, created_at, updated_at)
VALUES 
  ('etapa-lead', 'pipeline-vendas-padrao', 'Lead', 'Contatos iniciais', 1, '#6B7280', NOW(), NOW()),
  ('etapa-proposta', 'pipeline-vendas-padrao', 'Proposta', 'Propostas enviadas', 2, '#F59E0B', NOW(), NOW()),
  ('etapa-negociacao', 'pipeline-vendas-padrao', 'Negociação', 'Em negociação', 3, '#8B5CF6', NOW(), NOW()),
  ('etapa-fechado', 'pipeline-vendas-padrao', 'Fechado', 'Negócios fechados', 4, '#10B981', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 10. Criar cliente de teste se não existir
INSERT INTO public.clientes (id, workspace_id, nome_fant, razao_social, cnpj, email, telefone, status, created_at, updated_at)
VALUES (
  'cliente-teste-1',
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Cliente Teste',
  'Cliente Teste LTDA',
  '11.111.111/0001-11',
  'contato@clienteteste.com',
  '(11) 11111-1111',
  'ativo',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 11. Verificar resultado
SELECT 
  'RESULTADO' as info,
  e.id as empresa_id,
  e.razao_social as empresa_razao_social,
  u.id as usuario_id,
  u.cargo,
  u.is_active,
  u.nome as usuario_nome,
  u.email as usuario_email
FROM public.empresas e
LEFT JOIN public.usuarios u ON u.empresa_id = e.id
WHERE e.id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 12. Verificar pipeline criado
SELECT 
  'PIPELINE CRIADO' as info,
  p.id,
  p.nome,
  p.cor,
  COUNT(pe.id) as total_etapas
FROM public.pipelines p
LEFT JOIN public.pipeline_etapas pe ON pe.pipeline_id = p.id
WHERE p.id = 'pipeline-vendas-padrao'
GROUP BY p.id, p.nome, p.cor;

-- 13. Verificar cliente criado
SELECT 
  'CLIENTE CRIADO' as info,
  c.id,
  c.nome_fant,
  c.razao_social,
  c.email,
  c.status
FROM public.clientes c
WHERE c.id = 'cliente-teste-1';
