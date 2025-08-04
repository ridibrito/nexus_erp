# 🚀 Configuração do Supabase para Nexus ERP

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Name**: `nexus-erp`
   - **Database Password**: (crie uma senha forte)
   - **Region**: (escolha a região mais próxima)
5. Clique em "Create new project"

## 2. Executar Schema SQL

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **"Run"**

## 3. Obter Credenciais

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Stripe (opcional - para pagamentos)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (opcional - para e-mails)
RESEND_API_KEY=re_...

# SEFAZ-DF (opcional - para NFS-e)
SEFAZ_DF_URL=https://www.fazenda.df.gov.br/...
SEFAZ_DF_USERNAME=seu_usuario
SEFAZ_DF_PASSWORD=sua_senha
```

## 5. Configurar Storage (opcional)

Para armazenar certificados digitais:

1. No dashboard do Supabase, vá para **Storage**
2. Crie um bucket chamado `certificados`
3. Configure as políticas de segurança conforme necessário

## 6. Configurar Authentication

1. No dashboard do Supabase, vá para **Authentication > Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

## 7. Testar a Conexão

Após configurar tudo, reinicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 8. Estrutura do Banco de Dados

O schema criado inclui:

- **empresas**: Dados da empresa do usuário
- **clientes**: Base de clientes
- **cobrancas**: Contas a receber
- **contas_a_pagar**: Contas a pagar
- **integracoes**: Configurações de integração

## 9. Políticas de Segurança

O schema já inclui:
- **Row Level Security (RLS)** habilitado
- **Políticas** para garantir que usuários vejam apenas seus dados
- **Índices** para performance
- **Funções** para cálculos financeiros

## 10. Próximos Passos

Após configurar o Supabase:

1. Implementar autenticação
2. Conectar as páginas ao banco de dados
3. Implementar funcionalidades CRUD
4. Configurar integrações (Stripe, e-mail, etc.)

## 🔧 Comandos Úteis

```bash
# Instalar dependências do Supabase
npm install @supabase/supabase-js @supabase/ssr

# Verificar se tudo está funcionando
npm run dev
```

## 📝 Notas Importantes

- Mantenha as chaves seguras e nunca as compartilhe
- Use variáveis de ambiente para diferentes ambientes
- O schema inclui todas as funcionalidades do ERP
- As políticas RLS garantem segurança dos dados 