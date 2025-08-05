#!/bin/bash

# Script para iniciar os microfrontends simultaneamente
echo "🚀 Iniciando Microfrontends..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Função para iniciar um app
start_app() {
    local app_name=$1
    local app_path=$2
    local port=$3
    
    echo -e "${YELLOW}📦 Iniciando $app_name na porta $port...${NC}"
    
    # Verificar se o diretório existe
    if [ ! -d "$app_path" ]; then
        echo -e "${RED}❌ Diretório não encontrado: $app_path${NC}"
        exit 1
    fi
    
    # Navegar para o diretório e iniciar em background
    cd "$app_path"
    npm run dev &
    cd - > /dev/null
    
    echo -e "${GREEN}✅ $app_name iniciado!${NC}"
}

# Verificar se os diretórios existem
HOME_APP_PATH="./apps/home"
DASHBOARD_APP_PATH="./apps/dashboard"

if [ ! -d "$HOME_APP_PATH" ]; then
    echo -e "${RED}❌ Diretório do Home App não encontrado: $HOME_APP_PATH${NC}"
    exit 1
fi

if [ ! -d "$DASHBOARD_APP_PATH" ]; then
    echo -e "${RED}❌ Diretório do Dashboard App não encontrado: $DASHBOARD_APP_PATH${NC}"
    exit 1
fi

# Iniciar Home App (porta 4001)
start_app "Home App (Vue)" "$HOME_APP_PATH" 4001

# Aguardar um pouco antes de iniciar o próximo
sleep 3

# Iniciar Dashboard App (porta 3000)
start_app "Dashboard App (Next.js)" "$DASHBOARD_APP_PATH" 3000

echo ""
echo -e "${GREEN}🎉 Microfrontends iniciados com sucesso!${NC}"
echo ""
echo -e "${CYAN}📍 URLs dos aplicativos:${NC}"
echo -e "   🏠 Home App:      ${WHITE}http://localhost:4001${NC}"
echo -e "   📊 Dashboard App: ${WHITE}http://localhost:3000${NC}"
echo -e "   🔗 Home no Dashboard: ${WHITE}http://localhost:3000/home${NC}"
echo ""
echo -e "${YELLOW}⚡ Para testar a integração:${NC}"
echo -e "   1. Acesse ${WHITE}http://localhost:3000/dashboard${NC}"
echo -e "   2. Clique em ${WHITE}'Home App'${NC} no menu superior"
echo -e "   3. O Home App será carregado como microfrontend!"
echo ""
echo -e "${RED}🛑 Para parar os apps, pressione Ctrl+C${NC}"

# Aguardar interrupção
wait
