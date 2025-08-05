-- Script para verificar o estado atual das tabelas e funções
-- Execute este código no SQL Editor do Supabase

-- Verificar tabelas existentes
SELECT 
    table_name,
    'Tabela existe' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'workspaces',
    'membros', 
    'empresas_proprias',
    'clientes',
    'contatos',
    'cobrancas',
    'despesas',
    'convites_usuarios'
)
ORDER BY table_name;

-- Verificar funções existentes
SELECT 
    routine_name,
    'Função existe' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
    'get_user_empresa',
    'get_workspace_usuarios',
    'update_empresa_data',
    'criar_convite_usuario',
    'aceitar_convite',
    'remover_usuario_workspace',
    'atualizar_permissoes_usuario'
)
ORDER BY routine_name;

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    'Política existe' as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN (
    'workspaces',
    'membros',
    'empresas_proprias', 
    'clientes',
    'contatos',
    'cobrancas',
    'despesas',
    'convites_usuarios'
)
ORDER BY tablename, policyname;

-- Verificar triggers
SELECT 
    trigger_name,
    event_object_table,
    'Trigger existe' as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN (
    'workspaces',
    'membros',
    'empresas_proprias',
    'clientes', 
    'contatos',
    'cobrancas',
    'despesas',
    'convites_usuarios'
)
ORDER BY event_object_table, trigger_name; 