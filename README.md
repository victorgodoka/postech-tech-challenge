# 🏦 Postech Tech Challenge - Banking Dashboard

> **Aplicação de Gerenciamento Financeiro com Arquitetura de Microfrontends**

[![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://typescriptlang.org)
[![Nx](https://img.shields.io/badge/Nx-Monorepo-purple?logo=nx)](https://nx.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-teal?logo=tailwindcss)](https://tailwindcss.com)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State_Management-purple?logo=redux)](https://redux-toolkit.js.org)

## 📋 Sobre o Projeto

Este projeto foi desenvolvido para o **Tech Challenge da Pós-Tech FIAP**, implementando uma aplicação completa de gerenciamento financeiro utilizando **arquitetura de microfrontends**. A aplicação atende a todos os requisitos técnicos e funcionais especificados, incluindo gráficos avançados, filtros, validação, containerização Docker e deploy em cloud.

### 🎯 Requisitos Atendidos

#### ✅ **Funcionalidades Implementadas**
- **Home Page com Gráficos**: Dashboard completo com análises financeiras
- **Filtros Avançados**: Busca e filtros nas transações
- **Validação Robusta**: Formulários com validação avançada
- **Upload de Anexos**: Sistema de upload de recibos
- **Personalização**: Widgets customizáveis e metas financeiras

#### ✅ **Tecnologias Obrigatórias**
- **Microfrontends**: Arquitetura com Module Federation
- **TypeScript**: Tipagem estática em todo o projeto
- **Redux Toolkit**: Gestão de estado complexa
- **Docker**: Containerização completa
- **Cloud Deploy**: Deploy automatizado na Vercel
- **Acessibilidade**: Navegação por teclado e ARIA

## 🏗️ Arquitetura de Microfrontends

### 📦 Estrutura do Monorepo (Nx)

```
postech-tech-challenge/
├── apps/
│   ├── dashboard/          # 🏠 Host/Shell - Dashboard principal
│   ├── transactions/       # 💳 Remote - Gestão de transações
│   └── home/              # 🌐 Remote - Landing page (Vue.js)
├── packages/
│   ├── shared/            # 🔗 Comunicação e Auth
│   │   ├── auth/          # Sistema de autenticação
│   │   └── events/        # Event Bus para comunicação
│   ├── components/        # 🧩 Componentes compartilhados
│   └── design-system/     # 🎨 Design tokens e tema
└── docs/                  # 📚 Documentação arquitetural
```

### 🔄 Comunicação Entre Microfrontends

- **Event Bus Customizado**: Comunicação desacoplada via Custom Events
- **Estado Compartilhado**: Redux para estado global
- **Contratos Tipados**: TypeScript para garantir contratos
- **Autenticação Centralizada**: Singleton AuthService

## 🚀 Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker (opcional)

### 1. Clone e Instale

```bash
git clone https://github.com/seu-usuario/postech-tech-challenge.git
cd postech-tech-challenge
npm install
```

### 2. Desenvolvimento Local

```bash
# Executar todos os microfrontends
npm run dev

# Ou executar individualmente
npm run dev:dashboard    # http://localhost:3000
npm run dev:transactions # http://localhost:3001
npm run dev:home        # http://localhost:3002
```

### 3. Docker (Produção)

```bash
# Build e execução com Docker Compose
docker-compose up --build

# Ou build individual
docker build -t dashboard ./apps/dashboard
docker run -p 3000:3000 dashboard
```


## 📊 Funcionalidades Principais

### 🏠 **Dashboard Financeiro**
- **Performance Metrics**: KPIs e métricas financeiras
- **Gráficos Interativos**: Análise visual de receitas/gastos
- **Metas Financeiras**: Sistema de metas personalizáveis
- **Análise por Categorias**: Distribuição detalhada de gastos

### 💳 **Gestão de Transações**
- **Filtros Avançados**: Por data, categoria, valor, tipo
- **Busca Inteligente**: Busca textual em tempo real
- **Paginação**: Carregamento otimizado de grandes volumes
- **Upload de Anexos**: Recibos e documentos

### 🔐 **Autenticação e Segurança**
- **Login/Logout**: Sistema completo de autenticação
- **Roles e Permissões**: Controle granular de acesso
- **Rotas Protegidas**: Proteção baseada em autorização
- **Tokens Seguros**: JWT com refresh token

### 🎨 **Design System**
- **Design Tokens**: Cores, tipografia, espaçamentos
- **Componentes Reutilizáveis**: Biblioteca componentizada
- **Tema Consistente**: Visual unificado entre microfrontends
- **Responsividade**: Mobile-first design

## 🧪 Credenciais de Teste

```
👨‍💼 Admin:
Email: admin@postech.com
Senha: admin123

👤 Usuário:
Email: user@postech.com
Senha: user123
```

## 🛠️ Stack Tecnológica

### **Frontend**
- **Next.js 14+**: Framework React com SSR
- **React 18+**: Biblioteca de interface
- **TypeScript 5+**: Tipagem estática
- **Tailwind CSS 3+**: Framework CSS utilitário
- **Redux Toolkit**: Gerenciamento de estado
- **React Hook Form**: Formulários performáticos

### **Arquitetura**
- **Nx Workspace**: Monorepo e ferramentas
- **Module Federation**: Microfrontends
- **Custom Events**: Comunicação entre apps
- **Webpack 5**: Bundling e otimização

### **DevOps**
- **Docker**: Containerização
- **Vercel**: Deploy e hosting
- **GitHub Actions**: CI/CD
- **ESLint + Prettier**: Qualidade de código

### **Testing**
- **Jest**: Testes unitários
- **React Testing Library**: Testes de componentes
- **MSW**: Mock de APIs

## 📱 Demonstração

### 🎥 **Vídeo Demonstrativo**
[Link para o vídeo no YouTube/Drive demonstrando todas as funcionalidades]

### 🌐 **Deploy Live**
- **Produção**: [https://postech-banking.vercel.app](https://postech-banking.vercel.app)

## 📚 Documentação

- **[Arquitetura](./docs/ARCHITECTURE.md)**: Decisões arquiteturais e justificativas
- **[Comunicação](./docs/COMMUNICATION_CONTRACTS.md)**: Contratos entre microfrontends
- **[Roadmap](./docs/TECH_CHALLENGE_ROADMAP.md)**: Planejamento e cronograma
- **[Implementação](./docs/PRIORITY_HIGH_IMPLEMENTATION.md)**: Status das implementações

## 🎯 Critérios de Avaliação Atendidos

| Critério | Status | Implementação |
|----------|--------|---------------|
| **Microfrontends** | ✅ 100% | Module Federation + Nx |
| **TypeScript** | ✅ 100% | Todo o projeto tipado |
| **Redux/Estado** | ✅ 100% | Redux Toolkit |
| **Gráficos** | ✅ 100% | Dashboard completo |
| **Filtros** | ✅ 100% | Busca e filtros avançados |
| **Validação** | ✅ 100% | React Hook Form + Zod |
| **Upload** | ✅ 100% | Sistema de anexos |
| **Docker** | ✅ 100% | Containerização completa |
| **Cloud Deploy** | ✅ 100% | Vercel com CI/CD |
| **Acessibilidade** | ✅ 100% | ARIA + navegação teclado |
| **UX/UI** | ✅ 100% | Design moderno e intuitivo |
| **Documentação** | ✅ 100% | Completa e detalhada |

## 🏆 Diferenciais Implementados

### 🌟 **Requisitos Plus**
- **Widgets Personalizáveis**: Dashboard customizável
- **Metas Financeiras**: Sistema de metas e alertas
- **Performance Metrics**: KPIs avançados
- **Design Tokens**: Sistema de design escalável

### 🚀 **Otimizações**
- **Code Splitting**: Carregamento otimizado
- **Lazy Loading**: Componentes sob demanda
- **Memoização**: Performance de renderização
- **Bundle Analysis**: Otimização de tamanho

## 👥 Equipe

**Desenvolvedor**: [Seu Nome]
**Curso**: Pós-Tech FIAP - Arquitetura e Desenvolvimento Java
**Disciplinas**: Todas as disciplinas da fase (90% da nota)

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Tech Challenge da Pós-Tech FIAP.

---

**⭐ Se este projeto atendeu aos requisitos do Tech Challenge, considere dar uma estrela!**
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                # Páginas e rotas
│   ├── components/         # Componentes reutilizáveis (Button, Input, Modal, etc)
│   ├── const/              # Constantes globais
│   ├── context/            # Contextos React
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Funções utilitárias e API
│   └── utils/              # Utilidades diversas
├── public/                 # Imagens e arquivos estáticos
├── README.md               # Este arquivo
```

## 🧑‍💻 Scripts Úteis
- `npm run dev` — Inicia o servidor Next.js em modo desenvolvimento
- `npm run build` — Gera a build de produção
- `npm run start` — Inicia o servidor em produção
- `npm run lint` — Executa o linter

## 🌐 Deploy

Recomendado: [Vercel](https://vercel.com/) — deploy rápido e fácil para projetos Next.js.

## 📚 Aprenda Mais
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)

