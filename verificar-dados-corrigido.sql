-- =====================================================
-- VERIFICAR DADOS EXISTENTES E INSERIR DADOS DE TESTE (CORRIGIDO)
-- =====================================================

-- 1. Verificar dados existentes
SELECT '=== DADOS EXISTENTES ===' as info;

-- Workspaces
SELECT 'Workspaces:' as tabela, COUNT(*) as total FROM public.workspaces;

-- Membros
SELECT 'Membros:' as tabela, COUNT(*) as total FROM public.membros;

-- Pipelines
SELECT 'Pipelines:' as tabela, COUNT(*) as total FROM public.pipelines;

-- Pipeline Etapas
SELECT 'Pipeline Etapas:' as tabela, COUNT(*) as total FROM public.pipeline_etapas;

-- Clientes
SELECT 'Clientes:' as tabela, COUNT(*) as total FROM public.clientes;

-- Negócios
SELECT 'Negócios:' as tabela, COUNT(*) as total FROM public.negocios;

-- 2. Inserir dados de teste se não existirem
DO $$
DECLARE
    workspace_id UUID;
    pipeline_id UUID;
    cliente_id UUID;
    etapa_id UUID;
    etapas_count INTEGER;
BEGIN
    -- Obter workspace_id
    SELECT id INTO workspace_id FROM public.workspaces LIMIT 1;
    
    IF workspace_id IS NULL THEN
        INSERT INTO public.workspaces (nome) VALUES ('Nexus ERP') RETURNING id INTO workspace_id;
        RAISE NOTICE 'Workspace criado: %', workspace_id;
    ELSE
        RAISE NOTICE 'Workspace existente: %', workspace_id;
    END IF;

    -- Inserir membro se não existir
    IF NOT EXISTS (SELECT 1 FROM public.membros WHERE email = 'ricardo@coruss.com.br') THEN
        INSERT INTO public.membros (workspace_id, user_id, nome, email, cargo, is_active)
        SELECT 
            workspace_id,
            u.id,
            'Ricardo Admin',
            'ricardo@coruss.com.br',
            'Administrador',
            true
        FROM auth.users u
        WHERE u.email = 'ricardo@coruss.com.br'
        LIMIT 1;
        RAISE NOTICE 'Membro inserido';
    ELSE
        RAISE NOTICE 'Membro já existe';
    END IF;

    -- Inserir pipeline se não existir
    IF NOT EXISTS (SELECT 1 FROM public.pipelines WHERE nome = 'Vendas') THEN
        INSERT INTO public.pipelines (workspace_id, nome, descricao, cor)
        VALUES (workspace_id, 'Vendas', 'Pipeline de vendas padrão', '#3B82F6')
        RETURNING id INTO pipeline_id;
        RAISE NOTICE 'Pipeline criado: %', pipeline_id;
    ELSE
        SELECT id INTO pipeline_id FROM public.pipelines WHERE nome = 'Vendas';
        RAISE NOTICE 'Pipeline existente: %', pipeline_id;
    END IF;

    -- Verificar se já existem etapas para este pipeline
    SELECT COUNT(*) INTO etapas_count FROM public.pipeline_etapas WHERE pipeline_id = pipeline_id;
    
    -- Inserir etapas se não existirem
    IF etapas_count = 0 THEN
        INSERT INTO public.pipeline_etapas (pipeline_id, nome, descricao, cor, ordem) VALUES
        (pipeline_id, 'Prospecção', 'Primeiro contato com o cliente', '#6B7280', 1),
        (pipeline_id, 'Qualificação', 'Avaliação da oportunidade', '#F59E0B', 2),
        (pipeline_id, 'Proposta', 'Envio da proposta comercial', '#10B981', 3),
        (pipeline_id, 'Negociação', 'Negociação dos termos', '#8B5CF6', 4),
        (pipeline_id, 'Fechado', 'Negócio fechado com sucesso', '#059669', 5);
        RAISE NOTICE 'Etapas criadas';
    ELSE
        RAISE NOTICE 'Etapas já existem (% etapas encontradas)', etapas_count;
    END IF;

    -- Inserir cliente de teste se não existir
    IF NOT EXISTS (SELECT 1 FROM public.clientes WHERE nome_fant = 'Cliente Teste') THEN
        INSERT INTO public.clientes (workspace_id, nome_fant, email, status)
        VALUES (workspace_id, 'Cliente Teste', 'teste@exemplo.com', 'ativo')
        RETURNING id INTO cliente_id;
        RAISE NOTICE 'Cliente criado: %', cliente_id;
    ELSE
        SELECT id INTO cliente_id FROM public.clientes WHERE nome_fant = 'Cliente Teste';
        RAISE NOTICE 'Cliente existente: %', cliente_id;
    END IF;

    -- Inserir negócio de teste se não existir
    IF NOT EXISTS (SELECT 1 FROM public.negocios WHERE titulo = 'Negócio Teste') THEN
        SELECT id INTO etapa_id FROM public.pipeline_etapas WHERE pipeline_id = pipeline_id AND ordem = 1;
        
        INSERT INTO public.negocios (workspace_id, cliente_id, pipeline_id, etapa_id, titulo, descricao, valor, probabilidade)
        VALUES (workspace_id, cliente_id, pipeline_id, etapa_id, 'Negócio Teste', 'Negócio para teste do sistema', 5000.00, 75);
        RAISE NOTICE 'Negócio de teste criado';
    ELSE
        RAISE NOTICE 'Negócio de teste já existe';
    END IF;

END $$;

-- 3. Verificar dados finais
SELECT '=== DADOS FINAIS ===' as info;

-- Workspaces
SELECT 'Workspaces:' as tabela, COUNT(*) as total FROM public.workspaces;

-- Membros
SELECT 'Membros:' as tabela, COUNT(*) as total FROM public.membros;

-- Pipelines
SELECT 'Pipelines:' as tabela, COUNT(*) as total FROM public.pipelines;

-- Pipeline Etapas
SELECT 'Pipeline Etapas:' as tabela, COUNT(*) as total FROM public.pipeline_etapas;

-- Clientes
SELECT 'Clientes:' as tabela, COUNT(*) as total FROM public.clientes;

-- Negócios
SELECT 'Negócios:' as tabela, COUNT(*) as total FROM public.negocios;

-- 4. Mostrar dados específicos
SELECT '=== DETALHES ===' as info;

-- Workspace
SELECT id, nome FROM public.workspaces;

-- Membro
SELECT id, nome, email, cargo FROM public.membros;

-- Pipeline e etapas
SELECT 
    p.id as pipeline_id,
    p.nome as pipeline_nome,
    pe.id as etapa_id,
    pe.nome as etapa_nome,
    pe.ordem
FROM public.pipelines p
LEFT JOIN public.pipeline_etapas pe ON p.id = pe.pipeline_id
ORDER BY p.nome, pe.ordem;

-- Cliente
SELECT id, nome_fant, email, status FROM public.clientes;

-- Negócio
SELECT 
    n.id,
    n.titulo,
    n.valor,
    c.nome_fant as cliente,
    p.nome as pipeline,
    pe.nome as etapa
FROM public.negocios n
LEFT JOIN public.clientes c ON n.cliente_id = c.id
LEFT JOIN public.pipelines p ON n.pipeline_id = p.id
LEFT JOIN public.pipeline_etapas pe ON n.etapa_id = pe.id; 