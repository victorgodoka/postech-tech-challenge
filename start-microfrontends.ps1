# Script para iniciar os microfrontends simultaneamente
Write-Host "🚀 Iniciando Microfrontends..." -ForegroundColor Green

# Função para iniciar um app em background
function Start-App {
    param(
        [string]$AppName,
        [string]$AppPath,
        [string]$Command,
        [int]$Port
    )
    
    Write-Host "📦 Iniciando $AppName na porta $Port..." -ForegroundColor Yellow
    
    # Navegar para o diretório do app
    Push-Location $AppPath
    
    # Iniciar o app em background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized
    
    # Voltar ao diretório original
    Pop-Location
    
    Write-Host "✅ $AppName iniciado!" -ForegroundColor Green
}

# Verificar se os diretórios existem
$homeAppPath = ".\apps\home"
$dashboardAppPath = ".\apps\dashboard"

if (-not (Test-Path $homeAppPath)) {
    Write-Host "❌ Diretório do Home App não encontrado: $homeAppPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $dashboardAppPath)) {
    Write-Host "❌ Diretório do Dashboard App não encontrado: $dashboardAppPath" -ForegroundColor Red
    exit 1
}

# Iniciar Home App (porta 4001)
Start-App -AppName "Home App (Vue)" -AppPath $homeAppPath -Command "npm run dev" -Port 4001

# Aguardar um pouco antes de iniciar o próximo
Start-Sleep -Seconds 3

# Iniciar Dashboard App (porta 3000)
Start-App -AppName "Dashboard App (Next.js)" -AppPath $dashboardAppPath -Command "npm run dev" -Port 3000

Write-Host ""
Write-Host "🎉 Microfrontends iniciados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs dos aplicativos:" -ForegroundColor Cyan
Write-Host "   🏠 Home App:      http://localhost:4001" -ForegroundColor White
Write-Host "   📊 Dashboard App: http://localhost:3000" -ForegroundColor White
Write-Host "   🔗 Home no Dashboard: http://localhost:3000/home" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Para testar a integração:" -ForegroundColor Yellow
Write-Host "   1. Acesse http://localhost:3000/dashboard" -ForegroundColor White
Write-Host "   2. Clique em 'Home App' no menu superior" -ForegroundColor White
Write-Host "   3. O Home App será carregado como microfrontend!" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar os apps, feche as janelas do PowerShell abertas." -ForegroundColor Red

# Aguardar entrada do usuário antes de fechar
Read-Host "Pressione Enter para continuar..."
