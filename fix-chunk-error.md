# 🔧 Solução para ChunkLoadError

## 🚨 **Problema Identificado**
O erro `ChunkLoadError` indica um problema de carregamento de chunks no Next.js, geralmente causado por:
- Cache corrompido
- Build incompleto
- Problemas de dependências

## ✅ **Soluções (Execute em Ordem)**

### **1. Limpar Cache e Reinstalar Dependências**
```bash
# Parar o servidor (Ctrl+C)
# Limpar cache do Next.js
rm -rf .next
rm -rf node_modules/.cache

# Reinstalar dependências
npm install

# Limpar cache do npm
npm cache clean --force
```

### **2. Rebuild Completo**
```bash
# Build de produção para verificar erros
npm run build

# Se o build passar, inicie o dev
npm run dev
```

### **3. Verificar Dependências**
```bash
# Verificar se há conflitos
npm ls

# Atualizar dependências se necessário
npm update
```

### **4. Solução Alternativa - Usar Yarn**
```bash
# Se npm continuar com problemas, tente yarn
npm install -g yarn
yarn install
yarn dev
```

### **5. Verificar Arquivo de Configuração**
Certifique-se de que o `next.config.js` está correto:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
```

### **6. Verificar Variáveis de Ambiente**
Certifique-se de que o `.env.local` existe e está configurado:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
```

## 🎯 **Solução Rápida (Mais Provável)**

### **Execute estes comandos em sequência:**
```bash
# 1. Parar o servidor
# 2. Limpar cache
rm -rf .next
rm -rf node_modules/.cache

# 3. Reinstalar
npm install

# 4. Iniciar novamente
npm run dev
```

## 🔍 **Verificações Adicionais**

### **1. Verificar Console do Navegador**
- Abra DevTools (F12)
- Vá na aba Console
- Procure por erros específicos

### **2. Verificar Network**
- Aba Network no DevTools
- Recarregue a página
- Verifique se há requisições falhando

### **3. Modo de Desenvolvimento**
- Tente acessar `http://localhost:3000` diretamente
- Verifique se o servidor está rodando na porta correta

## 🚀 **Se Nada Funcionar**

### **Solução Nuclear:**
```bash
# Backup dos arquivos importantes
cp -r src/ src_backup/
cp package.json package_backup.json

# Limpeza completa
rm -rf node_modules
rm -rf .next
rm package-lock.json

# Reinstalação limpa
npm install
npm run dev
```

## 📋 **Prevenção**

### **Para evitar no futuro:**
1. Sempre pare o servidor antes de fazer mudanças grandes
2. Use `npm run build` para verificar erros
3. Mantenha as dependências atualizadas
4. Use `.gitignore` adequado para cache

## 🎯 **Resultado Esperado**
Após executar as soluções, o erro deve desaparecer e o sistema deve carregar normalmente. 