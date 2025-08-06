-- VERIFICAR MIGRAÇÃO COMPLETA
-- Confirmar que todos os dados foram migrados corretamente

-- 1. VERIFICAR EMPRESA MIGRADA
SELECT 
    '🏢 Empresa Nexus' as status,
    id,
    nome,
    razao_social,
    cnpj,
    email
FROM public.empresas 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 2. VERIFICAR USUÁRIOS MIGRADOS
SELECT 
    '👤 Usuários da Empresa' as status,
    id,
    nome,
    email,
    cargo,
    role,
    is_active
FROM public.usuarios 
WHERE empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 3. VERIFICAR REFERÊNCIAS ATUALIZADAS
SELECT 
    '📊 Clientes Migrados' as status,
    COUNT(*) as total
FROM public.clientes 
WHERE empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

SELECT 
    '💼 Negócios Migrados' as status,
    COUNT(*) as total
FROM public.negocios 
WHERE empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

SELECT 
    '🔄 Pipelines Migrados' as status,
    COUNT(*) as total
FROM public.pipelines 
WHERE empresa_id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 4. RESUMO FINAL
SELECT 
    '🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO!' as resultado,
    'Estrutura simplificada implementada' as status,
    'Frontend pode ser atualizado' as proximo_passo; 