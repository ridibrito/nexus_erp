# ERP Nexus v1.0

Sistema de gestão financeira e automação fiscal projetado para prestadores de serviço brasileiros. Integrado à suíte Nexus, centraliza o controle de cobranças, pagamentos, despesas e emissão de notas fiscais.

## 🚀 Características

- **Dashboard Financeiro**: Visão clara da saúde financeira do negócio
- **Automação de Cobranças**: Integração com Stripe para geração automática de cobranças
- **Emissão de NFS-e**: Automática para Brasília-DF
- **Gestão de Clientes**: Cadastro e controle de clientes
- **Controle de Despesas**: Acompanhamento de contas a pagar
- **Interface Moderna**: Design consistente com a identidade visual Nexus

## 🛠️ Stack Técnico

- **Frontend**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript (Strict)
- **Estilização**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe
- **E-mails**: Resend
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Stripe
- Conta no Resend
- Certificado Digital A1 válido

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd nexus
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_CLIENT_ID=ca_...
NEXT_PUBLIC_STRIPE_REDIRECT_URI=http://localhost:3000/api/auth/stripe/callback

# Resend (E-mails)
RESEND_API_KEY=re_...

# SEFAZ-DF (NFS-e)
SEFAZ_DF_URL=https://www.fazenda.df.gov.br/...
SEFAZ_DF_USERNAME=your_username
SEFAZ_DF_PASSWORD=your_password
```

4. **Configure o banco de dados**
```bash
# Execute o schema SQL no seu projeto Supabase
# Copie o conteúdo de supabase-schema.sql e execute no SQL Editor
```

5. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 🗄️ Configuração do Banco de Dados

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote a URL e as chaves de API

### 2. Executar o Schema

1. No painel do Supabase, vá para "SQL Editor"
2. Cole o conteúdo do arquivo `supabase-schema.sql`
3. Execute o script

### 3. Configurar Storage

1. No painel do Supabase, vá para "Storage"
2. Crie um bucket chamado `certificados` com as seguintes configurações:
   - **Public**: false
   - **File size limit**: 10MB
   - **Allowed MIME types**: application/x-pkcs12

## 🔧 Configuração do Stripe

### 1. Criar conta no Stripe

1. Acesse [stripe.com](https://stripe.com)
2. Crie uma conta
3. Obtenha as chaves de API no Dashboard

### 2. Configurar Connect

1. No Dashboard do Stripe, vá para "Connect"
2. Configure as URLs de redirecionamento
3. Anote o Client ID

### 3. Configurar Webhooks

1. No Dashboard do Stripe, vá para "Webhooks"
2. Adicione o endpoint: `https://seu-dominio.com/api/webhooks/stripe`
3. Selecione os eventos:
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 📧 Configuração do Resend

### 1. Criar conta no Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta
3. Obtenha a API Key

### 2. Configurar domínio

1. No painel do Resend, adicione seu domínio
2. Configure os registros DNS conforme instruções

## 🏛️ Configuração SEFAZ-DF

### 1. Obter credenciais

1. Acesse o portal da SEFAZ-DF
2. Solicite credenciais para emissão de NFS-e
3. Obtenha o certificado digital A1

### 2. Configurar certificado

1. Faça upload do certificado .pfx no sistema
2. Configure a senha do certificado
3. Teste a emissão de uma NFS-e

## 📁 Estrutura do Projeto

```
nexus/
├── src/
│   ├── app/                    # Páginas da aplicação
│   │   ├── page.tsx           # Dashboard principal
│   │   ├── configuracoes/     # Configurações
│   │   ├── cobrancas/         # Gestão de cobranças
│   │   └── ...
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes base (shadcn/ui)
│   │   └── ...
│   ├── lib/                  # Utilitários e configurações
│   ├── types/                # Definições TypeScript
│   └── hooks/                # Custom hooks
├── supabase-schema.sql       # Schema do banco de dados
├── package.json
└── README.md
```

## 🎨 Design System

### Paleta de Cores

- **Fundo**: `#F8FAFC` (Cinza Extra Claro)
- **Cards**: `#FFFFFF` (Branco)
- **Texto Principal**: `#0F172A` (Cinza Escuro)
- **Ações Primárias**: `#2563EB` (Azul Vívido)
- **Destaque/Marca**: `#F97316` (Laranja)

### Tipografia

- **Fonte**: Inter
- **Pesos**: 300, 400, 500, 600, 700

### Componentes

Todos os componentes seguem o padrão shadcn/ui com customizações para manter a identidade visual do Nexus.

## 🔄 Fluxo de Trabalho

### 1. Configuração Inicial

1. Cadastrar dados da empresa
2. Conectar com Stripe
3. Fazer upload do certificado digital
4. Configurar integrações

### 2. Operação Diária

1. **Criar Cobrança**: Selecionar cliente, definir valor e vencimento
2. **Automação**: Sistema gera cobrança no Stripe e envia e-mail
3. **NFS-e**: Emitida automaticamente após criação da cobrança
4. **Conciliação**: Pagamentos são conciliados automaticamente via webhook

## 🧪 Testes

```bash
# Executar testes
npm run test

# Verificar tipos TypeScript
npm run type-check

# Linting
npm run lint
```

## 📦 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato através de:
- Email: suporte@nexus.com
- Discord: [Link do servidor]
- Documentação: [Link da documentação]

## 🔄 Changelog

### v1.0.0 (2025-01-04)
- ✅ Dashboard financeiro completo
- ✅ Integração com Stripe
- ✅ Emissão automática de NFS-e
- ✅ Gestão de clientes
- ✅ Controle de despesas
- ✅ Interface moderna e responsiva

---

**ERP Nexus** - Automatizando o seu fluxo financeiro 🚀 