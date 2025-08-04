# 🚀 Guia Completo de Configuração do Supabase

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha os dados:
   - **Name**: `nexus-erp`
   - **Database Password**: (crie uma senha forte)
   - **Region**: (escolha a região mais próxima)
5. Clique em **"Create new project"**

## 2. Executar Schema SQL

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em **"Run"**

**⚠️ IMPORTANTE**: Certifique-se de que o schema foi executado completamente sem erros.

## 3. Configurar Authentication

1. No dashboard do Supabase, vá para **Authentication > Settings**
2. Configure:
   - **Site URL**: `http://localhost:3002` (ou a porta que estiver usando)
   - **Redirect URLs**: 
     - `http://localhost:3002/auth/callback`
     - `http://localhost:3002/auth/reset-password`

## 4. Configurar Storage

1. Vá para **Storage** no dashboard
2. Crie um bucket chamado `avatars`
3. Configure as políticas de segurança executando este SQL:

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

## 5. Obter Credenciais

1. No dashboard do Supabase, vá para **Settings > API**
2. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## 6. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

## 7. Verificar Configuração

### Teste 1: Verificar Tabelas
No SQL Editor, execute:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('empresas', 'clientes', 'cobrancas', 'contas_a_pagar', 'integracoes');
```

### Teste 2: Verificar Políticas RLS
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Teste 3: Verificar Funções
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%faturamento%' OR routine_name LIKE '%despesa%';
```

## 8. Troubleshooting

### Erro: "Database error saving new user"

**Causas possíveis:**
1. Tabelas não foram criadas
2. Políticas RLS estão bloqueando
3. Schema não foi executado completamente

**Soluções:**
1. Execute novamente o `supabase-schema.sql`
2. Verifique se todas as tabelas foram criadas
3. Verifique se as políticas RLS estão ativas

### Erro: "RLS policy violation"

**Solução:**
1. Verifique se o usuário está autenticado
2. Confirme se as políticas RLS estão corretas
3. Teste as políticas manualmente

### Erro: "Table does not exist"

**Solução:**
1. Execute o schema SQL novamente
2. Verifique se não há erros de sintaxe
3. Confirme se todas as tabelas foram criadas

## 9. Teste Final

1. Reinicie o servidor: `npm run dev`
2. Acesse `http://localhost:3002`
3. Tente criar uma nova conta
4. Verifique se o login funciona
5. Teste o upload de avatar

## 10. Logs de Debug

Para debugar problemas, adicione logs no console:

```typescript
// No arquivo de registro
console.log('Auth data:', authData)
console.log('Empresa data:', empresaData)
console.log('Errors:', authError, empresaError)
```

## 📋 Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Schema SQL executado sem erros
- [ ] Authentication configurado
- [ ] Storage bucket criado
- [ ] Políticas de storage configuradas
- [ ] Variáveis de ambiente configuradas
- [ ] Tabelas verificadas
- [ ] Políticas RLS verificadas
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando

## 🔧 Comandos Úteis

```bash
# Verificar se o servidor está rodando
npm run dev

# Limpar cache do Next.js
rm -rf .next
npm run dev

# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
```

## 📞 Suporte

Se ainda houver problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do servidor
3. Confirme se todas as etapas foram seguidas
4. Teste com um projeto Supabase limpo 