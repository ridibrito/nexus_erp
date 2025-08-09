-- Migração simples para tornar campos opcionais na tabela negocios
-- Execute este script no SQL Editor do Supabase

-- Alterar cliente_id para permitir NULL
ALTER TABLE public.negocios 
ALTER COLUMN cliente_id DROP NOT NULL;

-- Alterar etapa_id para permitir NULL
ALTER TABLE public.negocios 
ALTER COLUMN etapa_id DROP NOT NULL;

-- Alterar valor para permitir NULL (já que o usuário quer que seja opcional)
ALTER TABLE public.negocios 
ALTER COLUMN valor DROP NOT NULL;

-- Comentários sobre as alterações
COMMENT ON COLUMN public.negocios.cliente_id IS 'ID do cliente (opcional)';
COMMENT ON COLUMN public.negocios.etapa_id IS 'ID da etapa do pipeline (opcional)';
COMMENT ON COLUMN public.negocios.valor IS 'Valor do negócio (opcional)';
