-- LIMPAR RLS E TABELAS ANTIGAS
-- Remover todas as políticas RLS primeiro, depois limpar tabelas

-- 1. REMOVER TODAS AS POLÍTICAS RLS

-- Políticas de workspaces
DROP POLICY IF EXISTS "Usuários podem ver apenas seus workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar workspaces" ON public.workspaces;

-- Políticas de empresas_proprias
DROP POLICY IF EXISTS "Usuários podem ver empresas de seus workspaces" ON public.empresas_proprias;
DROP POLICY IF EXISTS "Apenas admins podem gerenciar empresas próprias" ON public.empresas_proprias;

-- Políticas de clientes
DROP POLICY IF EXISTS "Usuários podem acessar clientes de seus workspaces" ON public.clientes;

-- Políticas de contatos
DROP POLICY IF EXISTS "Usuários podem acessar contatos de seus workspaces" ON public.contatos;

-- Políticas de cobranças
DROP POLICY IF EXISTS "Usuários podem acessar cobranças de seus workspaces" ON public.cobrancas;

-- Políticas de despesas
DROP POLICY IF EXISTS "Usuários podem acessar despesas de seus workspaces" ON public.despesas;

-- Políticas de categorias
DROP POLICY IF EXISTS "Usuários podem acessar categorias de seus workspaces" ON public.categorias_servicos;

-- Políticas de serviços
DROP POLICY IF EXISTS "Usuários podem acessar serviços de seus workspaces" ON public.servicos;

-- Políticas de contratos
DROP POLICY IF EXISTS "Usuários podem acessar contratos de seus workspaces" ON public.contratos;
DROP POLICY IF EXISTS "Usuários podem acessar itens de contratos de seus workspaces" ON public.contrato_servicos;

-- Políticas de projetos
DROP POLICY IF EXISTS "Usuários podem acessar projetos de seus workspaces" ON public.projetos;
DROP POLICY IF EXISTS "Usuários podem acessar itens de projetos de seus workspaces" ON public.projeto_servicos;

-- Políticas de pipelines
DROP POLICY IF EXISTS "Users can view workspace pipelines" ON public.pipelines;
DROP POLICY IF EXISTS "Users can view workspace pipeline stages" ON public.pipeline_etapas;

-- Políticas de negócios
DROP POLICY IF EXISTS "Users can view workspace deals" ON public.negocios;

-- Políticas de movimentações bancárias
DROP POLICY IF EXISTS "Users can view workspace bank movements" ON public.movimentacoes_bancarias;

-- Políticas de NFS-e
DROP POLICY IF EXISTS "Users can view workspace nfse" ON public.nfse;

-- Políticas de categorias financeiras
DROP POLICY IF EXISTS "Users can view workspace financial categories" ON public.categorias_financeiras;

-- Políticas de formas de pagamento
DROP POLICY IF EXISTS "Users can view workspace payment methods" ON public.formas_pagamento;

-- Políticas de condições de pagamento
DROP POLICY IF EXISTS "Users can view workspace payment conditions" ON public.condicoes_pagamento;

-- 2. DESABILITAR RLS NAS TABELAS PRINCIPAIS

ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.empresas_proprias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.membros DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cobrancas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.despesas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contrato_servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projeto_servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipelines DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_etapas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.negocios DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacoes_bancarias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfse DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias_financeiras DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.formas_pagamento DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.condicoes_pagamento DISABLE ROW LEVEL SECURITY;

-- 3. AGORA REMOVER TABELAS ANTIGAS

-- Remover tabela de convites (depende de membros)
DROP TABLE IF EXISTS public.convites_usuarios;

-- Remover tabela de membros
DROP TABLE IF EXISTS public.membros;

-- Remover tabela de empresas_proprias
DROP TABLE IF EXISTS public.empresas_proprias;

-- Remover tabela de workspaces
DROP TABLE IF EXISTS public.workspaces;

-- 4. VERIFICAR TABELAS RESTANTES
SELECT 
    '📋 Tabelas Restantes' as status,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'usuarios', 'clientes', 'negocios', 'pipelines')
ORDER BY table_name;

-- 5. RESUMO FINAL
SELECT 
    '🎉 LIMPEZA CONCLUÍDA!' as resultado,
    'RLS removido e tabelas antigas deletadas' as status,
    'Estrutura simplificada ativa' as acao,
    'Frontend pode usar nova API' as proximo_passo; 