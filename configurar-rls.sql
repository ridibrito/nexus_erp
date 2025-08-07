-- Configurar Row Level Security (RLS) para isolamento por empresa
-- Execute este script no Supabase SQL Editor

-- 1. Habilitar RLS em todas as tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobrancas ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias_financeiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE formas_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimentacoes_bancarias ENABLE ROW LEVEL SECURITY;

-- 2. Criar função para obter empresa_id do usuário atual
CREATE OR REPLACE FUNCTION get_empresa_id()
RETURNS UUID AS $$
BEGIN
  RETURN (auth.jwt() ->> 'empresa_id')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Políticas para clientes
CREATE POLICY "Usuários só podem ver clientes da sua empresa" ON clientes
FOR ALL USING (empresa_id = get_empresa_id());

-- 4. Políticas para pipelines
CREATE POLICY "Usuários só podem ver pipelines da sua empresa" ON pipelines
FOR ALL USING (empresa_id = get_empresa_id());

-- 5. Políticas para pipeline_etapas
CREATE POLICY "Usuários só podem ver etapas de pipelines da sua empresa" ON pipeline_etapas
FOR ALL USING (empresa_id = get_empresa_id());

-- 6. Políticas para negócios
CREATE POLICY "Usuários só podem ver negócios da sua empresa" ON negocios
FOR ALL USING (empresa_id = get_empresa_id());

-- 7. Políticas para contatos
CREATE POLICY "Usuários só podem ver contatos da sua empresa" ON contatos
FOR ALL USING (empresa_id = get_empresa_id());

-- 8. Políticas para cobranças
CREATE POLICY "Usuários só podem ver cobranças da sua empresa" ON cobrancas
FOR ALL USING (empresa_id = get_empresa_id());

-- 9. Políticas para despesas
CREATE POLICY "Usuários só podem ver despesas da sua empresa" ON despesas
FOR ALL USING (empresa_id = get_empresa_id());

-- 10. Políticas para categorias financeiras
CREATE POLICY "Usuários só podem ver categorias da sua empresa" ON categorias_financeiras
FOR ALL USING (empresa_id = get_empresa_id());

-- 11. Políticas para formas de pagamento
CREATE POLICY "Usuários só podem ver formas de pagamento da sua empresa" ON formas_pagamento
FOR ALL USING (empresa_id = get_empresa_id());

-- 12. Políticas para movimentações bancárias
CREATE POLICY "Usuários só podem ver movimentações da sua empresa" ON movimentacoes_bancarias
FOR ALL USING (empresa_id = get_empresa_id());

-- 13. Trigger para inserir empresa_id automaticamente
CREATE OR REPLACE FUNCTION set_empresa_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.empresa_id = get_empresa_id();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 14. Aplicar trigger em todas as tabelas
CREATE TRIGGER set_empresa_id_clientes
  BEFORE INSERT ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_pipelines
  BEFORE INSERT ON pipelines
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_pipeline_etapas
  BEFORE INSERT ON pipeline_etapas
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_negocios
  BEFORE INSERT ON negocios
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_contatos
  BEFORE INSERT ON contatos
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_cobrancas
  BEFORE INSERT ON cobrancas
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_despesas
  BEFORE INSERT ON despesas
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_categorias_financeiras
  BEFORE INSERT ON categorias_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_formas_pagamento
  BEFORE INSERT ON formas_pagamento
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

CREATE TRIGGER set_empresa_id_movimentacoes_bancarias
  BEFORE INSERT ON movimentacoes_bancarias
  FOR EACH ROW
  EXECUTE FUNCTION set_empresa_id();

-- 15. Função para atualizar JWT com empresa_id
CREATE OR REPLACE FUNCTION update_user_empresa_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar JWT com empresa_id quando usuário for criado/atualizado
  PERFORM set_config('request.jwt.claims', 
    json_build_object(
      'sub', NEW.auth_user_id,
      'empresa_id', NEW.empresa_id
    )::text, 
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Trigger para atualizar JWT
CREATE TRIGGER update_jwt_empresa_id
  AFTER INSERT OR UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_user_empresa_id();
