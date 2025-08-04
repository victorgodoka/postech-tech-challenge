#!/bin/bash

# 🚀 Build Script - Tech Challenge POSTECH
# Script otimizado para build de produção

echo "🚀 Iniciando build para produção..."

# Navegar para o diretório do dashboard
cd apps/dashboard

echo "📦 Instalando dependências..."
npm install

echo "🔧 Executando lint..."
npm run lint --fix

echo "🏗️ Executando build..."
NODE_ENV=production npm run build

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos de build disponíveis em: apps/dashboard/.next"

# Verificar se o build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "🎉 Pronto para deploy no Vercel!"
    echo "💡 Execute: vercel --prod"
else
    echo "❌ Erro no build. Verifique os logs acima."
    exit 1
fi
