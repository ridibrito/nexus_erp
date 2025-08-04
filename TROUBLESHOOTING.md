# 🔧 Troubleshooting - Erro "Database error saving new user"

## 🚨 Problema Identificado

O erro `Database error saving new user` indica que o Supabase não consegue salvar o usuário no banco de dados. Isso geralmente acontece por:

1. **Tabelas não criadas**
2. **Políticas RLS bloqueando**
3. **Schema não executado corretamente**
4. **Configuração incorreta**

## 🔍 Passos para Resolver

### 1. Verificar Configuração do Supabase

**Acesse o dashboard do Supabase e execute:**

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'clientes', 'cobrancas', 'contas_a_pagar', 'integracoes');
```

**Se não retornar as tabelas, execute o schema:**

```sql
-- Execute o arquivo test-schema.sql primeiro
-- Depois execute o supabase-schema.sql completo
```

### 2. Verificar Políticas RLS

```sql
-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

**Deve mostrar políticas para:**
- `empresas` (SELECT, INSERT, UPDATE, DELETE)
- `clientes` (SELECT, INSERT, UPDATE, DELETE)
- `cobrancas` (SELECT, INSERT, UPDATE, DELETE)
- `contas_a_pagar` (SELECT, INSERT, UPDATE, DELETE)
- `integracoes` (SELECT, INSERT, UPDATE, DELETE)

### 3. Testar Conexão Manualmente

**Execute no SQL Editor:**

```sql
-- Teste básico de inserção (será bloqueado por RLS, que é normal)
INSERT INTO empresas (user_id, razao_social) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Teste') 
RETURNING id;
```

**Se der erro de tabela não existe:**
- Execute o schema SQL novamente

**Se der erro de RLS:**
- As políticas estão funcionando (bom!)

### 4. Verificar Authentication Settings

**No dashboard do Supabase:**

1. Vá para **Authentication > Settings**
2. Verifique:
   - **Site URL**: `http://localhost:3002`
   - **Redirect URLs**: 
     - `http://localhost:3002/auth/callback`
     - `http://localhost:3002/auth/reset-password`

### 5. Verificar Variáveis de Ambiente

**No arquivo `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
```

**Teste as variáveis:**

```bash
# No terminal
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 6. Teste com Schema Mínimo

**Se o problema persistir, execute este schema mínimo:**

```sql
-- Schema mínimo para teste
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    razao_social VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_empresas_user_id ON empresas(user_id);
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own empresa" ON empresas
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own empresa" ON empresas
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own empresa" ON empresas
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own empresa" ON empresas
    FOR DELETE USING (auth.uid() = user_id);
```

### 7. Debug no Console

**Abra o console do navegador e tente cadastrar:**

1. Acesse `http://localhost:3002/auth/register`
2. Abra o DevTools (F12)
3. Vá para a aba Console
4. Preencha o formulário e tente cadastrar
5. Observe os logs detalhados

**Logs esperados:**
```
🚀 Iniciando processo de cadastro...
🔍 Testando conexão com Supabase...
✅ Conexão com Supabase OK
👤 Criando usuário no Auth...
✅ Usuário criado com sucesso: [uuid]
🏢 Criando empresa no banco...
✅ Empresa criada com sucesso: [dados]
```

### 8. Soluções Específicas

#### Problema: "Table does not exist"
```sql
-- Execute o schema completo
-- Verifique se não há erros de sintaxe
```

#### Problema: "RLS policy violation"
```sql
-- Verifique se as políticas estão corretas
-- Teste com usuário autenticado
```

#### Problema: "Connection failed"
```bash
# Verifique as variáveis de ambiente
# Reinicie o servidor
npm run dev
```

#### Problema: "Auth error"
```sql
-- Verifique as configurações de Authentication
-- Confirme as URLs de redirecionamento
```

## 🎯 Teste Final

1. **Execute o schema mínimo**
2. **Configure as variáveis de ambiente**
3. **Reinicie o servidor**
4. **Acesse `/debug` para testar**
5. **Tente cadastrar um usuário**

## 📞 Se Ainda Não Funcionar

1. **Crie um novo projeto Supabase**
2. **Execute apenas o schema mínimo**
3. **Teste com credenciais limpas**
4. **Verifique se não há conflitos de cache**

## 🔗 Links Úteis

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs - Auth](https://supabase.com/docs/guides/auth)
- [Supabase Docs - RLS](https://supabase.com/docs/guides/auth/row-level-security) 