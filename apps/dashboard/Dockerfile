# Dockerfile para Dashboard App - Tech Challenge
# Multi-stage build para otimização de tamanho

# Estágio 1: Build
FROM node:18-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Copiar código fonte
COPY apps/dashboard ./apps/dashboard
COPY packages ./packages

# Instalar dependências
RUN npm ci --only=production

# Build da aplicação
RUN npm run build:dashboard

# Estágio 2: Runtime
FROM node:18-alpine AS runner

# Instalar dumb-init para gerenciamento de processos
RUN apk add --no-cache dumb-init

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários do builder
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next ./apps/dashboard/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./apps/dashboard/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/package.json ./apps/dashboard/package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Configurar usuário
USER nextjs

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Comando de inicialização
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start", "--prefix", "apps/dashboard"]
