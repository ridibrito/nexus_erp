import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

// Tipos para a agência
export interface CategoriaServico {
  id: string
  nome: string
  descricao?: string
  cor: string
  is_active: boolean
}

export interface Servico {
  id: string
  categoria_id?: string
  categoria_nome?: string
  nome: string
  descricao?: string
  tipo_cobranca: 'recorrente' | 'pontual' | 'hora' | 'projeto'
  valor_base: number
  unidade_cobranca?: 'mes' | 'ano' | 'hora' | 'projeto' | 'unidade'
  tempo_estimado_horas?: number
  is_active: boolean
}

export interface Contrato {
  id: string
  cliente_id: string
  cliente_nome: string
  numero_contrato: string
  titulo: string
  descricao?: string
  data_inicio: string
  data_fim?: string
  status: 'ativo' | 'pausado' | 'cancelado' | 'finalizado'
  valor_total: number
  forma_pagamento?: string
  observacoes?: string
  created_at: string
}

export interface Projeto {
  id: string
  cliente_id: string
  cliente_nome: string
  contrato_id?: string
  titulo: string
  descricao?: string
  status: 'proposta' | 'aprovado' | 'em_andamento' | 'revisao' | 'finalizado' | 'cancelado'
  data_inicio?: string
  data_fim_prevista?: string
  data_fim_real?: string
  valor_total: number
  valor_pago: number
  percentual_conclusao: number
  responsavel_nome?: string
  observacoes?: string
  created_at: string
}

export interface Cobranca {
  id: string
  cliente_id: string
  cliente_nome: string
  contrato_id?: string
  projeto_id?: string
  numero_nota?: string
  tipo_cobranca: 'recorrente' | 'pontual' | 'projeto'
  descricao: string
  valor: number
  status: 'pendente' | 'paga' | 'vencida' | 'cancelada'
  data_emissao: string
  data_vencimento: string
  data_pagamento?: string
  forma_pagamento?: string
  observacoes?: string
  created_at: string
}

export function useAgenciaData() {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar categorias de serviços
  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from('categorias_servicos')
        .select('*')
        .eq('is_active', true)
        .order('nome')

      if (error) throw error
      setCategorias(data || [])
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
      toast.error('Erro ao carregar categorias de serviços')
    }
  }

  // Carregar serviços
  const loadServicos = async () => {
    try {
      const { data, error } = await supabase.rpc('get_workspace_servicos')
      if (error) throw error
      setServicos(data || [])
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
      toast.error('Erro ao carregar serviços')
    }
  }

  // Carregar contratos
  const loadContratos = async () => {
    try {
      const { data, error } = await supabase.rpc('get_workspace_contratos')
      if (error) throw error
      setContratos(data || [])
    } catch (error) {
      console.error('Erro ao carregar contratos:', error)
      toast.error('Erro ao carregar contratos')
    }
  }

  // Carregar projetos
  const loadProjetos = async () => {
    try {
      const { data, error } = await supabase.rpc('get_workspace_projetos')
      if (error) throw error
      setProjetos(data || [])
    } catch (error) {
      console.error('Erro ao carregar projetos:', error)
      toast.error('Erro ao carregar projetos')
    }
  }

  // Carregar cobranças
  const loadCobrancas = async () => {
    try {
      const { data, error } = await supabase.rpc('get_workspace_cobrancas')
      if (error) throw error
      setCobrancas(data || [])
    } catch (error) {
      console.error('Erro ao carregar cobranças:', error)
      toast.error('Erro ao carregar cobranças')
    }
  }

  // Carregar todos os dados
  const loadAgenciaData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadCategorias(),
        loadServicos(),
        loadContratos(),
        loadProjetos(),
        loadCobrancas()
      ])
    } catch (error) {
      console.error('Erro ao carregar dados da agência:', error)
    } finally {
      setLoading(false)
    }
  }

  // Criar categoria
  const createCategoria = async (categoria: Omit<CategoriaServico, 'id' | 'is_active'>) => {
    try {
      const { data, error } = await supabase
        .from('categorias_servicos')
        .insert([categoria])
        .select()
        .single()

      if (error) throw error
      
      toast.success('Categoria criada com sucesso!')
      await loadCategorias()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      toast.error('Erro ao criar categoria')
      return { success: false }
    }
  }

  // Criar serviço
  const createServico = async (servico: Omit<Servico, 'id' | 'is_active' | 'categoria_nome'>) => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .insert([servico])
        .select()
        .single()

      if (error) throw error
      
      toast.success('Serviço criado com sucesso!')
      await loadServicos()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar serviço:', error)
      toast.error('Erro ao criar serviço')
      return { success: false }
    }
  }

  // Criar contrato
  const createContrato = async (contrato: Omit<Contrato, 'id' | 'cliente_nome' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('contratos')
        .insert([contrato])
        .select()
        .single()

      if (error) throw error
      
      toast.success('Contrato criado com sucesso!')
      await loadContratos()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      toast.error('Erro ao criar contrato')
      return { success: false }
    }
  }

  // Criar projeto
  const createProjeto = async (projeto: Omit<Projeto, 'id' | 'cliente_nome' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .insert([projeto])
        .select()
        .single()

      if (error) throw error
      
      toast.success('Projeto criado com sucesso!')
      await loadProjetos()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      toast.error('Erro ao criar projeto')
      return { success: false }
    }
  }

  // Criar cobrança
  const createCobranca = async (cobranca: Omit<Cobranca, 'id' | 'cliente_nome' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('cobrancas')
        .insert([cobranca])
        .select()
        .single()

      if (error) throw error
      
      toast.success('Cobrança criada com sucesso!')
      await loadCobrancas()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar cobrança:', error)
      toast.error('Erro ao criar cobrança')
      return { success: false }
    }
  }

  // Atualizar projeto
  const updateProjeto = async (id: string, updates: Partial<Projeto>) => {
    try {
      const { data, error } = await supabase
        .from('projetos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      toast.success('Projeto atualizado com sucesso!')
      await loadProjetos()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      toast.error('Erro ao atualizar projeto')
      return { success: false }
    }
  }

  // Atualizar cobrança
  const updateCobranca = async (id: string, updates: Partial<Cobranca>) => {
    try {
      const { data, error } = await supabase
        .from('cobrancas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      toast.success('Cobrança atualizada com sucesso!')
      await loadCobrancas()
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar cobrança:', error)
      toast.error('Erro ao atualizar cobrança')
      return { success: false }
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadAgenciaData()
  }, [])

  return {
    // Estados
    categorias,
    servicos,
    contratos,
    projetos,
    cobrancas,
    loading,

    // Funções de carregamento
    loadCategorias,
    loadServicos,
    loadContratos,
    loadProjetos,
    loadCobrancas,
    loadAgenciaData,

    // Funções de criação
    createCategoria,
    createServico,
    createContrato,
    createProjeto,
    createCobranca,

    // Funções de atualização
    updateProjeto,
    updateCobranca
  }
} 