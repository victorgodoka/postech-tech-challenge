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

# 🏦 Postech Tech Challenge - Banking Dashboard

> **Sistema Completo de Gerenciamento Financeiro com Arquitetura de Microfrontends**

[![Next.js](https://img.shields.io/badge/Next.js-15.2+-black?logo=next.js)](https://nextjs.org)
[![Vue.js](https://img.shields.io/badge/Vue.js-3+-green?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?logo=typescript)](https://typescriptlang.org)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0+-purple?logo=redux)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-teal?logo=tailwindcss)](https://tailwindcss.com)
[![IndexedDB](https://img.shields.io/badge/IndexedDB-Persistent-orange)](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)

### 🎯 Requisitos Técnicos

#### ✅ **Funcionalidades Core**

- **Dashboard Financeiro**: Home page com gráficos interativos (Chart.js) e KPIs
- **Gestão de Transações**: CRUD completo com filtros avançados e busca inteligente
- **Upload de Anexos**: Sistema de upload de recibos/documentos com preview e drag & drop
- **Metas Financeiras**: Widget personalizado com tracking de progresso e alertas
- **Autenticação**: Sistema de login/logout com sessão compartilhada via IndexedDB
- **População Automática**: Dados realistas gerados automaticamente após login
- **Exportação**: CSV, JSON e impressão de transações

#### ✅ **Stack Tecnológica**

- **Arquitetura de Microfrontends**: Aplicações independentes com comunicação via IndexedDB
- **TypeScript**: Tipagem estática completa com interfaces robustas
- **Redux Toolkit**: Gerenciamento de estado centralizado para o Dashboard
- **Vue.js Composition API**: Gerenciamento reativo de estado para o Home
- **IndexedDB**: Persistência local robusta utilizando a biblioteca `idb`
- **Chart.js**: Visualizações interativas e responsivas de dados financeiros
- **Tailwind CSS v4**: Sistema de design unificado e modular
- **Vercel**: Plataforma de deploy com integração contínua
- **Acessibilidade**: Interface responsiva

## 🏗️ Arquitetura Técnica

### 📦 Estrutura do Projeto

```
postech-tech-challenge/
├── apps/
│   ├── dashboard/                    # 🏠 Dashboard Principal (Next.js)
│   │   ├── src/
│   │   │   ├── components/          # Componentes React
│   │   │   ├── hooks/               # Custom hooks
│   │   │   ├── lib/                 # Utilitários e serviços
│   │   │   ├── pages/               # Páginas Next.js
│   │   │   ├── store/               # Redux store
│   │   │   └── utils/               # Funções auxiliares
│   │   ├── public/                  # Assets estáticos
│   │   └── package.json             # Dependências
│   └── home/                        # 🌐 Landing Page (Vue.js)
│       ├── src/
│       │   ├── components/          # Componentes Vue
│       │   ├── composables/         # Composition API
│       │   ├── lib/                 # Serviços e DB
│       │   └── router/              # Vue Router
│       └── package.json             # Dependências
├── package.json                     # Workspace root
└── README.md                        # Documentação
```

## 🚀 Como Executar

### **Pré-requisitos**

- Node.js 18+ (LTS recomendado)
- npm ou yarn para gerenciamento de dependências
- Git para controle de versão

### **Instalação e Execução**

```bash
# Instalar dependências do workspace
npm install

# Executar ambas as aplicações simultaneamente
npm run dev

# Execução individual (opcional):
# Terminal 1 - Home App (Vue.js)
cd apps/home && npm run dev

# Terminal 2 - Dashboard (Next.js)
cd apps/dashboard && npm run dev
```

### **URLs de Acesso**

- **Home App (Vue.js)**: http://localhost:4001
- **Dashboard (Next.js)**: http://localhost:3000
- **Produção Home**: https://home.victorgodoka.com.br
- **Produção Dashboard**: https://dashboard.victorgodoka.com.br

## 🎮 Utilização do Sistema

### **Fluxo de Autenticação**

1. Acesse a aplicação Home em `localhost:4001`
2. Realize o cadastro ou autenticação através do formulário
3. O sistema efetuará o redirecionamento automático para o Dashboard
4. Os dados serão populados automaticamente após a autenticação

### **Funcionalidades do Dashboard**

- **Página Inicial**: Visualização de gráficos, indicadores e metas financeiras
- **Gestão de Transações**: Interface completa para gerenciamento financeiro
- **Sistema de Filtros**: Mecanismos avançados de busca e filtragem
- **Upload de Documentos**: Anexação de comprovantes e recibos

### **Recursos Implementados**

- **Operações CRUD**: Criação, edição e exclusão de transações com validação robusta
- **Sistema de Filtros**: Filtragem por data, categoria, tipo (receitas/despesas) e valor
- **Busca Contextual**: Mecanismo de busca em tempo real por descrição
- **Gerenciamento de Anexos**: Upload de documentos com interface drag & drop e preview
- **Planejamento Financeiro**: Configuração de metas com acompanhamento de progresso
- **Visualização de Dados**: Gráficos interativos utilizando Chart.js
- **Exportação de Dados**: Funcionalidades de export em CSV, JSON e impressão
- **População Automática**: Geração de dados de demonstração dos últimos 90 dias
- **Autenticação Unificada**: Sessão compartilhada entre os microfrontends

## 🧪 Validação e Qualidade

### **Protocolo de Testes Funcionais**

1. **Cadastro de Usuário**: Validação do processo de registro no Home App
2. **Autenticação**: Verificação do redirecionamento automático para o Dashboard
3. **Inicialização de Dados**: Validação da população automática (countdown de 3 segundos)
4. **Operações CRUD**: Teste das funcionalidades de criação, edição e exclusão
5. **Sistema de Filtros**: Validação dos filtros por tipo, data e categoria
6. **Upload de Documentos**: Teste da funcionalidade de anexação com drag & drop
7. **Gestão de Metas**: Validação da configuração e acompanhamento de objetivos
8. **Exportação**: Teste das funcionalidades de export (CSV, JSON, impressão)
9. **Persistência de Sessão**: Verificação do compartilhamento entre aplicações

### **Scripts de Build e Desenvolvimento**

```bash
# Execução do ambiente de desenvolvimento
npm run dev

# Análise de código e formatação
npm run lint
npm run format

# Build para ambiente de produção
npm run build
```

## 📱 Demonstração

### **Fluxo de Demonstração**

1. **Registro**: Criar nova conta no Home App
2. **Login**: Autenticação automática
3. **Dashboard**: Visualizar dados populados automaticamente
4. **Transações**: CRUD completo com filtros
5. **Upload**: Anexar documentos
6. **Metas**: Configurar objetivos financeiros

## 🌐 Deploy em Produção

### **URLs de Produção**

- **Home**: https://home.victorgodoka.com.br
- **Dashboard**: https://dashboard.victorgodoka.com.br

### **Arquitetura de Deploy**

- **Plataforma de Hospedagem**: Vercel com integração contínua
- **Pipeline CI/CD**: Automatização via GitHub Actions
- **Gestão de Domínios**: Configuração independente por aplicação
- **Variáveis de Ambiente**: Gerenciamento centralizado na plataforma

## 🏆 Aspectos Técnicos Relevantes

### **Arquitetura de Software**

- **Microfrontends**: Implementação de aplicações independentes com comunicação inter-aplicacional
- **Persistência de Sessão**: Utilização do IndexedDB para compartilhamento entre domínios
- **Tipagem Estática**: Implementação integral em TypeScript para segurança de tipos
- **Sistema de Design**: Componentes modulares e reutilizáveis

### **Experiência do Usuário**

- **Design Responsivo**: Abordagem mobile-first com adaptação multiplataforma
- **Estados de Interface**: Feedback visual consistente durante operações asíncronas
- **Tratamento de Erros**: Implementação robusta de error boundaries e validações

## 📚 Documentação Adicional

## 🌐 Estratégia de Deploy

### **Arquitetura de Deploy Independente**

Cada microfrontend é deployado independentemente em sua própria URL:

- **Dashboard (Next.js)**: https://dashboard.victorgodoka.com.br
- **Home (Vue.js)**: https://home.victorgodoka.com.br

### **Vantagens da Abordagem**

- **Independência**: Deploy separado de cada app
- **Escalabilidade**: Recursos dedicados por aplicação
- **Confiabilidade**: Falha de um app não afeta outros
- **Performance**: CDN otimizado por framework

## ⚙️ Configurações de Deploy

### **Dashboard - Vercel (Next.js)**

```json
// apps/dashboard/vercel.json
{
  "version": 2,
  "name": "postech-tech-challenge-dashboard",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_HOME_URL": "https://home.victorgodoka.com.br",
    "NEXT_PUBLIC_DASHBOARD_URL": "https://dashboard.victorgodoka.com.br"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

### **Home - Vercel (Vue.js)**

```json
// apps/home/vercel.json
{
  "version": 2,
  "name": "postech-home",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_DASHBOARD_URL": "https://dashboard.victorgodoka.com.br",
    "VITE_HOME_URL": "https://home.victorgodoka.com.br"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

## 🔧 Variáveis de Ambiente

### **Dashboard (.env.local)**

```bash
# URLs dos microfrontends
NEXT_PUBLIC_HOME_URL=https://home.victorgodoka.com.br
NEXT_PUBLIC_DASHBOARD_URL=https://dashboard.victorgodoka.com.br

# Configurações de build
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Analytics (opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### **Home (.env)**

```bash
# URLs dos microfrontends
VITE_DASHBOARD_URL=https://dashboard.victorgodoka.com.br
VITE_HOME_URL=https://home.victorgodoka.com.br

# Configurações de build
NODE_ENV=production
VITE_BUILD_TARGET=production
```

# 🏗️ Arquitetura

## 📐 Visão Geral da Arquitetura

Este projeto implementa uma arquitetura de **microfrontends simples** com duas aplicações independentes que compartilham dados via **IndexedDB**.

### 🎯 Princípios Implementados

1. **Apps Independentes**: Dashboard (Next.js) + Home (Vue.js)
2. **Comunicação via IndexedDB**: Banco compartilhado `bank-app`
3. **Sessão Compartilhada**: Via localStorage + IndexedDB
4. **Deploy Separado**: URLs independentes na Vercel

## 🏢 Estrutura dos Microfrontends

### **Dashboard App (Next.js) - Host**

```typescript
apps/dashboard/
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/               # Custom hooks (useAuth)
│   ├── lib/                 # db.ts, api.ts, populate.ts, sessionService.ts
│   ├── pages/               # Pages Router Next.js
│   ├── store/               # Redux Toolkit (auth, transactions, accounts)
│   ├── utils/               # Funções auxiliares
│   └── context/             # AuthContext (não usado atualmente)
├── public/                  # Assets
├── package.json
└── next.config.js
```

**Tecnologias Reais:**

- **Next.js 15.2+**: Pages Router
- **Redux Toolkit**: Estado centralizado
- **TypeScript**: 100% tipado
- **Tailwind CSS v4**: Styling
- **IndexedDB**: Persistência via `idb` library

### **Home App (Vue.js) - Remote**

```typescript
apps/home/
├── src/
│   ├── components/          # Componentes Vue
│   ├── composables/         # useAuth.ts
│   ├── lib/                 # db.ts, api.ts, sessionService.ts
│   ├── router/              # Vue Router
│   └── views/               # Pages Vue
├── package.json
└── vite.config.ts
```

**Tecnologias Reais:**

- **Vue.js 3+**: Composition API
- **Vite**: Build tool
- **TypeScript**: Com `<script setup lang="ts">`
- **Tailwind CSS**: Styling
- **IndexedDB**: Mesmo banco do Dashboard

## 🔄 Comunicação Entre Apps

### **1. IndexedDB Compartilhado**

```typescript
// lib/db.ts (mesmo em ambos os apps)
export const getDB = async (): Promise<IDBPDatabase<BankAppDB>> => {
  return openDB<BankAppDB>('bank-app', 4, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // Users store
      if (!db.objectStoreNames.contains('users')) {
        const usersStore = db.createObjectStore('users', { keyPath: 'id' })
        usersStore.createIndex('email', 'email', { unique: true })
      }

      // Sessions store (v4 - para comunicação)
      if (oldVersion < 4 && !db.objectStoreNames.contains('sessions')) {
        const sessionsStore = db.createObjectStore('sessions', {
          keyPath: 'id'
        })
        sessionsStore.createIndex('userId', 'userId')
        sessionsStore.createIndex('expiresAt', 'expiresAt')
      }

      // Transactions, accounts, attachments, financial-goals...
    }
  })
}
```

### **2. Sessão Compartilhada**

```typescript
// Home App - composables/useAuth.ts
export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials: LoginCredentials) => {
    const session = await authenticateUser(credentials)
    user.value = session.user

    // Salvar no IndexedDB E localStorage
    await saveSessionToIDB(session)
    localStorage.setItem('bank-app-session', JSON.stringify(session))
  }
}

// Dashboard App - store/slices/authSlice.ts
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Verificar IndexedDB primeiro
      const sessionFromIDB = await getActiveSessionFromIDB()
      if (sessionFromIDB) {
        localStorage.setItem('bank-app-session', JSON.stringify(sessionFromIDB))
        return sessionFromIDB
      }

      // Fallback para localStorage
      const sessionFromLS = localStorage.getItem('bank-app-session')
      if (sessionFromLS) {
        const session = JSON.parse(sessionFromLS)
        if (new Date(session.expiresAt) > new Date()) {
          return session
        }
      }

      return null
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)
```

## 🗄️ Gerenciamento de Estado

### **Redux Toolkit (Dashboard)**

```typescript
// store/index.ts
export const store = configureStore({
  reducer: {
    auth: authSlice,
    transactions: transactionSlice,
    accounts: accountSlice
  }
  // Sem middleware customizado complexo
})

// store/slices/authSlice.ts
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    session: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    user: null,
    token: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout: state => {
      state.user = null
      state.isAuthenticated = false
      state.session = null
    }
  },
  extraReducers: builder => {
    builder.addCase(initializeAuth.fulfilled, (state, action) => {
      if (action.payload) {
        state.user = action.payload
        state.isAuthenticated = true
        state.session = action.payload
      }
    })
  }
})
```

### **Composition API (Vue.js)**

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const initializeAuth = async () => {
    const sessionData = await getActiveSessionFromIDB()
    if (sessionData) {
      user.value = sessionData
      session.value = sessionData
    }
  }

  // Sem EventBus complexo - apenas IndexedDB + localStorage

  return {
    user: readonly(user),
    session: readonly(session),
    isAuthenticated,
    loading: readonly(loading),
    error: readonly(error),
    login,
    register,
    logout,
    initializeAuth
  }
}
```

