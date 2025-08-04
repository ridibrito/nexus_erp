-- Schema mínimo para teste
-- Execute este SQL no Supabase SQL Editor

-- Habilitar extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de empresas (mínima)
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice básico
CREATE INDEX IF NOT EXISTS idx_empresas_user_id ON empresas(user_id);

-- Habilitar RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Política básica para empresas
CREATE POLICY "Users can view own empresa" ON empresas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own empresa" ON empresas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own empresa" ON empresas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own empresa" ON empresas
    FOR DELETE USING (auth.uid() = user_id);

-- Verificar se foi criado
SELECT 'Schema criado com sucesso!' as status; 