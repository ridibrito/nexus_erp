# 🔐 Configuração do Sistema de Autenticação

## ✅ Funcionalidades Implementadas

### Páginas de Autenticação
- **Login** (`/auth/login`) - Acesso com e-mail e senha
- **Cadastro** (`/auth/register`) - Criação de nova conta
- **Recuperação de Senha** (`/auth/forgot-password`) - Envio de e-mail de recuperação
- **Redefinição de Senha** (`/auth/reset-password`) - Nova senha após recuperação

### Funcionalidades do Usuário
- **Perfil** (`/perfil`) - Edição de dados pessoais e upload de avatar
- **Logout** - Sair da conta com redirecionamento
- **Proteção de Rotas** - Middleware para proteger páginas

### Componentes
- **AuthProvider** - Contexto de autenticação
- **ProtectedRoute** - Componente para proteger rotas
- **AvatarUpload** - Upload de avatar com storage

## 🚀 Configuração do Supabase

### 1. Configurar Authentication

No dashboard do Supabase, vá para **Authentication > Settings**:

```
Site URL: http://localhost:3000
Redirect URLs: 
- http://localhost:3000/auth/callback
- http://localhost:3000/auth/reset-password
```

### 2. Configurar Storage

1. Vá para **Storage** no dashboard
2. Crie um bucket chamado `avatars`
3. Configure as políticas de segurança:

```sql
-- Política para permitir upload de avatares
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir visualização de avatares
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Política para permitir atualização de avatares
CREATE POLICY "Users can update avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir remoção de avatares
CREATE POLICY "Users can delete avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

## 📁 Estrutura de Arquivos

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── layout.tsx
│   └── perfil/page.tsx
├── components/
│   ├── auth/
│   │   ├── protected-route.tsx
│   │   └── avatar-upload.tsx
│   └── layout/
│       ├── header.tsx
│       └── sidebar.tsx
├── contexts/
│   └── auth-context.tsx
├── lib/
│   └── supabase.ts
└── middleware.ts
```

## 🔧 Como Usar

### 1. Login
```typescript
import { useAuth } from '@/contexts/auth-context'

const { user, signOut } = useAuth()
```

### 2. Proteger Rotas
```typescript
import { ProtectedRoute } from '@/components/auth/protected-route'

<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

### 3. Upload de Avatar
```typescript
import { AvatarUpload } from '@/components/auth/avatar-upload'

<AvatarUpload onUpload={(url) => console.log(url)} />
```

## 🎯 Fluxo de Autenticação

1. **Usuário não autenticado** → Redirecionado para `/auth/login`
2. **Login bem-sucedido** → Redirecionado para `/`
3. **Tentativa de acessar rota protegida sem auth** → Redirecionado para `/auth/login`
4. **Usuário autenticado tentando acessar rota de auth** → Redirecionado para `/`

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Middleware** protege rotas no servidor
- **Context** gerencia estado de autenticação no cliente
- **Storage** com políticas de segurança para avatares

## 🚨 Troubleshooting

### Erro de CORS
- Verifique se as URLs estão configuradas corretamente no Supabase
- Certifique-se de que o `NEXT_PUBLIC_SUPABASE_URL` está correto

### Avatar não aparece
- Verifique se o bucket `avatars` foi criado
- Confirme se as políticas de storage estão configuradas
- Verifique se o arquivo `.env.local` está configurado

### Middleware não funciona
- Reinicie o servidor após criar o `middleware.ts`
- Verifique se as rotas estão listadas corretamente no middleware

## 📝 Próximos Passos

1. **Implementar confirmação de e-mail**
2. **Adicionar autenticação social (Google, GitHub)**
3. **Implementar refresh token automático**
4. **Adicionar logs de auditoria**
5. **Implementar 2FA (Two-Factor Authentication)** 