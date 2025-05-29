# 💸 Postech Tech Challenge

Este é um projeto desenvolvido com [Next.js](https://nextjs.org) e Tailwind CSS, criado para o desafio técnico da Pós-Tech! 🚀

## ✨ Visão Geral

Uma aplicação bancária moderna, responsiva e fácil de usar, com recursos como:
- Cadastro e login de usuários 👤
- Dashboard de transações 💳
- Visualização de saldo e extrato 📊
- Criação, edição e remoção de transações 💰
- Componentes reutilizáveis e design system próprio 🎨
- Testes de componentes com Storybook 📚

## 🚀 Começando

Clone o repositório e instale as dependências:

```bash
npm install
# ou
yarn install
```

### Rodando o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação rodando.

### Rodando o Storybook

Veja e teste todos os componentes isoladamente:

```bash
npm run storybook
# ou
yarn storybook
```

Acesse [http://localhost:6006](http://localhost:6006) para visualizar o Storybook.

## 🛠️ Principais Tecnologias
- [Next.js](https://nextjs.org) 14+
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
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
├── .storybook/             # Configuração do Storybook
├── README.md               # Este arquivo
```

## 🧑‍💻 Scripts Úteis
- `npm run dev` — Inicia o servidor Next.js em modo desenvolvimento
- `npm run build` — Gera a build de produção
- `npm run start` — Inicia o servidor em produção
- `npm run storybook` — Inicia o Storybook
- `npm run lint` — Executa o linter

## 🌐 Deploy

Recomendado: [Vercel](https://vercel.com/) — deploy rápido e fácil para projetos Next.js.

## 📚 Aprenda Mais
- [Documentação Next.js](https://nextjs.org/docs)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Storybook](https://storybook.js.org/docs/react/get-started/introduction)