## 🔄 Fluxo de Dados

### **1. Fluxo de Autenticação Simplificado**

```
1. Home App (Vue.js)
   ↓ Login/Register
2. Salva no IndexedDB ('sessions' store)
   ↓ + localStorage backup
3. Redireciona para Dashboard
   ↓
4. Dashboard (Next.js)
   ↓ initializeAuth()
5. Lê IndexedDB → localStorage
   ↓
6. Usuario autenticado
```

### **2. Fluxo de População de Dados**

```typescript
// Dashboard - pages/index.tsx
useEffect(() => {
  if (!loading && isAuthenticated && !isPopulating) {
    setIsPopulating(true)

    // Countdown 3 segundos
    const timer = setInterval(() => {
      setPopulateCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Popular dados do lib/populate.ts
          populateDB().then(() => {
            setIsPopulating(false)
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
}, [isAuthenticated, loading, isPopulating])
```

## 🏭 Padrões Reais Implementados

### **1. Service Layer Simples**

```typescript
// lib/api.ts (ambos os apps)
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const db = await getDB()
  const hashedPassword = await hashPassword(userData.password)

  const user: User = {
    id: uuid(),
    ...userData,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString()
  }

  await db.add('users', user)
  return user
}

export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<Session> => {
  const db = await getDB()
  const user = await db.getFromIndex('users', 'email', credentials.email)

  if (
    !user ||
    !(await verifyPassword(credentials.password, user.passwordHash))
  ) {
    throw new Error('Credenciais inválidas')
  }

  return createSession(user)
}
```

