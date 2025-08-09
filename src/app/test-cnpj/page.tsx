'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CNPJInput } from '@/components/ui/cnpj-input'
import { InlineAddressEdit } from '@/components/ui/inline-address-edit'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function TestCNPJPage() {
  const [cnpj, setCnpj] = useState('')
  const [endereco, setEndereco] = useState<any>({})
  const [dadosRecebidos, setDadosRecebidos] = useState<any>(null)
  const [camposAplicados, setCamposAplicados] = useState<string[]>([])
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const handleCNPJDataLoaded = (data: any) => {
    addLog('Dados recebidos da BrasilAPI')
    console.log('Dados recebidos da BrasilAPI:', data)
    setDadosRecebidos(data)
    
    const aplicados: string[] = []
    
    // Atualizar endereço automaticamente
    if (data.logradouro || data.municipio || data.uf || data.cep) {
      const enderecoFormatado = {
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        estado: data.uf || '',
        cep: data.cep || ''
      }
      addLog(`Endereço formatado: ${JSON.stringify(enderecoFormatado)}`)
      console.log('Endereço formatado:', enderecoFormatado)
      setEndereco(enderecoFormatado)
      aplicados.push('Endereço')
    } else {
      addLog('Nenhum dado de endereço encontrado')
    }
    
    // Simular aplicação de outros campos
    if (data.razao_social) {
      aplicados.push('Razão Social')
      addLog(`Razão Social: ${data.razao_social}`)
    }
    if (data.nome_fantasia) {
      aplicados.push('Nome Fantasia')
      addLog(`Nome Fantasia: ${data.nome_fantasia}`)
    }
    if (data.email) {
      aplicados.push('Email')
      addLog(`Email: ${data.email}`)
    }
    
    // Telefone pode vir em diferentes campos
    const telefone = data.ddd_telefone_1 || data.telefone
    if (telefone) {
      aplicados.push('Telefone')
      addLog(`Telefone: ${telefone}`)
    }
    
    setCamposAplicados(aplicados)
    addLog(`Total de campos aplicados: ${aplicados.length}`)
  }

  const handleEnderecoChange = async (novoEndereco: any) => {
    addLog(`Endereço atualizado: ${JSON.stringify(novoEndereco)}`)
    console.log('Endereço atualizado:', novoEndereco)
    setEndereco(novoEndereco)
  }

  const limparDados = () => {
    setCnpj('')
    setEndereco({})
    setDadosRecebidos(null)
    setCamposAplicados([])
    setLogs([])
    addLog('Dados limpos')
  }

  const testarCNPJ = () => {
    // CNPJ de teste da Receita Federal
    setCnpj('00.000.000/0001-91')
    addLog('CNPJ de teste definido: 00.000.000/0001-91')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Teste de Busca CNPJ</h1>
          <div className="flex space-x-2">
            <Button onClick={testarCNPJ} variant="outline">
              Testar CNPJ
            </Button>
            <Button onClick={limparDados} variant="outline">
              Limpar Dados
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Busca de CNPJ</CardTitle>
              </CardHeader>
              <CardContent>
                <CNPJInput
                  value={cnpj}
                  onChange={setCnpj}
                  onDataLoaded={handleCNPJDataLoaded}
                  placeholder="Digite um CNPJ válido"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent>
                <InlineAddressEdit
                  endereco={endereco}
                  onSave={handleEnderecoChange}
                />
              </CardContent>
            </Card>

            {camposAplicados.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campos Aplicados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {camposAplicados.map((campo, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{campo}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {dadosRecebidos && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Recebidos da Receita Federal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Razão Social</label>
                        <p className="text-sm font-medium">{dadosRecebidos.razao_social || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Nome Fantasia</label>
                        <p className="text-sm font-medium">{dadosRecebidos.nome_fantasia || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <p className="text-sm font-medium">{dadosRecebidos.email || 'Não informado'}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Telefone</label>
                        <p className="text-sm font-medium">{dadosRecebidos.ddd_telefone_1 || dadosRecebidos.telefone || 'Não informado'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-500">Endereço Completo</label>
                      <div className="text-sm space-y-1 mt-1">
                        <p><strong>Logradouro:</strong> {dadosRecebidos.logradouro || 'Não informado'}</p>
                        <p><strong>Número:</strong> {dadosRecebidos.numero || 'Não informado'}</p>
                        <p><strong>Complemento:</strong> {dadosRecebidos.complemento || 'Não informado'}</p>
                        <p><strong>Bairro:</strong> {dadosRecebidos.bairro || 'Não informado'}</p>
                        <p><strong>Cidade:</strong> {dadosRecebidos.municipio || 'Não informado'}</p>
                        <p><strong>Estado:</strong> {dadosRecebidos.uf || 'Não informado'}</p>
                        <p><strong>CEP:</strong> {dadosRecebidos.cep || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Logs de Execução</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="text-xs text-gray-600 font-mono">
                      {log}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
