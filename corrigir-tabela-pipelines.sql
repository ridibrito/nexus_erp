-- Corrigir especificamente a tabela pipelines
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela pipelines existe
SELECT
  'EXISTE TABELA PIPELINES?' as info,
  COUNT(*) as existe
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'pipelines';

-- 2. Se não existir, criar a tabela pipelines
CREATE TABLE IF NOT EXISTS public.pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  cor VARCHAR(7) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Verificar se a coluna workspace_id existe e migrar dados
DO $$
BEGIN
  -- Se existe workspace_id, migrar dados para empresa_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pipelines'
      AND column_name = 'workspace_id'
  ) THEN
    -- Adicionar empresa_id se não existir
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'pipelines'
        AND column_name = 'empresa_id'
    ) THEN
      ALTER TABLE public.pipelines ADD COLUMN empresa_id UUID;
    END IF;
    
    -- Migrar dados de workspace_id para empresa_id
    UPDATE public.pipelines 
    SET empresa_id = workspace_id 
    WHERE empresa_id IS NULL AND workspace_id IS NOT NULL;
    
    -- Remover a coluna workspace_id
    ALTER TABLE public.pipelines DROP COLUMN IF EXISTS workspace_id;
  END IF;
END $$;

-- 4. Verificar se a coluna empresa_id existe
SELECT
  'EXISTE COLUNA EMPRESA_ID?' as info,
  COUNT(*) as existe
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pipelines'
  AND column_name = 'empresa_id';

-- 5. Se a coluna empresa_id não existir, adicionar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pipelines'
      AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE public.pipelines ADD COLUMN empresa_id UUID;
  END IF;
END $$;

-- 6. Criar pipeline de teste se não existir
INSERT INTO public.pipelines (id, empresa_id, nome, descricao, cor, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'd9c4338e-42b1-421c-a119-60cabfcb88ac',
  'Pipeline de Vendas',
  'Pipeline padrão para vendas',
  '#3B82F6',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 7. Verificar estrutura final da tabela
SELECT
  'ESTRUTURA FINAL PIPELINES' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'pipelines'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Verificar dados na tabela
SELECT
  'DADOS EM PIPELINES' as info,
  COUNT(*) as total_pipelines
FROM public.pipelines;

-- 9. Mostrar pipeline criado
SELECT
  'PIPELINE CRIADO' as info,
  p.id,
  p.nome,
  p.descricao,
  p.cor,
  p.empresa_id
FROM public.pipelines p
WHERE p.id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- 10. Corrigir tabela pipeline_etapas também
-- Verificar se a tabela pipeline_etapas existe
SELECT
  'EXISTE TABELA PIPELINE_ETAPAS?' as info,
  COUNT(*) as existe
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'pipeline_etapas';

-- Criar tabela pipeline_etapas se não existir
CREATE TABLE IF NOT EXISTS public.pipeline_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  empresa_id UUID NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 1,
  cor VARCHAR(7) DEFAULT '#6B7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar coluna empresa_id se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pipeline_etapas'
      AND column_name = 'empresa_id'
  ) THEN
    ALTER TABLE public.pipeline_etapas ADD COLUMN empresa_id UUID;
  END IF;
END $$;

-- Migrar dados de workspace_id para empresa_id na tabela pipeline_etapas
DO $$
BEGIN
  -- Se existe workspace_id, migrar dados para empresa_id
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'pipeline_etapas'
      AND column_name = 'workspace_id'
  ) THEN
    -- Migrar dados de workspace_id para empresa_id
    UPDATE public.pipeline_etapas 
    SET empresa_id = workspace_id 
    WHERE empresa_id IS NULL AND workspace_id IS NOT NULL;
    
    -- Remover a coluna workspace_id
    ALTER TABLE public.pipeline_etapas DROP COLUMN IF EXISTS workspace_id;
  END IF;
END $$;

-- Se não há dados de empresa_id, preencher com empresa padrão
UPDATE public.pipeline_etapas 
SET empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac'
WHERE empresa_id IS NULL;

-- Verificar estrutura final da tabela pipeline_etapas
SELECT
  'ESTRUTURA FINAL PIPELINE_ETAPAS' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'pipeline_etapas'
  AND table_schema = 'public'
ORDER BY ordinal_position;
