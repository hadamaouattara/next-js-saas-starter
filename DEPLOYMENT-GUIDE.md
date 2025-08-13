# 🚀 GUIDE DE DÉPLOIEMENT EXONOV QUANTUM

## 📋 **Options de Déploiement**

### **🏆 OPTION 1 : Vercel (RECOMMANDÉ) - Déploiement en 1 clic**

Vercel est la plateforme native pour Next.js, créée par l'équipe Next.js. C'est la solution la plus simple et rapide.

#### **Étapes :**

1. **Aller sur Vercel** : https://vercel.com
2. **Se connecter avec GitHub** (même compte que ton repo)
3. **Import Project** → Sélectionner `hadamaouattara/next-js-saas-starter`
4. **Configurer les variables d'environnement** (voir ci-dessous)
5. **Deploy** → Attendre 2-3 minutes ⚡

#### **Variables d'environnement à configurer sur Vercel :**
```env
# n8n Integration (OBLIGATOIRE)
N8N_BASE_URL=https://exonov-u39090.vm.elestio.app
N8N_API_KEY=ton-api-key-n8n
N8N_WEBHOOK_SECRET=ton-webhook-secret

# Database (OBLIGATOIRE)
POSTGRES_URL=postgres://user:pass@host:5432/db
AUTH_SECRET=ton-super-secret-auth-key

# Stripe (pour les subscriptions)
STRIPE_SECRET_KEY=sk_live_ton-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_ton-webhook-secret

# Quantum Providers (OPTIONNEL)
IBM_QUANTUM_TOKEN=ton-ibm-token
AWS_ACCESS_KEY_ID=ton-aws-key
AWS_SECRET_ACCESS_KEY=ton-aws-secret
AZURE_SUBSCRIPTION_ID=ton-azure-id
GOOGLE_QUANTUM_API_KEY=ton-google-key
```

### **🐳 OPTION 2 : Docker (pour VPS/serveur dédié)**

Si tu préfères héberger sur ton propre serveur ou VPS.

#### **Dockerfile :**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start application
CMD ["pnpm", "start"]
```

#### **Commandes de déploiement :**
```bash
# Build l'image Docker
docker build -t exonov-quantum .

# Run le container
docker run -d \
  --name exonov-quantum \
  -p 3000:3000 \
  --env-file .env.production \
  exonov-quantum
```

### **☁️ OPTION 3 : Autres plateformes**

- **Netlify** : Compatible avec App Router
- **Railway** : Simple et avec base de données incluse
- **DigitalOcean App Platform** : Scaling automatique
- **AWS Amplify** : Intégration AWS native

## 🎯 **DÉPLOIEMENT RECOMMANDÉ : VERCEL**

### **🔥 Pourquoi Vercel ?**
- ✅ **Optimisé pour Next.js** - Performance maximale
- ✅ **Deploy en 1 clic** - Connexion GitHub automatique
- ✅ **Edge functions** - API routes ultra-rapides
- ✅ **Preview deployments** - Test automatique des PRs
- ✅ **Analytics inclus** - Monitoring intégré
- ✅ **SSL automatique** - HTTPS par défaut
- ✅ **CDN global** - Latence minimale mondiale

### **📊 Performance attendue :**
- **Build time** : ~2-3 minutes
- **Deploy time** : ~30 secondes
- **Cold start** : <100ms
- **API response** : <200ms (avec n8n)

## 🔧 **Post-Déploiement : Configuration**

### **1. URL de production :**
Une fois déployé, tu auras une URL comme :
```
https://exonov-quantum-xyz.vercel.app
```

### **2. Configuration n8n webhook :**
Mettre à jour tes workflows n8n avec la nouvelle URL :
```
# Ancien
https://localhost:3000/api/quantum

# Nouveau  
https://exonov-quantum-xyz.vercel.app/api/quantum
```

### **3. Tests post-déploiement :**
- ✅ Accéder à `/quantum` → Dashboard visible
- ✅ Test API `/api/quantum?action=health` → Status OK
- ✅ Vérifier connexion n8n → Workflows actifs
- ✅ Test optimization portfolio → Résultats QAOA

### **4. Domaine personnalisé (optionnel) :**
- Configurer `quantum.exonov.com` sur Vercel
- Mettre à jour DNS chez ton registrar
- SSL automatique via Vercel

## 🎯 **DÉPLOIEMENT IMMÉDIAT - 3 ÉTAPES**

### **Étape 1 : Préparer les credentials (2 minutes)**
```bash
# Récupérer ton API key n8n
curl -H "Authorization: Bearer TON_API_KEY" \
     https://exonov-u39090.vm.elestio.app/rest/workflows

# Si ça marche, ton API key est bon ✅
```

### **Étape 2 : Déployer sur Vercel (3 minutes)**
1. Aller sur https://vercel.com
2. **New Project** → Import depuis GitHub
3. Sélectionner `next-js-saas-starter`
4. Ajouter les variables d'environnement
5. **Deploy** 🚀

### **Étape 3 : Tester l'intégration (2 minutes)**
```bash
# Test health check
curl https://ton-app.vercel.app/api/quantum?action=health

# Si retour JSON avec providers, c'est OK ✅
```

## 📱 **Monitoring & Analytics**

### **Vercel Analytics (gratuit)**
- Real-time visitors
- Performance metrics
- Error tracking
- Web vitals

### **n8n Monitoring**
- Workflow executions
- Success/failure rates
- Performance metrics
- Error logs

## 🛡️ **Sécurité Production**

### **Variables d'environnement sécurisées**
- ✅ Jamais commiter les .env
- ✅ Utiliser les secrets Vercel
- ✅ Rotation régulière des API keys
- ✅ HTTPS obligatoire

### **Rate limiting**
```typescript
// Déjà configuré dans quantum API
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Max 100 requêtes par IP
};
```

## 🎉 **RÉSULTAT FINAL**

Après déploiement, tu auras :
- ✅ **URL de production** : `https://ton-app.vercel.app`
- ✅ **Dashboard quantique** : `https://ton-app.vercel.app/quantum`
- ✅ **API intégrée** : `https://ton-app.vercel.app/api/quantum`
- ✅ **n8n connecté** : Workflows fonctionnels
- ✅ **SSL automatique** : Sécurité maximale
- ✅ **Performance optimale** : Edge functions
- ✅ **Monitoring** : Analytics intégrés

---

## 🚀 **PRÊT À DÉPLOYER ?**

Choisis ton option :
1. **⚡ Vercel (1 clic)** - Le plus simple
2. **🐳 Docker** - Plus de contrôle  
3. **☁️ Autre plateforme** - Selon tes préférences

**Recommandation** : Commence par Vercel pour la rapidité, tu pourras migrer plus tard si besoin !

---

*Guide de déploiement Exonov Quantum - Prêt pour la production !* 🎯
