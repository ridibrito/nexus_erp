-- =====================================================
-- CORREÇÃO DAS POLÍTICAS RLS PARA NEGÓCIOS
-- =====================================================

-- 1. Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Users can view workspace clients" ON public.clientes;
DROP POLICY IF EXISTS "Users can view workspace members" ON public.membros;
DROP POLICY IF EXISTS "Users can view their workspaces" ON public.workspaces;

-- 2. Remover políticas específicas de negócios
DROP POLICY IF EXISTS "Usuários podem ver negocios" ON public.negocios;
DROP POLICY IF EXISTS "Usuários podem gerenciar negocios" ON public.negocios;

-- 3. Criar políticas RLS corretas para negócios
-- Política para SELECT (leitura)
CREATE POLICY "negocios_select_policy" ON public.negocios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = negocios.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- Política para INSERT (criação)
CREATE POLICY "negocios_insert_policy" ON public.negocios
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = negocios.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- Política para UPDATE (atualização)
CREATE POLICY "negocios_update_policy" ON public.negocios
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = negocios.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- Política para DELETE (exclusão)
CREATE POLICY "negocios_delete_policy" ON public.negocios
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = negocios.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 4. Criar políticas RLS corretas para pipelines
DROP POLICY IF EXISTS "Usuários podem ver pipelines" ON public.pipelines;
DROP POLICY IF EXISTS "Usuários podem gerenciar pipelines" ON public.pipelines;

CREATE POLICY "pipelines_select_policy" ON public.pipelines
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = pipelines.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipelines_insert_policy" ON public.pipelines
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = pipelines.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipelines_update_policy" ON public.pipelines
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = pipelines.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipelines_delete_policy" ON public.pipelines
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = pipelines.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 5. Criar políticas RLS corretas para pipeline_etapas
DROP POLICY IF EXISTS "Usuários podem ver pipeline_etapas" ON public.pipeline_etapas;
DROP POLICY IF EXISTS "Usuários podem gerenciar pipeline_etapas" ON public.pipeline_etapas;

CREATE POLICY "pipeline_etapas_select_policy" ON public.pipeline_etapas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pipelines p
            JOIN public.membros m ON m.workspace_id = p.workspace_id
            WHERE p.id = pipeline_etapas.pipeline_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipeline_etapas_insert_policy" ON public.pipeline_etapas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pipelines p
            JOIN public.membros m ON m.workspace_id = p.workspace_id
            WHERE p.id = pipeline_etapas.pipeline_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipeline_etapas_update_policy" ON public.pipeline_etapas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pipelines p
            JOIN public.membros m ON m.workspace_id = p.workspace_id
            WHERE p.id = pipeline_etapas.pipeline_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "pipeline_etapas_delete_policy" ON public.pipeline_etapas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pipelines p
            JOIN public.membros m ON m.workspace_id = p.workspace_id
            WHERE p.id = pipeline_etapas.pipeline_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 6. Criar políticas RLS corretas para clientes
CREATE POLICY "clientes_select_policy" ON public.clientes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = clientes.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "clientes_insert_policy" ON public.clientes
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = clientes.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "clientes_update_policy" ON public.clientes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = clientes.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "clientes_delete_policy" ON public.clientes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = clientes.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 7. Criar políticas RLS corretas para membros
CREATE POLICY "membros_select_policy" ON public.membros
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = membros.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "membros_insert_policy" ON public.membros
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = membros.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "membros_update_policy" ON public.membros
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = membros.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "membros_delete_policy" ON public.membros
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = membros.workspace_id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 8. Criar políticas RLS corretas para workspaces
CREATE POLICY "workspaces_select_policy" ON public.workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = workspaces.id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "workspaces_insert_policy" ON public.workspaces
    FOR INSERT WITH CHECK (true);

CREATE POLICY "workspaces_update_policy" ON public.workspaces
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = workspaces.id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

CREATE POLICY "workspaces_delete_policy" ON public.workspaces
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.membros m
            WHERE m.workspace_id = workspaces.id 
            AND m.user_id = auth.uid()
            AND m.is_active = true
        )
    );

-- 9. Verificar se as políticas foram criadas corretamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('negocios', 'pipelines', 'pipeline_etapas', 'clientes', 'membros', 'workspaces')
ORDER BY tablename, policyname;

-- 10. Mensagem de confirmação
SELECT 'Políticas RLS corrigidas com sucesso!' as status; 