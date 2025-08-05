// Script para testar rotas e redirecionamento
// Execute com: node test-routes.js

const fs = require('fs')
const path = require('path')

function testRoutes() {
  console.log('🧪 Testando estrutura de rotas...\n')

  const appDir = path.join(__dirname, 'src', 'app')
  
  console.log('📁 Estrutura do diretório app:')
  
  function listFiles(dir, indent = '') {
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        console.log(`${indent}📁 ${item}/`)
        listFiles(fullPath, indent + '  ')
      } else if (item === 'page.tsx') {
        console.log(`${indent}📄 ${item}`)
      }
    })
  }
  
  listFiles(appDir)
  
  console.log('\n🔍 Verificando rotas:')
  
  // Verificar se existe página raiz
  const rootPage = path.join(appDir, 'page.tsx')
  if (fs.existsSync(rootPage)) {
    console.log('✅ Página raiz (/) existe')
  } else {
    console.log('❌ Página raiz (/) não existe')
  }
  
  // Verificar dashboard
  const dashboardPage = path.join(appDir, '(dashboard)', 'page.tsx')
  if (fs.existsSync(dashboardPage)) {
    console.log('✅ Dashboard existe em (dashboard)/page.tsx')
  } else {
    console.log('❌ Dashboard não existe')
  }
  
  console.log('\n📝 Informações sobre grupos de rotas:')
  console.log('- (dashboard) é um grupo de rotas')
  console.log('- A rota / acessa src/app/page.tsx')
  console.log('- A rota /dashboard não existe (grupo de rotas)')
  console.log('- O dashboard está em src/app/(dashboard)/page.tsx')
  
  console.log('\n🎯 Solução:')
  console.log('1. src/app/page.tsx deve renderizar o dashboard')
  console.log('2. Redirecionamento para / deve funcionar')
  console.log('3. O middleware deve permitir acesso a /')
}

testRoutes() 