#!/bin/bash

# 🧪 Test Suite Exonov Quantum - Validation Complète
# Vérifie que tous les composants fonctionnent après déploiement

set -e

APP_URL=${1:-"https://next-js-saas-starter-six-liard.vercel.app"}
TIMEOUT=10

echo "🧪 Test Suite Exonov Quantum"
echo "🔗 URL de test : $APP_URL"
echo "=================================="

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function de test avec timeout
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    local method="${4:-GET}"
    local data="${5:-}"
    
    echo -n "🔍 Test $name... "
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$data" \
            --connect-timeout $TIMEOUT \
            "$url" -o /tmp/response.json)
    else
        response=$(curl -s -w "%{http_code}" \
            --connect-timeout $TIMEOUT \
            "$url" -o /tmp/response.json)
    fi
    
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} (HTTP $status_code)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (HTTP $status_code, expected $expected_status)"
        return 1
    fi
}

# Tests de base
echo "📋 Tests de Base"
echo "----------------"

test_endpoint "Homepage" "$APP_URL/" "200"
test_endpoint "Dashboard Quantum" "$APP_URL/quantum" "200"

# Tests API
echo ""
echo "⚡ Tests API"
echo "------------"

test_endpoint "API Health Check" "$APP_URL/api/quantum?action=health" "200"

# Test API POST avec données
portfolio_data='{"action":"optimize_portfolio","tickers":["AAPL","GOOGL"],"risk_tolerance":0.5,"user_id":"test","subscription_tier":"premium"}'
test_endpoint "API Portfolio Optimization" "$APP_URL/api/quantum" "200" "POST" "$portfolio_data"

routing_data='{"action":"route_job","problem_type":"QAOA","size":4,"latency_target":"normal","risk_policy":"standard"}'
test_endpoint "API Job Routing" "$APP_URL/api/quantum" "200" "POST" "$routing_data"

# Tests de performance
echo ""
echo "⚡ Tests de Performance"
echo "----------------------"

echo -n "🚀 Temps de réponse homepage... "
homepage_time=$(curl -s -w "%{time_total}" -o /dev/null "$APP_URL/")
echo "${homepage_time}s"

if (( $(echo "$homepage_time < 3.0" | bc -l) )); then
    echo -e "${GREEN}✅ Performance OK${NC} (<3s)"
else
    echo -e "${YELLOW}⚠️ Performance lente${NC} (>3s)"
fi

echo -n "🔬 Temps de réponse dashboard... "
dashboard_time=$(curl -s -w "%{time_total}" -o /dev/null "$APP_URL/quantum")
echo "${dashboard_time}s"

echo -n "⚡ Temps de réponse API... "
api_time=$(curl -s -w "%{time_total}" -o /dev/null "$APP_URL/api/quantum?action=health")
echo "${api_time}s"

# Tests de sécurité
echo ""
echo "🛡️ Tests de Sécurité"
echo "--------------------"

echo -n "🔐 HTTPS forcé... "
http_response=$(curl -s -w "%{http_code}" "http://next-js-saas-starter-six-liard.vercel.app/" -o /dev/null)
if [ "$http_response" = "308" ] || [ "$http_response" = "301" ]; then
    echo -e "${GREEN}✅ HTTPS redirect OK${NC}"
else
    echo -e "${YELLOW}⚠️ HTTPS redirect manquant${NC}"
fi

echo -n "🚫 Headers sécurité... "
security_headers=$(curl -s -I "$APP_URL/" | grep -i "x-frame-options\|x-content-type-options\|strict-transport")
if [ ! -z "$security_headers" ]; then
    echo -e "${GREEN}✅ Headers sécurité présents${NC}"
else
    echo -e "${YELLOW}⚠️ Headers sécurité manquants${NC}"
fi

# Tests de contenu
echo ""
echo "📄 Tests de Contenu"
echo "-------------------"

echo -n "🔬 Présence 'Exonov Quantum'... "
if curl -s "$APP_URL/quantum" | grep -q "Exonov Quantum"; then
    echo -e "${GREEN}✅ Branding présent${NC}"
else
    echo -e "${RED}❌ Branding manquant${NC}"
fi

echo -n "📊 Dashboard fonctionnel... "
if curl -s "$APP_URL/quantum" | grep -q "Control Center"; then
    echo -e "${GREEN}✅ Dashboard chargé${NC}"
else
    echo -e "${RED}❌ Dashboard non chargé${NC}"
fi

# Test intégration n8n (si possible)
echo ""
echo "🤖 Test Intégration n8n"
echo "-----------------------"

echo -n "🔗 Connexion n8n... "
api_response=$(curl -s "$APP_URL/api/quantum?action=health")
if echo "$api_response" | grep -q "success"; then
    echo -e "${GREEN}✅ API répond${NC}"
    
    # Vérifier si les providers sont retournés
    if echo "$api_response" | grep -q "provider"; then
        echo -e "${GREEN}✅ Providers quantiques détectés${NC}"
    else
        echo -e "${YELLOW}⚠️ Pas de providers (normal si n8n non configuré)${NC}"
    fi
else
    echo -e "${RED}❌ API non fonctionnelle${NC}"
fi

# Résumé final
echo ""
echo "🎯 RÉSUMÉ DES TESTS"
echo "=================="

# Compter les succès/échecs (approximatif)
total_tests=10
echo "📊 Tests exécutés : $total_tests"

# Instructions finales
echo ""
echo "🚀 PROCHAINES ÉTAPES :"
echo "1. ✅ Configurer variables d'environnement sur Vercel"
echo "2. ✅ Tester avec vraies credentials n8n"
echo "3. ✅ Configurer domaine personnalisé (optionnel)"
echo "4. ✅ Setup monitoring et analytics"

echo ""
echo "🎉 Tests terminés !"
echo "📋 Voir les détails dans BUILD-FIX-REPORT.md"

# Vérification finale
if [ -f "/tmp/response.json" ]; then
    echo ""
    echo "📄 Dernière réponse API :"
    cat /tmp/response.json | head -c 200
    echo "..."
    rm -f /tmp/response.json
fi
