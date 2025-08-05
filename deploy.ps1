# Deploy Script para Vercel - Postech Tech Challenge
# Execute: .\deploy.ps1

Write-Host "🚀 Iniciando deploy dos microfrontends..." -ForegroundColor Green

# Verificar se Vercel CLI está instalado
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI não encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel
}

# Deploy Dashboard
Write-Host "📊 Fazendo deploy do Dashboard (Next.js)..." -ForegroundColor Blue
Set-Location "apps/dashboard"
vercel --prod --name "postech-dashboard"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dashboard deployado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no deploy do Dashboard" -ForegroundColor Red
    exit 1
}

# Voltar para raiz
Set-Location "../.."

# Deploy Home
Write-Host "🏠 Fazendo deploy do Home (Vue.js)..." -ForegroundColor Blue
Set-Location "apps/home"
vercel --prod --name "postech-home"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Home deployado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro no deploy do Home" -ForegroundColor Red
    exit 1
}

# Voltar para raiz
Set-Location "../.."

Write-Host "🎉 Deploy completo!" -ForegroundColor Green
Write-Host "📊 Dashboard: https://postech-dashboard.vercel.app" -ForegroundColor Cyan
Write-Host "🏠 Home: https://postech-home.vercel.app" -ForegroundColor Cyan
Write-Host "" 
Write-Host "⚠️  Não esqueça de configurar as variáveis de ambiente no Vercel Dashboard!" -ForegroundColor Yellow
