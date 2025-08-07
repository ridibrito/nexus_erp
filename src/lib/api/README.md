# Estrutura de APIs

Esta pasta contém todas as APIs do sistema, organizadas de forma modular para facilitar a manutenção.

## Estrutura de Arquivos

```
src/lib/api/
├── index.ts                    # Exporta todas as APIs
├── types.ts                    # Tipos compartilhados
├── utils.ts                    # Utilitários compartilhados
├── clientes.ts                 # API de clientes
├── contatos.ts                 # API de contatos
├── pipelines.ts                # API de pipelines
├── negocios.ts                 # API de negócios
├── cobrancas.ts               # API de cobranças
├── despesas.ts                # API de despesas
├── categorias-financeiras.ts   # API de categorias financeiras
├── formas-pagamento.ts        # API de formas de pagamento
└── movimentacoes-bancarias.ts # API de movimentações bancárias
```

## Como Usar

### Importar uma API específica
```typescript
import { clientesAPI } from '@/lib/api/clientes'
import { pipelinesAPI } from '@/lib/api/pipelines'
```

### Importar todas as APIs
```typescript
import { 
  clientesAPI, 
  pipelinesAPI, 
  negociosAPI 
} from '@/lib/api'
```

### Importar tipos
```typescript
import { Cliente, Pipeline, Negocio } from '@/lib/api'
```

## Padrão das APIs

Cada API segue o mesmo padrão com os métodos:

- `listar()` - Lista todos os registros
- `buscar(id)` - Busca um registro específico
- `criar(dados)` - Cria um novo registro
- `atualizar(id, dados)` - Atualiza um registro
- `deletar(id)` - Remove um registro

## Vantagens da Nova Estrutura

1. **Modularidade**: Cada entidade tem seu próprio arquivo
2. **Manutenibilidade**: Mudanças em uma API não afetam outras
3. **Organização**: Código mais limpo e organizado
4. **Reutilização**: Tipos e utilitários compartilhados
5. **Escalabilidade**: Fácil adicionar novas APIs

## Exemplo de Uso

```typescript
// Criar um cliente
const novoCliente = await clientesAPI.criar({
  tipo: 'pessoa_juridica',
  nome_fant: 'Empresa ABC',
  email: 'contato@empresa.com'
})

// Listar pipelines
const pipelines = await pipelinesAPI.listar()

// Criar um negócio
const novoNegocio = await negociosAPI.criar({
  titulo: 'Venda de Software',
  pipeline_id: pipeline.id,
  etapa_id: etapa.id,
  valor: 5000
})
```