### **2. Repository Pattern Básico**

```typescript
// Não há classes Repository complexas
// Apenas funções diretas no api.ts:

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const db = await getDB()
  return db.getAll('transactions')
}

export const createTransaction = async (
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> => {
  const db = await getDB()
  const newTransaction = { ...transaction, id: uuid() }
  await db.add('transactions', newTransaction)
  return newTransaction
}
```

## 🔧 Configurações Reais

### **Next.js Configuration**

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Tailwind CSS v4 Alpha
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['@tailwindcss/vite'],
          as: '*.css'
        }
      }
    }
  },

  // Remove console.log em produção
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

### **Vite Configuration**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4001,
    cors: true
  }
})
```

## 🚀 Deploy

### **Estratégia Simples**

- **Dashboard**: Vercel com Next.js
- **Home**: Vercel com Vite
- **URLs Independentes**: Sem Module Federation complexo
- **Comunicação**: Apenas via IndexedDB compartilhado

### **Configurações Vercel**

```json
// apps/dashboard/vercel.json
{
  "version": 2,
  "name": "postech-tech-challenge-dashboard",
  "builds": [{ "src": "package.json", "use": "@vercel/next" }]
}

// apps/home/vercel.json
{
  "version": 2,
  "name": "postech-home",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 🎯 Síntese Técnica

### **Stack Tecnológica Implementada**

- **Camada de Apresentação**: Next.js 15.2+ para Dashboard e Vue.js 3+ para Home
- **Gerenciamento de Estado**: Redux Toolkit integrado com Vue Composition API
- **Persistência de Dados**: IndexedDB utilizando a biblioteca `idb`
- **Sistema de Estilização**: Tailwind CSS v4 com design system unificado
- **Visualização de Dados**: Chart.js para gráficos interativos
- **Gerenciamento de Arquivos**: Sistema completo com interface drag & drop
- **Infraestrutura**: Vercel com URLs independentes por aplicação

### **Recursos Desenvolvidos**

✅ **Arquitetura de Microfrontends**: Aplicações independentes com comunicação via IndexedDB  
✅ **Autenticação Unificada**: Sistema de login compartilhado entre aplicações  
✅ **Operações CRUD**: Gerenciamento completo de transações com validação e filtros  
✅ **Gerenciamento de Documentos**: Upload de anexos com interface drag & drop  
✅ **Planejamento Financeiro**: Sistema de metas com acompanhamento de progresso  
✅ **Visualização Interativa**: Gráficos dinâmicos implementados com Chart.js  
✅ **Inicialização Automática**: Geração de dados de demonstração  
✅ **Funcionalidades de Export**: Exportação em múltiplos formatos  
✅ **Tipagem Estática**: Implementação integral em TypeScript  
✅ **Deploy em Produção**: Aplicações funcionais hospedadas na Vercel

### **Características Técnicas**

🚀 **Arquitetura Modular**: Implementação de microfrontends com deploy independente  
🔄 **Persistência Robusta**: IndexedDB com fallback para localStorage  
⚡ **Otimização de Performance**: Lazy loading e code splitting implementados  
🎨 **Interface Moderna**: Design responsivo utilizando Tailwind CSS v4  
🔒 **Segurança de Dados**: Hashing de senhas e validação de entrada  
📱 **Responsividade**: Abordagem mobile-first com adaptação multiplataforma

---

### **Implementação Técnica:**

- ✅ **Persistência Compartilhada**: IndexedDB como banco principal
- ✅ **Autenticação Unificada**: localStorage com IndexedDB como backup
- ✅ **Gerenciamento de Estado**: Redux para Dashboard, Composition API para Home
- ✅ **Arquitetura Modular**: Componentes reutilizáveis e tipados
- ✅ **Deploy Independente**: Hospedagem separada na Vercel
- ✅ **Tipagem Estática**: TypeScript integral

## 🎯 Considerações Finais

Este projeto demonstra a implementação de uma **arquitetura de microfrontends funcional** para gerenciamento financeiro:

1. **Aplicações Independentes**: Next.js e Vue.js com deploy separado
2. **Comunicação Inter-aplicacional**: IndexedDB como mecanismo de persistência
3. **Autenticação Compartilhada**: Sistema unificado entre aplicações
4. **Infraestrutura Escalável**: Deploy independente com integração contínua
5. **Funcionalidades Completas**: CRUD, visualizações, upload de documentos e planejamento financeiro
