export interface EmailFolder {
  name: string
  unreadCount: number
  icon: string
}

export interface Email {
  id: string
  from: string
  to: string
  subject: string
  preview: string
  isRead: boolean
  date: Date
  folder: string
}

export interface EmailContent {
  id: string
  from: string
  to: string
  subject: string
  bodyHtml: string
  date: Date
  attachments?: EmailAttachment[]
}

export interface EmailAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

// Mock data functions
export const getEmailFolders = (): Promise<EmailFolder[]> => {
  return Promise.resolve([
    { name: 'entrada', unreadCount: 5, icon: 'Inbox' },
    { name: 'enviados', unreadCount: 0, icon: 'Send' },
    { name: 'rascunhos', unreadCount: 2, icon: 'FileText' },
    { name: 'lixeira', unreadCount: 0, icon: 'Trash' },
  ])
}

export const getEmailsInFolder = (folder: string): Promise<Email[]> => {
  const mockEmails: Email[] = [
    {
      id: '1',
      from: 'contato@empresa.com',
      to: 'usuario@nexus.com',
      subject: 'Proposta Comercial - Site E-commerce',
      preview: 'Gostaríamos de apresentar nossa proposta para o desenvolvimento do site e-commerce...',
      isRead: false,
      date: new Date('2024-01-15T10:30:00'),
      folder: 'entrada'
    },
    {
      id: '2',
      from: 'financeiro@cliente.com',
      to: 'usuario@nexus.com',
      subject: 'Pagamento Aprovado - Fatura #1234',
      preview: 'Confirmamos o recebimento do pagamento referente à fatura #1234...',
      isRead: true,
      date: new Date('2024-01-14T15:45:00'),
      folder: 'entrada'
    },
    {
      id: '3',
      from: 'suporte@nexus.com',
      to: 'usuario@nexus.com',
      subject: 'Atualização do Sistema - Nova Funcionalidade',
      preview: 'Informamos que uma nova funcionalidade foi adicionada ao sistema...',
      isRead: false,
      date: new Date('2024-01-13T09:15:00'),
      folder: 'entrada'
    },
    {
      id: '4',
      from: 'marketing@parceiro.com',
      to: 'usuario@nexus.com',
      subject: 'Parceria Comercial - Oportunidade',
      preview: 'Temos uma excelente oportunidade de parceria comercial...',
      isRead: false,
      date: new Date('2024-01-12T14:20:00'),
      folder: 'entrada'
    },
    {
      id: '5',
      from: 'rh@empresa.com',
      to: 'usuario@nexus.com',
      subject: 'Convite para Entrevista',
      preview: 'Gostaríamos de convidá-lo para uma entrevista...',
      isRead: true,
      date: new Date('2024-01-11T11:00:00'),
      folder: 'entrada'
    }
  ]

  return Promise.resolve(mockEmails.filter(email => email.folder === folder))
}

export const getEmailContent = (id: string): Promise<EmailContent> => {
  const mockContent: EmailContent = {
    id,
    from: 'contato@empresa.com',
    to: 'usuario@nexus.com',
    subject: 'Proposta Comercial - Site E-commerce',
    bodyHtml: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Proposta Comercial</h2>
        <p>Prezado(a) Cliente,</p>
        <p>Gostaríamos de apresentar nossa proposta para o desenvolvimento do site e-commerce para sua empresa.</p>
        <h3>Serviços Inclusos:</h3>
        <ul>
          <li>Design responsivo e moderno</li>
          <li>Integração com sistemas de pagamento</li>
          <li>Painel administrativo completo</li>
          <li>SEO otimizado</li>
          <li>Suporte técnico por 6 meses</li>
        </ul>
        <h3>Investimento:</h3>
        <p><strong>R$ 15.000,00</strong> - Pagamento em até 12x</p>
        <p>Aguardamos seu retorno para agendarmos uma reunião e detalharmos melhor a proposta.</p>
        <p>Atenciosamente,<br>Equipe Nexus</p>
      </div>
    `,
    date: new Date('2024-01-15T10:30:00'),
    attachments: [
      {
        id: '1',
        name: 'proposta-comercial.pdf',
        size: 1024000,
        type: 'application/pdf',
        url: '#'
      }
    ]
  }

  return Promise.resolve(mockContent)
}
