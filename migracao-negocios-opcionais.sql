-- Migração para tornar campos opcionais na tabela negocios
-- Execute este script no SQL Editor do Supabase

-- Alterar cliente_id para permitir NULL
ALTER TABLE public.negocios 
ALTER COLUMN cliente_id DROP NOT NULL;

-- Alterar etapa_id para permitir NULL
ALTER TABLE public.negocios 
ALTER COLUMN etapa_id DROP NOT NULL;

-- Alterar valor para permitir NULL (já que o usuário quer que seja opcional)
ALTER TABLE public.negocios 
ALTER COLUMN valor DROP NOT NULL;

-- Comentários sobre as alterações
COMMENT ON COLUMN public.negocios.cliente_id IS 'ID do cliente (opcional)';
COMMENT ON COLUMN public.negocios.etapa_id IS 'ID da etapa do pipeline (opcional)';
COMMENT ON COLUMN public.negocios.valor IS 'Valor do negócio (opcional)';

-- =====================================================
-- POLÍTICAS RLS PARA NEGÓCIOS
-- =====================================================

-- Política para visualizar negócios da empresa
CREATE POLICY "Users can view empresa negocios" ON public.negocios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.empresa_id = negocios.empresa_id AND u.id = auth.uid()
        )
    );

-- Política para inserir negócios na empresa
CREATE POLICY "Users can insert empresa negocios" ON public.negocios
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.empresa_id = negocios.empresa_id AND u.id = auth.uid()
        )
    );

-- Política para atualizar negócios da empresa
CREATE POLICY "Users can update empresa negocios" ON public.negocios
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.empresa_id = negocios.empresa_id AND u.id = auth.uid()
        )
    );

-- Política para deletar negócios da empresa
CREATE POLICY "Users can delete empresa negocios" ON public.negocios
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.empresa_id = negocios.empresa_id AND u.id = auth.uid()
        )
    );

-- =====================================================
-- FUNÇÃO PARA DEFINIR EMPRESA_ID AUTOMATICAMENTE
-- =====================================================

-- Função para obter o empresa_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT empresa_id 
        FROM public.usuarios 
        WHERE id = auth.uid() 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para definir empresa_id automaticamente
CREATE OR REPLACE FUNCTION public.handle_negocio_empresa()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.empresa_id IS NULL THEN
        NEW.empresa_id := public.get_user_empresa_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger para negócios
DROP TRIGGER IF EXISTS on_negocio_empresa ON public.negocios;
CREATE TRIGGER on_negocio_empresa
    BEFORE INSERT ON public.negocios
    FOR EACH ROW EXECUTE FUNCTION public.handle_negocio_empresa();
