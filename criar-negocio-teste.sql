-- Script para criar um negócio de teste no banco de dados
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos verificar os usuários disponíveis
SELECT id, nome, email, empresa_id FROM public.usuarios ORDER BY nome;

-- Verificar os pipelines disponíveis
SELECT id, nome FROM public.pipelines ORDER BY nome;

-- Verificar os clientes disponíveis
SELECT id, nome_fant, razao_social, tipo FROM public.clientes ORDER BY nome_fant;

-- Verificar as etapas do pipeline
SELECT id, nome, pipeline_id FROM public.pipeline_etapas ORDER BY pipeline_id, ordem;

-- Verificar a empresa_id do primeiro usuário
SELECT empresa_id FROM public.usuarios WHERE empresa_id IS NOT NULL LIMIT 1;

-- Inserir um negócio de teste com empresa_id correto
INSERT INTO public.negocios (
  titulo,
  descricao,
  cliente_id,
  pipeline_id,
  etapa_id,
  valor,
  probabilidade,
  prioridade,
  responsavel_id,
  proximo_contato,
  data_fechamento,
  empresa_id,
  created_at,
  updated_at
) VALUES (
  'Negócio de Teste',
  'Este é um negócio criado para teste do sistema',
  NULL, -- cliente_id opcional
  (SELECT id FROM public.pipelines LIMIT 1), -- primeiro pipeline disponível
  (SELECT id FROM public.pipeline_etapas WHERE pipeline_id = (SELECT id FROM public.pipelines LIMIT 1) ORDER BY ordem LIMIT 1), -- primeira etapa do pipeline
  50000.00, -- valor de teste
  75, -- probabilidade
  'alta', -- prioridade
  (SELECT id FROM public.usuarios LIMIT 1), -- primeiro usuário disponível
  '2024-01-15', -- próximo contato
  '2024-02-15', -- data de fechamento
  (SELECT empresa_id FROM public.usuarios WHERE empresa_id IS NOT NULL LIMIT 1), -- empresa_id do primeiro usuário que tenha empresa_id
  NOW(),
  NOW()
);

-- Verificar se o negócio foi criado
SELECT 
  n.id,
  n.titulo,
  n.descricao,
  n.valor,
  n.probabilidade,
  n.prioridade,
  n.proximo_contato,
  n.data_fechamento,
  n.empresa_id,
  c.nome_fant as cliente_nome,
  p.nome as pipeline_nome,
  pe.nome as etapa_nome,
  u.nome as responsavel_nome
FROM public.negocios n
LEFT JOIN public.clientes c ON n.cliente_id = c.id
LEFT JOIN public.pipelines p ON n.pipeline_id = p.id
LEFT JOIN public.pipeline_etapas pe ON n.etapa_id = pe.id
LEFT JOIN public.usuarios u ON n.responsavel_id = u.id
WHERE n.titulo = 'Negócio de Teste'
ORDER BY n.created_at DESC
LIMIT 1;
