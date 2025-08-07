import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  clientesAPI,
  contatosAPI,
  pipelinesAPI,
  negociosAPI,
  cobrancasAPI,
  despesasAPI,
  categoriasFinanceirasAPI,
  formasPagamentoAPI,
  type Cliente,
  type Contato,
  type Pipeline,
  type Negocio,
  type Cobranca,
  type Despesa,
  type CategoriaFinanceira,
  type FormaPagamento
} from '@/lib/api'
import { usuariosAPI, type Usuario } from '@/lib/api/usuarios'

// =====================================================
// HOOKS PARA CLIENTES
// =====================================================

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarClientes = useCallback(async () => {
    console.log('=== INICIANDO carregarClientes() ===')
    try {
      setLoading(true)
      setError(null)
      console.log('Chamando clientesAPI.listar()...')
      const data = await clientesAPI.listar()
      console.log('Dados recebidos de clientesAPI.listar():', data)
      setClientes(data)
    } catch (err) {
      console.log('Erro capturado em carregarClientes():', err)
      console.log('Tipo do erro:', typeof err)
      console.log('Erro é instância de Error?', err instanceof Error)
      console.log('Mensagem do erro:', err instanceof Error ? err.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(err, null, 2))
      
      // Se não há dados ou empresa não encontrada, não tratar como erro
      if (err instanceof Error && (
        err.message.includes('não encontrado') || 
        err.message.includes('Empresa não encontrada') ||
        err.message.includes('relation "clientes" does not exist') ||
        err.message.includes('does not exist')
      )) {
        console.log('Tabela clientes não encontrada ou estrutura diferente, retornando array vazio')
        setClientes([])
        setError(null)
      } else {
        // Capturar qualquer tipo de erro e retornar array vazio
        console.log('Retornando array vazio devido a erro em carregarClientes')
        setClientes([])
        setError(null) // Não definir erro para não mostrar toast
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const criarCliente = useCallback(async (cliente: Omit<Cliente, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novoCliente = await clientesAPI.criar(cliente)
      setClientes(prev => [...prev, novoCliente])
      toast.success('Cliente criado com sucesso!')
      return novoCliente
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar cliente'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarCliente = useCallback(async (id: string, dados: Partial<Cliente>) => {
    try {
      const clienteAtualizado = await clientesAPI.atualizar(id, dados)
      setClientes(prev => prev.map(c => c.id === id ? clienteAtualizado : c))
      toast.success('Cliente atualizado com sucesso!')
      return clienteAtualizado
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar cliente'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarCliente = useCallback(async (id: string) => {
    try {
      await clientesAPI.deletar(id)
      setClientes(prev => prev.filter(c => c.id !== id))
      toast.success('Cliente deletado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar cliente'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarClientes()
  }, [carregarClientes])

  return {
    clientes,
    loading,
    error,
    carregarClientes,
    criarCliente,
    atualizarCliente,
    deletarCliente
  }
}

// =====================================================
// HOOKS PARA NEGÓCIOS
// =====================================================

export function useNegocios() {
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarNegocios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await negociosAPI.listar()
      setNegocios(data)
    } catch (err) {
      // Se não há dados ou empresa não encontrada, não tratar como erro
      if (err instanceof Error && (
        err.message.includes('não encontrado') || 
        err.message.includes('Empresa não encontrada') ||
        err.message.includes('relation "negocios" does not exist') ||
        err.message.includes('does not exist')
      )) {
        console.log('Tabela negocios não encontrada ou estrutura diferente, retornando array vazio')
        setNegocios([])
      } else {
        const message = err instanceof Error ? err.message : 'Erro ao carregar negócios'
        setError(message)
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const criarNegocio = useCallback(async (negocio: Omit<Negocio, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novoNegocio = await negociosAPI.criar(negocio)
      setNegocios(prev => [...prev, novoNegocio])
      toast.success('Negócio criado com sucesso!')
      return novoNegocio
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar negócio'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarNegocio = useCallback(async (id: string, dados: Partial<Negocio>) => {
    try {
      const negocioAtualizado = await negociosAPI.atualizar(id, dados)
      setNegocios(prev => prev.map(n => n.id === id ? negocioAtualizado : n))
      toast.success('Negócio atualizado com sucesso!')
      return negocioAtualizado
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar negócio'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarNegocio = useCallback(async (id: string) => {
    try {
      await negociosAPI.deletar(id)
      setNegocios(prev => prev.filter(n => n.id !== id))
      toast.success('Negócio deletado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar negócio'
      toast.error(message)
      throw err
    }
  }, [])

  const moverNegocio = useCallback(async (id: string, etapa_id: string) => {
    try {
      const negocioMovido = await negociosAPI.moverParaEtapa(id, etapa_id)
      setNegocios(prev => prev.map(n => n.id === id ? negocioMovido : n))
      toast.success('Negócio movido com sucesso!')
      return negocioMovido
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao mover negócio'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarNegocios()
  }, [carregarNegocios])

  return {
    negocios,
    loading,
    error,
    carregarNegocios,
    criarNegocio,
    atualizarNegocio,
    deletarNegocio,
    moverNegocio
  }
}

// =====================================================
// HOOKS PARA PIPELINES
// =====================================================

export function usePipelines() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarPipelines = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await pipelinesAPI.listar()
      setPipelines(data)
    } catch (err) {
      // Se não há dados ou empresa não encontrada, não tratar como erro
      if (err instanceof Error && (
        err.message.includes('não encontrado') || 
        err.message.includes('Empresa não encontrada') ||
        err.message.includes('relation "pipelines" does not exist') ||
        err.message.includes('does not exist')
      )) {
        console.log('Tabela pipelines não encontrada ou estrutura diferente, retornando array vazio')
        setPipelines([])
      } else {
        const message = err instanceof Error ? err.message : 'Erro ao carregar pipelines'
        setError(message)
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const criarPipeline = useCallback(async (pipeline: Omit<Pipeline, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    console.log('=== INICIANDO criarPipeline() ===')
    console.log('Dados do pipeline recebidos:', pipeline)
    
    try {
      console.log('Chamando pipelinesAPI.criar()...')
      const novoPipeline = await pipelinesAPI.criar(pipeline)
      console.log('Pipeline criado com sucesso:', novoPipeline)
      setPipelines(prev => [...prev, novoPipeline])
      toast.success('Pipeline criado com sucesso!')
      return novoPipeline
    } catch (err) {
      console.log('Erro capturado em criarPipeline():', err)
      console.log('Tipo do erro:', typeof err)
      console.log('Erro é instância de Error?', err instanceof Error)
      console.log('Mensagem do erro:', err instanceof Error ? err.message : 'Erro não é instância de Error')
      console.log('Erro completo:', JSON.stringify(err, null, 2))
      
      const message = err instanceof Error ? err.message : 'Erro ao criar pipeline'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarPipeline = useCallback(async (id: string, dados: Partial<Pipeline>) => {
    try {
      const pipelineAtualizado = await pipelinesAPI.atualizar(id, dados)
      setPipelines(prev => prev.map(p => p.id === id ? pipelineAtualizado : p))
      toast.success('Pipeline atualizado com sucesso!')
      return pipelineAtualizado
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar pipeline'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarPipeline = useCallback(async (id: string) => {
    try {
      await pipelinesAPI.deletar(id)
      setPipelines(prev => prev.filter(p => p.id !== id))
      toast.success('Pipeline deletado com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar pipeline'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarPipelines()
  }, [carregarPipelines])

  return {
    pipelines,
    loading,
    error,
    carregarPipelines,
    criarPipeline,
    atualizarPipeline,
    deletarPipeline
  }
}

// =====================================================
// HOOKS PARA COBRANÇAS
// =====================================================

export function useCobrancas() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarCobrancas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await cobrancasAPI.listar()
      setCobrancas(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar cobranças'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarCobranca = useCallback(async (cobranca: Omit<Cobranca, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novaCobranca = await cobrancasAPI.criar(cobranca)
      setCobrancas(prev => [...prev, novaCobranca])
      toast.success('Cobrança criada com sucesso!')
      return novaCobranca
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar cobrança'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarCobranca = useCallback(async (id: string, dados: Partial<Cobranca>) => {
    try {
      const cobrancaAtualizada = await cobrancasAPI.atualizar(id, dados)
      setCobrancas(prev => prev.map(c => c.id === id ? cobrancaAtualizada : c))
      toast.success('Cobrança atualizada com sucesso!')
      return cobrancaAtualizada
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar cobrança'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarCobranca = useCallback(async (id: string) => {
    try {
      await cobrancasAPI.deletar(id)
      setCobrancas(prev => prev.filter(c => c.id !== id))
      toast.success('Cobrança deletada com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar cobrança'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarCobrancas()
  }, [carregarCobrancas])

  return {
    cobrancas,
    loading,
    error,
    carregarCobrancas,
    criarCobranca,
    atualizarCobranca,
    deletarCobranca
  }
}

// =====================================================
// HOOKS PARA DESPESAS
// =====================================================

export function useDespesas() {
  const [despesas, setDespesas] = useState<Despesa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarDespesas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await despesasAPI.listar()
      setDespesas(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar despesas'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarDespesa = useCallback(async (despesa: Omit<Despesa, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novaDespesa = await despesasAPI.criar(despesa)
      setDespesas(prev => [...prev, novaDespesa])
      toast.success('Despesa criada com sucesso!')
      return novaDespesa
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar despesa'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarDespesa = useCallback(async (id: string, dados: Partial<Despesa>) => {
    try {
      const despesaAtualizada = await despesasAPI.atualizar(id, dados)
      setDespesas(prev => prev.map(d => d.id === id ? despesaAtualizada : d))
      toast.success('Despesa atualizada com sucesso!')
      return despesaAtualizada
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar despesa'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarDespesa = useCallback(async (id: string) => {
    try {
      await despesasAPI.deletar(id)
      setDespesas(prev => prev.filter(d => d.id !== id))
      toast.success('Despesa deletada com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar despesa'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarDespesas()
  }, [carregarDespesas])

  return {
    despesas,
    loading,
    error,
    carregarDespesas,
    criarDespesa,
    atualizarDespesa,
    deletarDespesa
  }
}

// =====================================================
// HOOKS PARA CATEGORIAS FINANCEIRAS
// =====================================================

export function useCategoriasFinanceiras() {
  const [categorias, setCategorias] = useState<CategoriaFinanceira[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarCategorias = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoriasFinanceirasAPI.listar()
      setCategorias(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar categorias'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarCategoria = useCallback(async (categoria: Omit<CategoriaFinanceira, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novaCategoria = await categoriasFinanceirasAPI.criar(categoria)
      setCategorias(prev => [...prev, novaCategoria])
      toast.success('Categoria criada com sucesso!')
      return novaCategoria
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar categoria'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarCategoria = useCallback(async (id: string, dados: Partial<CategoriaFinanceira>) => {
    try {
      const categoriaAtualizada = await categoriasFinanceirasAPI.atualizar(id, dados)
      setCategorias(prev => prev.map(c => c.id === id ? categoriaAtualizada : c))
      toast.success('Categoria atualizada com sucesso!')
      return categoriaAtualizada
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar categoria'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarCategoria = useCallback(async (id: string) => {
    try {
      await categoriasFinanceirasAPI.deletar(id)
      setCategorias(prev => prev.filter(c => c.id !== id))
      toast.success('Categoria deletada com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar categoria'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarCategorias()
  }, [carregarCategorias])

  return {
    categorias,
    loading,
    error,
    carregarCategorias,
    criarCategoria,
    atualizarCategoria,
    deletarCategoria
  }
}

// =====================================================
// HOOKS PARA FORMAS DE PAGAMENTO
// =====================================================

export function useFormasPagamento() {
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarFormasPagamento = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await formasPagamentoAPI.listar()
      setFormasPagamento(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar formas de pagamento'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const criarFormaPagamento = useCallback(async (forma: Omit<FormaPagamento, 'id' | 'empresa_id' | 'created_at' | 'updated_at'>) => {
    try {
      const novaForma = await formasPagamentoAPI.criar(forma)
      setFormasPagamento(prev => [...prev, novaForma])
      toast.success('Forma de pagamento criada com sucesso!')
      return novaForma
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar forma de pagamento'
      toast.error(message)
      throw err
    }
  }, [])

  const atualizarFormaPagamento = useCallback(async (id: string, dados: Partial<FormaPagamento>) => {
    try {
      const formaAtualizada = await formasPagamentoAPI.atualizar(id, dados)
      setFormasPagamento(prev => prev.map(f => f.id === id ? formaAtualizada : f))
      toast.success('Forma de pagamento atualizada com sucesso!')
      return formaAtualizada
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar forma de pagamento'
      toast.error(message)
      throw err
    }
  }, [])

  const deletarFormaPagamento = useCallback(async (id: string) => {
    try {
      await formasPagamentoAPI.deletar(id)
      setFormasPagamento(prev => prev.filter(f => f.id !== id))
      toast.success('Forma de pagamento deletada com sucesso!')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar forma de pagamento'
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarFormasPagamento()
  }, [carregarFormasPagamento])

  return {
    formasPagamento,
    loading,
    error,
    carregarFormasPagamento,
    criarFormaPagamento,
    atualizarFormaPagamento,
    deletarFormaPagamento
  }
}

// =====================================================
// HOOKS PARA USUÁRIOS
// =====================================================

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await usuariosAPI.listar()
      setUsuarios(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar usuários'
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const buscarUsuario = useCallback(async (id: string) => {
    try {
      return await usuariosAPI.buscarPorId(id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar usuário'
      toast.error(message)
      throw err
    }
  }, [])

  const buscarUsuariosPorEmpresa = useCallback(async (empresaId: string) => {
    try {
      const data = await usuariosAPI.buscarPorEmpresa(empresaId)
      setUsuarios(data)
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar usuários da empresa'
      setError(message)
      toast.error(message)
      throw err
    }
  }, [])

  useEffect(() => {
    carregarUsuarios()
  }, [carregarUsuarios])

  return {
    usuarios,
    loading,
    error,
    carregarUsuarios,
    buscarUsuario,
    buscarUsuariosPorEmpresa
  }
} 