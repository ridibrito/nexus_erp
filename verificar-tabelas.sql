-- =====================================================
-- VERIFICAR TABELAS EXISTENTES
-- =====================================================

-- Listar todas as tabelas do schema public
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('workspaces', 'membros', 'clientes', 'negocios', 'pipelines', 'pipeline_etapas') 
        THEN '✅ EXISTE' 
        ELSE '❌ FALTANDO' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verificar se as tabelas principais existem
DO $$
DECLARE
    tabela text;
    tabelas_principais text[] := ARRAY['workspaces', 'membros', 'clientes', 'negocios', 'pipelines', 'pipeline_etapas'];
BEGIN
    RAISE NOTICE 'Verificando tabelas principais...';
    
    FOREACH tabela IN ARRAY tabelas_principais
    LOOP
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tabela) THEN
            RAISE NOTICE '✅ % existe', tabela;
        ELSE
            RAISE NOTICE '❌ % NÃO existe', tabela;
        END IF;
    END LOOP;
END $$;

-- Verificar estrutura da tabela workspaces (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workspaces') THEN
        RAISE NOTICE 'Estrutura da tabela workspaces:';
        FOR col IN 
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'workspaces'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - % (%%)', col.column_name, col.data_type;
        END LOOP;
    ELSE
        RAISE NOTICE 'Tabela workspaces não existe!';
    END IF;
END $$;

-- Verificar estrutura da tabela membros (se existir)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'membros') THEN
        RAISE NOTICE 'Estrutura da tabela membros:';
        FOR col IN 
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'membros'
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - % (%%)', col.column_name, col.data_type;
        END LOOP;
    ELSE
        RAISE NOTICE 'Tabela membros não existe!';
    END IF;
END $$; 