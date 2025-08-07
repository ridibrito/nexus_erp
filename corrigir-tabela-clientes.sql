-- Corrigir especificamente a tabela clientes
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela clientes existe
SELECT 
  'EXISTE TABELA CLIENTES?' as info,
  COUNT(*) as existe
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'clientes';

-- 2. Se não existir, criar a tabela clientes
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

-- 3. Verificar se a coluna nome_fant existe
SELECT 
  'EXISTE COLUNA NOME_FANT?' as info,
  COUNT(*) as existe
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'clientes'
  AND column_name = 'nome_fant';

-- 4. Se a coluna nome_fant não existir, adicionar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'clientes' 
      AND column_name = 'nome_fant'
  ) THEN
    ALTER TABLE public.clientes ADD COLUMN nome_fant VARCHAR(255);
  END IF;
END $$;

-- 5. Criar cliente de teste se não existir
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

-- 6. Verificar estrutura final da tabela
SELECT 
  'ESTRUTURA FINAL CLIENTES' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'clientes' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 7. Verificar dados na tabela
SELECT 
  'DADOS EM CLIENTES' as info,
  COUNT(*) as total_clientes
FROM public.clientes;

-- 8. Mostrar cliente criado
SELECT 
  'CLIENTE CRIADO' as info,
  c.id,
  c.nome_fant,
  c.razao_social,
  c.email,
  c.status
FROM public.clientes c
WHERE c.id = 'cliente-teste-1';
