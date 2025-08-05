# Configuração da Autenticação - ERP Nexus

## 🚀 Passos para Configurar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
```

### 2. Configurar Supabase

1. **Acesse o painel do Supabase**
   - Vá para [supabase.com](https://supabase.com)
   - Faça login na sua conta

2. **Criar novo projeto (se necessário)**
   - Clique em "New Project"
   - Escolha sua organização
   - Digite um nome para o projeto
   - Escolha uma senha para o banco
   - Selecione uma região
   - Clique em "Create new project"

3. **Obter as credenciais**
   - No painel do projeto, vá para "Settings" > "API"
   - Copie a "Project URL" e "anon public" key
   - Cole no arquivo `.env.local`

### 3. Executar o Schema SQL

1. **No painel do Supabase**
   - Vá para "SQL Editor" no menu lateral
   - Clique em "New query"

2. **Executar o schema**
   - Cole o conteúdo do arquivo `auth-schema.sql`
   - Clique em "Run" para executar

### 4. Configurar Autenticação

1. **No painel do Supabase**
   - Vá para "Authentication" > "Settings"
   - Em "Site URL", adicione: `http://localhost:3000`
   - Em "Redirect URLs", adicione:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/auth/reset-password`

2. **Configurar e-mail (opcional)**
   - Vá para "Authentication" > "Templates"
   - Personalize os templates de e-mail se desejar

### 5. Testar a Autenticação

1. **Iniciar o projeto**
   ```bash
   npm run dev
   ```

2. **Acessar as páginas**
   - Login: `http://localhost:3000/auth/login`
   - Registro: `http://localhost:3000/auth/register`
   - Esqueceu senha: `http://localhost:3000/auth/forgot-password`

## 🔧 Funcionalidades Implementadas

### ✅ Login
- Autenticação com e-mail e senha
- Validação de campos
- Redirecionamento após login
- Tratamento de erros

### ✅ Registro
- Cadastro com dados pessoais e da empresa
- Validação de CNPJ (opcional)
- Confirmação de senha
- Criação automática do perfil

### ✅ Recuperação de Senha
- Envio de e-mail de recuperação
- Redirecionamento para reset de senha
- Interface de confirmação

### ✅ Perfil do Usuário
- Tabela `profiles` com dados do usuário
- Trigger automático para criar perfil
- Políticas RLS para segurança

## 🛠️ Estrutura do Banco

### Tabela `profiles`
```sql
- id (UUID, PK) - Referência para auth.users
- name (TEXT) - Nome completo do usuário
- company_name (TEXT) - Nome da empresa
- cnpj (TEXT) - CNPJ da empresa (opcional)
- created_at (TIMESTAMP) - Data de criação
- updated_at (TIMESTAMP) - Data de atualização
```

### Políticas de Segurança (RLS)
- Usuário pode ler apenas seu próprio perfil
- Usuário pode atualizar apenas seu próprio perfil
- Trigger cria perfil automaticamente no registro

## 🚨 Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão corretas

### Erro: "Invalid login credentials"
- Verifique se o usuário foi criado corretamente
- Confirme se o e-mail foi confirmado

### Erro: "RLS policy violation"
- Verifique se as políticas RLS foram criadas
- Confirme se o usuário está autenticado

### E-mail não recebido
- Verifique a pasta de spam
- Confirme se o e-mail está correto
- Verifique as configurações de e-mail no Supabase

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador
2. Confirme se todas as configurações estão corretas
3. Teste com um novo projeto Supabase se necessário 