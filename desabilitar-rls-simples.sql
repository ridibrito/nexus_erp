-- Script simples para desabilitar RLS em todas as tabelas
-- Execute este script no Supabase SQL Editor

-- Desabilitar RLS em todas as tabelas principais
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos DISABLE ROW LEVEL SECURITY;

-- Verificar se RLS foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'workspaces',
  'membros', 
  'clientes',
  'pipelines',
  'pipeline_etapas',
  'negocios',
  'empresas_proprias',
  'contatos'
);

-- Mensagem de sucesso
SELECT 'RLS desabilitado em todas as tabelas!' as status; 