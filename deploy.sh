#!/bin/bash

# 🚀 Script de déploiement automatique Exonov Quantum
# Usage: ./deploy.sh [platform]
# Platforms: vercel, docker, local

set -e

PLATFORM=${1:-vercel}
PROJECT_NAME="exonov-quantum"

echo "🚀 Déploiement d'Exonov Quantum sur: $PLATFORM"

case $PLATFORM in
  "vercel")
    echo "📦 Déploiement Vercel..."
    
    # Vérifier si vercel CLI est installé
    if ! command -v vercel &> /dev/null; then
      echo "📥 Installation de Vercel CLI..."
      npm install -g vercel
    fi
    
    # Créer .vercel/project.json si nécessaire
    mkdir -p .vercel
    if [ ! -f .vercel/project.json ]; then
      echo "⚙️ Configuration du projet Vercel..."
      cat > .vercel/project.json << EOF
{
  "projectId": "",
  "orgId": ""
}
EOF
    fi
    
    # Déploiement
    echo "🚀 Lancement du déploiement..."
    vercel --prod
    
    echo "✅ Déploiement Vercel terminé!"
    echo "🔗 Votre app est disponible sur Vercel"
    ;;
    
  "docker")
    echo "🐳 Déploiement Docker..."
    
    # Build de l'image
    echo "🔨 Build de l'image Docker..."
    docker build -t $PROJECT_NAME .
    
    # Vérifier si un conteneur existe déjà
    if [ $(docker ps -a -q -f name=$PROJECT_NAME) ]; then
      echo "🛑 Arrêt du conteneur existant..."
      docker stop $PROJECT_NAME
      docker rm $PROJECT_NAME
    fi
    
    # Créer le fichier .env.production s'il n'existe pas
    if [ ! -f .env.production ]; then
      echo "⚙️ Création du fichier .env.production..."
      cat > .env.production << EOF
NODE_ENV=production
N8N_BASE_URL=https://exonov-u39090.vm.elestio.app
N8N_API_KEY=your-n8n-api-key
POSTGRES_URL=postgresql://user:password@postgres:5432/exonov_quantum
AUTH_SECRET=your-super-secret-auth-key
EOF
      echo "⚠️  Veuillez modifier .env.production avec vos vraies valeurs"
    fi
    
    # Lancer le conteneur
    echo "🚀 Lancement du conteneur..."
    docker run -d \
      --name $PROJECT_NAME \
      -p 3000:3000 \
      --env-file .env.production \
      $PROJECT_NAME
    
    echo "✅ Déploiement Docker terminé!"
    echo "🔗 App disponible sur http://localhost:3000"
    ;;
    
  "docker-compose")
    echo "🐳 Déploiement Docker Compose..."
    
    # Créer .env s'il n'existe pas
    if [ ! -f .env ]; then
      echo "⚙️ Création du fichier .env..."
      cp .env.example .env
      echo "⚠️  Veuillez modifier .env avec vos vraies valeurs"
      echo "⚠️  Puis relancer: ./deploy.sh docker-compose"
      exit 1
    fi
    
    # Déploiement avec compose
    echo "🚀 Lancement du stack complet..."
    docker-compose up -d --build
    
    echo "✅ Déploiement Docker Compose terminé!"
    echo "🔗 App: http://localhost:3000"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo "🔴 Redis: localhost:6379"
    ;;
    
  "local")
    echo "🏠 Déploiement local..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
      echo "❌ Node.js n'est pas installé"
      exit 1
    fi
    
    # Vérifier pnpm
    if ! command -v pnpm &> /dev/null; then
      echo "📥 Installation de pnpm..."
      npm install -g pnpm
    fi
    
    # Installation des dépendances
    echo "📦 Installation des dépendances..."
    pnpm install
    
    # Créer .env.local s'il n'existe pas
    if [ ! -f .env.local ]; then
      echo "⚙️ Création du fichier .env.local..."
      cp .env.example .env.local
      echo "⚠️  Veuillez modifier .env.local avec vos vraies valeurs"
    fi
    
    # Build et démarrage
    echo "🔨 Build de l'application..."
    pnpm build
    
    echo "🚀 Démarrage en mode production..."
    pnpm start &
    
    echo "✅ Déploiement local terminé!"
    echo "🔗 App disponible sur http://localhost:3000"
    ;;
    
  *)
    echo "❌ Plateforme non supportée: $PLATFORM"
    echo "📖 Plateformes disponibles: vercel, docker, docker-compose, local"
    exit 1
    ;;
esac

echo ""
echo "🎉 Déploiement terminé avec succès!"
echo ""
echo "📋 Prochaines étapes:"
echo "  1. Vérifier que l'app fonctionne"
echo "  2. Tester /quantum pour le dashboard"
echo "  3. Vérifier /api/quantum?action=health"
echo "  4. Configurer les webhooks n8n si nécessaire"
echo ""
echo "📚 Documentation: voir DEPLOYMENT-GUIDE.md"
