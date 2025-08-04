-- Habilitar extensão uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    inscricao_municipal VARCHAR(50),
    endereco JSONB,
    certificado_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_empresas_updated_at 
    BEFORE UPDATE ON empresas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    nome_razao_social VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18),
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at 
    BEFORE UPDATE ON clientes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de cobranças
CREATE TABLE IF NOT EXISTS cobrancas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    valor DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'paga', 'vencida', 'cancelada')),
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    stripe_invoice_id VARCHAR(255),
    stripe_hosted_invoice_url TEXT,
    nfse_status VARCHAR(50),
    nfse_id VARCHAR(255),
    nfse_url_pdf TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_cobrancas_updated_at 
    BEFORE UPDATE ON cobrancas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de contas a pagar
CREATE TABLE IF NOT EXISTS contas_a_pagar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100),
    data_vencimento DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'a_pagar' CHECK (status IN ('a_pagar', 'paga')),
    data_pagamento DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_contas_a_pagar_updated_at 
    BEFORE UPDATE ON contas_a_pagar 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tabela de integrações
CREATE TABLE IF NOT EXISTS integracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    configuracao JSONB NOT NULL,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_integracoes_updated_at 
    BEFORE UPDATE ON integracoes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_empresas_user_id ON empresas(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_id ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_empresa_id ON cobrancas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_cliente_id ON cobrancas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cobrancas_status ON cobrancas(status);
CREATE INDEX IF NOT EXISTS idx_cobrancas_data_vencimento ON cobrancas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_a_pagar_empresa_id ON contas_a_pagar(empresa_id);
CREATE INDEX IF NOT EXISTS idx_contas_a_pagar_status ON contas_a_pagar(status);
CREATE INDEX IF NOT EXISTS idx_integracoes_empresa_id ON integracoes(empresa_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_a_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE integracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para empresas
CREATE POLICY "Users can view own empresa" ON empresas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own empresa" ON empresas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own empresa" ON empresas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own empresa" ON empresas
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para clientes
CREATE POLICY "Users can view own clientes" ON clientes
    FOR SELECT USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own clientes" ON clientes
    FOR INSERT WITH CHECK (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own clientes" ON clientes
    FOR UPDATE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own clientes" ON clientes
    FOR DELETE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

-- Políticas RLS para cobranças
CREATE POLICY "Users can view own cobrancas" ON cobrancas
    FOR SELECT USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own cobrancas" ON cobrancas
    FOR INSERT WITH CHECK (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own cobrancas" ON cobrancas
    FOR UPDATE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own cobrancas" ON cobrancas
    FOR DELETE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

-- Políticas RLS para contas a pagar
CREATE POLICY "Users can view own contas_a_pagar" ON contas_a_pagar
    FOR SELECT USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own contas_a_pagar" ON contas_a_pagar
    FOR INSERT WITH CHECK (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own contas_a_pagar" ON contas_a_pagar
    FOR UPDATE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own contas_a_pagar" ON contas_a_pagar
    FOR DELETE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

-- Políticas RLS para integrações
CREATE POLICY "Users can view own integracoes" ON integracoes
    FOR SELECT USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own integracoes" ON integracoes
    FOR INSERT WITH CHECK (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own integracoes" ON integracoes
    FOR UPDATE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own integracoes" ON integracoes
    FOR DELETE USING (
        empresa_id IN (
            SELECT id FROM empresas WHERE user_id = auth.uid()
        )
    );

-- Funções para cálculos financeiros
CREATE OR REPLACE FUNCTION calcular_faturamento_mensal(empresa_uuid UUID, mes INTEGER, ano INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(valor) 
         FROM cobrancas 
         WHERE empresa_id = empresa_uuid 
         AND status = 'paga' 
         AND EXTRACT(MONTH FROM data_pagamento) = mes 
         AND EXTRACT(YEAR FROM data_pagamento) = ano), 0
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calcular_contas_receber(empresa_uuid UUID)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(valor) 
         FROM cobrancas 
         WHERE empresa_id = empresa_uuid 
         AND status = 'pendente'), 0
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calcular_despesas_mensais(empresa_uuid UUID, mes INTEGER, ano INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(valor) 
         FROM contas_a_pagar 
         WHERE empresa_id = empresa_uuid 
         AND status = 'paga' 
         AND EXTRACT(MONTH FROM data_pagamento) = mes 
         AND EXTRACT(YEAR FROM data_pagamento) = ano), 0
    );
END;
$$ LANGUAGE plpgsql;
