-- =====================================================
-- SETUP PARA DESENVOLVIMENTO - RLS PERMISSIVO
-- =====================================================

-- 1. Habilitar RLS em todas as tabelas (se não estiver habilitado)
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios ENABLE ROW LEVEL SECURITY;

-- 2. Remover políticas existentes (se houver)
DROP POLICY IF EXISTS "negocios_select_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_insert_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_update_policy" ON public.negocios;
DROP POLICY IF EXISTS "negocios_delete_policy" ON public.negocios;

DROP POLICY IF EXISTS "pipelines_select_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_insert_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_update_policy" ON public.pipelines;
DROP POLICY IF EXISTS "pipelines_delete_policy" ON public.pipelines;

DROP POLICY IF EXISTS "pipeline_etapas_select_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_insert_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_update_policy" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "pipeline_etapas_delete_policy" ON public.pipeline_etapas;

DROP POLICY IF EXISTS "clientes_select_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_insert_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_update_policy" ON public.clientes;
DROP POLICY IF EXISTS "clientes_delete_policy" ON public.clientes;

DROP POLICY IF EXISTS "membros_select_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_insert_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_update_policy" ON public.membros;
DROP POLICY IF EXISTS "membros_delete_policy" ON public.membros;

DROP POLICY IF EXISTS "workspaces_select_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_insert_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_update_policy" ON public.workspaces;
DROP POLICY IF EXISTS "workspaces_delete_policy" ON public.workspaces;

DROP POLICY IF EXISTS "empresas_proprias_select_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_insert_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_update_policy" ON public.empresas_proprias;
DROP POLICY IF EXISTS "empresas_proprias_delete_policy" ON public.empresas_proprias;

-- 3. Criar políticas permissivas para desenvolvimento
-- Negócios
CREATE POLICY "dev_negocios_all" ON public.negocios FOR ALL USING (true);

-- Pipelines
CREATE POLICY "dev_pipelines_all" ON public.pipelines FOR ALL USING (true);

-- Pipeline Etapas
CREATE POLICY "dev_pipeline_etapas_all" ON public.pipeline_etapas FOR ALL USING (true);

-- Clientes
CREATE POLICY "dev_clientes_all" ON public.clientes FOR ALL USING (true);

-- Membros
CREATE POLICY "dev_membros_all" ON public.membros FOR ALL USING (true);

-- Workspaces
CREATE POLICY "dev_workspaces_all" ON public.workspaces FOR ALL USING (true);

-- Empresas Próprias
CREATE POLICY "dev_empresas_proprias_all" ON public.empresas_proprias FOR ALL USING (true);

-- 4. Verificar se as políticas foram criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('negocios', 'pipelines', 'pipeline_etapas', 'clientes', 'membros', 'workspaces', 'empresas_proprias')
ORDER BY tablename, policyname;

-- 5. Mensagem de confirmação
SELECT 'Setup de desenvolvimento configurado com sucesso!' as status;
SELECT '⚠️  ATENÇÃO: Esta configuração é apenas para desenvolvimento!' as warning;
SELECT '🔒 Configure políticas de segurança adequadas para produção!' as reminder; 