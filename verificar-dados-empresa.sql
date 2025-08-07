-- Verificar dados da empresa
-- Execute este script no Supabase SQL Editor

-- 1. Verificar dados da empresa padrão
SELECT 
    id,
    nome,
    cnpj,
    email,
    telefone,
    endereco
FROM empresas 
WHERE id = 'd9c4338e-42b1-421c-a119-60cabfcb88ac';

-- 2. Verificar se há outras empresas
SELECT 
    id,
    nome,
    cnpj,
    email,
    telefone
FROM empresas 
ORDER BY created_at DESC;

-- 3. Verificar usuários e suas empresas
SELECT 
    u.id as usuario_id,
    u.nome as usuario_nome,
    u.email as usuario_email,
    u.empresa_id,
    e.nome as empresa_nome,
    e.cnpj as empresa_cnpj,
    e.email as empresa_email
FROM usuarios u
LEFT JOIN empresas e ON u.empresa_id = e.id
WHERE u.is_active = true
ORDER BY u.created_at DESC;

-- 4. Verificar estrutura da tabela empresas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'empresas'
ORDER BY ordinal_position;
