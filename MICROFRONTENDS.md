# 🚀 Configuração de Microfrontends

Este projeto implementa uma arquitetura de microfrontends usando **Module Federation** para conectar o **Home App (Vue 3)** com o **Dashboard App (Next.js)**.

## 📋 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Module Federation                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────┐    │
│  │   Dashboard     │  ────►  │      Home App           │    │
│  │   (Next.js)     │         │      (Vue 3)            │    │
│  │   Host          │         │      Remote             │    │
│  │   Port: 3000    │         │      Port: 4001         │    │
│  └─────────────────┘         └─────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Configuração

### Home App (Remote - Vue 3)
- **Framework**: Vite + Vue 3
- **Plugin**: `@originjs/vite-plugin-federation`
- **Porta**: 4001
- **Expõe**: 
  - `./App` - Componente principal Vue
  - `./router` - Router Vue

### Dashboard App (Host - Next.js)
- **Framework**: Next.js 14
- **Plugin**: `@module-federation/nextjs-mf`
- **Porta**: 3000
- **Consome**: Home App remoto

## 🚀 Como Executar

### Opção 1: Script Automático (Recomendado)

**Windows (PowerShell):**
```powershell
.\start-microfrontends.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x start-microfrontends.sh
./start-microfrontends.sh
```

### Opção 2: Manual

**1. Iniciar Home App:**
```bash
cd apps/home
npm run dev
# Rodará na porta 4001
```

**2. Iniciar Dashboard App:**
```bash
cd apps/dashboard
npm run dev
# Rodará na porta 3000
```

## 🌐 URLs de Acesso

| Aplicativo | URL | Descrição |
|------------|-----|-----------|
| **Home App** | http://localhost:4001 | App Vue standalone |
| **Dashboard** | http://localhost:3000 | App Next.js standalone |
| **Home no Dashboard** | http://localhost:3000/home | Home App como microfrontend |
| **Dashboard Principal** | http://localhost:3000/dashboard | Dashboard com link para Home |

## 🔗 Navegação

1. Acesse o Dashboard: `http://localhost:3000/dashboard`
2. No menu superior, clique em **"Home App"**
3. O Home App será carregado dinamicamente como microfrontend
4. Use **"Dashboard"** para voltar ao dashboard principal

## 🛠️ Configurações Técnicas

### Module Federation - Home App (vite.config.ts)
```typescript
federation({
  name: 'home',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.vue',
    './router': './src/router/index.ts',
  },
  shared: {
    vue: { singleton: true },
    'vue-router': { singleton: true },
  },
})
```

### Module Federation - Dashboard (next.config.js)
```javascript
new NextFederationPlugin({
  name: 'dashboard',
  filename: 'static/chunks/remoteEntry.js',
  remotes: {
    home: `home@http://localhost:4001/assets/remoteEntry.js`,
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

## 🔄 Compartilhamento de Estado

### Autenticação Compartilhada
- **IndexedDB**: Database `bank-app` compartilhado
- **LocalStorage**: Session `bank-app-session` compartilhada
- **Compatibilidade**: Login no Home funciona no Dashboard

### Dados Compartilhados
- **Usuários**: Criados no Home, acessíveis no Dashboard
- **Transações**: Populadas automaticamente
- **Conta**: ID fixo para compatibilidade

## 🧪 Testando a Integração

### Fluxo de Teste Completo:

1. **Registrar no Home:**
   - Acesse `http://localhost:4001`
   - Registre um novo usuário
   - Faça login

2. **Verificar no Dashboard:**
   - Acesse `http://localhost:3000/dashboard`
   - Usuário deve estar logado automaticamente
   - Dados devem estar sincronizados

3. **Testar Microfrontend:**
   - No Dashboard, clique em "Home App"
   - Home App carrega como microfrontend
   - Estado de autenticação mantido

## 🐛 Troubleshooting

### Erro: "Cannot find module 'home/App'"
- ✅ Verifique se o Home App está rodando na porta 4001
- ✅ Confirme que o `remoteEntry.js` está acessível
- ✅ Verifique a URL: `http://localhost:4001/assets/remoteEntry.js`

### Erro: "Home App não carrega"
- ✅ Verifique se ambos os apps estão rodando
- ✅ Confirme as portas (Home: 4001, Dashboard: 3000)
- ✅ Verifique o console do navegador para erros CORS

### Erro: "Session não compartilhada"
- ✅ Verifique se ambos usam a mesma chave: `bank-app-session`
- ✅ Confirme que o IndexedDB tem o nome: `bank-app`
- ✅ Verifique se a versão do DB é a mesma (3)

## 📦 Dependências

### Home App
```json
{
  "@originjs/vite-plugin-federation": "^1.3.5",
  "vue": "^3.4.0",
  "vue-router": "^4.2.0"
}
```

### Dashboard App
```json
{
  "@module-federation/nextjs-mf": "^8.0.0",
  "next": "^14.0.0",
  "react": "^18.0.0"
}
```

## 🎯 Próximos Passos

- [ ] Implementar roteamento avançado entre apps
- [ ] Adicionar shared state management (Pinia/Redux)
- [ ] Configurar build para produção
- [ ] Implementar lazy loading de componentes
- [ ] Adicionar testes de integração
- [ ] Configurar CI/CD para microfrontends

---

## 🚀 **Resultado Final**

✅ **Home App** roda independentemente na porta 4001  
✅ **Dashboard App** roda independentemente na porta 3000  
✅ **Home App** é carregado como microfrontend no Dashboard  
✅ **Autenticação** compartilhada entre os apps  
✅ **Dados** sincronizados via IndexedDB  
✅ **Navegação** fluida entre microfrontends  

A arquitetura permite desenvolvimento independente de cada app mantendo a integração e compartilhamento de estado!
