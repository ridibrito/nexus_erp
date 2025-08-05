# 🚀 Executar Schema de Permissões no Supabase

## ❌ Erro Atual
```
ERROR: 42883: function public.update_empresa_data() does not exist
```

## ✅ Solução

### 1️⃣ Acesse o SQL Editor do Supabase

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Clique em **"SQL Editor"** no menu lateral

### 2️⃣ Execute o Schema

1. **Copie** todo o conteúdo do arquivo `schema-permissoes.sql`
2. **Cole** no SQL Editor do Supabase
3. **Clique** em **"Run"** (botão azul)

### 3️⃣ Verifique se Funcionou

Após executar, você deve ver:

#### ✅ Tabelas Criadas:
- `empresas` - Dados das empresas
- `empresa_usuarios` - Relacionamento usuários-empresas  
- `convites_usuarios` - Sistema de convites

#### ✅ Funções Criadas:
- `get_user_empresa()` - Dados da empresa do usuário
- `get_empresa_usuarios()` - Lista de usuários da empresa
- `update_empresa_data()` - Atualizar dados da empresa

#### ✅ Políticas RLS:
- Row Level Security habilitado
- Políticas de acesso configuradas

### 4️⃣ Teste o Sistema

1. **Acesse**: `http://localhost:3000/dashboard/configuracoes`
2. **Verifique** se os dados carregam automaticamente
3. **Teste** a aba "Permissões"
4. **Confirme** que não há mais erros de função

## 🔧 Alternativa Automática

Se preferir, você pode tentar executar:

```bash
node setup-schema-permissoes.js
```

**Nota**: Este script requer as variáveis de ambiente configuradas no `.env`

## 📋 Conteúdo do Schema

O arquivo `schema-permissoes.sql` contém:

- **3 tabelas** para sistema de permissões
- **3 funções SQL** para operações
- **Políticas RLS** para segurança
- **Triggers automáticos** para criação de empresas

## 🎯 Resultado Esperado

Após executar o schema:

✅ **Sistema funcionando** com dados reais do Supabase  
✅ **Segurança** e isolamento entre empresas  
✅ **Multi-usuários** completamente operacional  
✅ **Permissões granulares** por usuário  

## ❓ Se Ainda Houver Problemas

1. **Verifique** se o schema foi executado com sucesso
2. **Confirme** que as funções foram criadas
3. **Teste** as funções no SQL Editor
4. **Reinicie** o servidor Next.js se necessário

---

**🎉 Após executar o schema, o sistema estará completamente funcional!** 