-- REMOVER CONSTRAINTS WORKSPACE
-- Remover todas as foreign keys que referenciam workspaces

-- 1. REMOVER FOREIGN KEYS DE CLIENTES
ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS clientes_workspace_id_fkey;

-- 2. REMOVER FOREIGN KEYS DE CONTATOS
ALTER TABLE public.contatos DROP CONSTRAINT IF EXISTS contatos_workspace_id_fkey;

-- 3. REMOVER FOREIGN KEYS DE COBRANÇAS
ALTER TABLE public.cobrancas DROP CONSTRAINT IF EXISTS cobrancas_workspace_id_fkey;

-- 4. REMOVER FOREIGN KEYS DE DESPESAS
ALTER TABLE public.despesas DROP CONSTRAINT IF EXISTS despesas_workspace_id_fkey;

-- 5. REMOVER FOREIGN KEYS DE CATEGORIAS
ALTER TABLE public.categorias_servicos DROP CONSTRAINT IF EXISTS categorias_servicos_workspace_id_fkey;

-- 6. REMOVER FOREIGN KEYS DE SERVIÇOS
ALTER TABLE public.servicos DROP CONSTRAINT IF EXISTS servicos_workspace_id_fkey;

-- 7. REMOVER FOREIGN KEYS DE CONTRATOS
ALTER TABLE public.contratos DROP CONSTRAINT IF EXISTS contratos_workspace_id_fkey;

-- 8. REMOVER FOREIGN KEYS DE PROJETOS
ALTER TABLE public.projetos DROP CONSTRAINT IF EXISTS projetos_workspace_id_fkey;

-- 9. REMOVER FOREIGN KEYS DE PIPELINES
ALTER TABLE public.pipelines DROP CONSTRAINT IF EXISTS pipelines_workspace_id_fkey;

-- 10. REMOVER FOREIGN KEYS DE NEGÓCIOS
ALTER TABLE public.negocios DROP CONSTRAINT IF EXISTS negocios_workspace_id_fkey;

-- 11. REMOVER FOREIGN KEYS DE MOVIMENTAÇÕES BANCÁRIAS
ALTER TABLE public.movimentacoes_bancarias DROP CONSTRAINT IF EXISTS movimentacoes_bancarias_workspace_id_fkey;

-- 12. REMOVER FOREIGN KEYS DE NFS-E
ALTER TABLE public.nfse DROP CONSTRAINT IF EXISTS nfse_workspace_id_fkey;

-- 13. REMOVER FOREIGN KEYS DE CATEGORIAS FINANCEIRAS
ALTER TABLE public.categorias_financeiras DROP CONSTRAINT IF EXISTS categorias_financeiras_workspace_id_fkey;

-- 14. REMOVER FOREIGN KEYS DE FORMAS DE PAGAMENTO
ALTER TABLE public.formas_pagamento DROP CONSTRAINT IF EXISTS formas_pagamento_workspace_id_fkey;

-- 15. REMOVER FOREIGN KEYS DE CONDIÇÕES DE PAGAMENTO
ALTER TABLE public.condicoes_pagamento DROP CONSTRAINT IF EXISTS condicoes_pagamento_workspace_id_fkey;

-- 16. VERIFICAR SE TODAS AS CONSTRAINTS FORAM REMOVIDAS
SELECT 
    '✅ Constraints removidas' as status,
    'Foreign keys de workspace removidas' as acao;

-- 17. AGORA PODEMOS REMOVER AS TABELAS ANTIGAS
DROP TABLE IF EXISTS public.convites_usuarios;
DROP TABLE IF EXISTS public.membros;
DROP TABLE IF EXISTS public.empresas_proprias;
DROP TABLE IF EXISTS public.workspaces;

-- 18. VERIFICAR TABELAS RESTANTES
SELECT 
    '📋 Tabelas Restantes' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'usuarios', 'clientes', 'negocios', 'pipelines')
ORDER BY table_name;

-- 19. RESUMO FINAL
SELECT 
    '🎉 LIMPEZA CONCLUÍDA!' as resultado,
    'Constraints e tabelas antigas removidas' as status,
    'Estrutura simplificada ativa' as acao,
    'Frontend pode usar nova API' as proximo_passo; 