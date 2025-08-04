# 🚀 Build Script - Tech Challenge POSTECH
# Script otimizado para build de produção (PowerShell)

Write-Host "🚀 Iniciando build para produção..." -ForegroundColor Green

# Navegar para o diretório do dashboard
Set-Location "apps\dashboard"

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na instalação de dependências" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Executando lint..." -ForegroundColor Yellow
npm run lint

Write-Host "🏗️ Executando build..." -ForegroundColor Yellow
$env:NODE_ENV = "production"
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
    Write-Host "📁 Arquivos de build disponíveis em: apps\dashboard\.next" -ForegroundColor Cyan
    Write-Host "🎉 Pronto para deploy no Vercel!" -ForegroundColor Green
    Write-Host "💡 Execute: vercel --prod" -ForegroundColor Cyan
} else {
    Write-Host "❌ Erro no build. Verifique os logs acima." -ForegroundColor Red
    exit 1
}

# Voltar ao diretório raiz
Set-Location "..\..\"
