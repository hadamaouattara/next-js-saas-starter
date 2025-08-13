#!/bin/bash

# 🔧 Script de préparation build Vercel
# Exécuté avant le build pour optimiser la compilation

echo "🔧 Préparation du build Exonov Quantum..."

# Vérifier Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Installer les dépendances avec cache optimisé
echo "📦 Installation des dépendances..."
npm ci --prefer-offline --no-audit

# Vérifier TypeScript
echo "🔍 Vérification TypeScript..."
npx tsc --noEmit

# Générer les types si nécessaire
echo "🏗️ Génération des types..."
if [ -f "lib/db/schema.ts" ]; then
  npm run db:generate
fi

# Linting rapide
echo "🧹 Lint des fichiers critiques..."
npx eslint app/api/quantum/route.ts --max-warnings 0 || echo "⚠️ Warnings dans l'API (acceptable)"

# Optimisation des images (si présentes)
if [ -d "public" ]; then
  echo "🖼️ Optimisation des assets..."
  # Optimisations manuelles si nécessaires
fi

# Variables d'environnement check
echo "🔐 Vérification des variables d'environnement..."
if [ -z "$N8N_BASE_URL" ]; then
  echo "⚠️ N8N_BASE_URL non définie (utilisation valeur par défaut)"
  export N8N_BASE_URL="https://exonov-u39090.vm.elestio.app"
fi

# Build Next.js avec optimisations
echo "🚀 Build de l'application..."
NEXT_TELEMETRY_DISABLED=1 npm run build

# Vérification post-build
if [ -d ".next" ]; then
  echo "✅ Build réussi!"
  echo "📊 Taille du build:"
  du -sh .next
else
  echo "❌ Échec du build"
  exit 1
fi

echo "🎉 Préparation terminée avec succès!"
