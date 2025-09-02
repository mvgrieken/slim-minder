# 🚀 Snelle Netlify Deployment

## ⚡ Direct Deploy (5 minuten)

### 1. Ga naar Netlify
- Open: https://netlify.com
- Klik op "New site from Git"

### 2. Kies GitHub
- Selecteer GitHub als Git provider
- Kies repository: `mvgrieken/slim-minder`
- Klik "Connect"

### 3. Build Instellingen
```
Build command: echo 'Build completed'
Publish directory: apps/mobile/web-build
```

### 4. Deploy
- Klik "Deploy site"
- Wacht 2-3 minuten
- Je site is live! 🎉

## 🔧 Handmatige Deployment

### Option 1: Netlify CLI
```bash
# Installeer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --dir=apps/mobile/web-build --prod
```

### Option 2: Drag & Drop
1. Ga naar https://netlify.com
2. Sleep de `apps/mobile/web-build` map naar het dashboard
3. Je site wordt automatisch gedeployed

## 📱 Wat wordt gedeployed

- ✅ Statische HTML landing page
- ✅ Responsive design
- ✅ GitHub repository links
- ✅ Feature overzicht
- ✅ Deployment status

## 🔗 URLs

- **GitHub**: https://github.com/mvgrieken/slim-minder
- **Netlify**: Wordt automatisch gegenereerd
- **Lokale API**: http://localhost:4000 (development)

## 🚨 Troubleshooting

### Build Fails
- Controleer Node.js versie (18.19.0)
- Zorg dat `apps/mobile/web-build` bestaat
- Check Netlify logs voor errors

### Site niet bereikbaar
- Wacht 2-3 minuten na deployment
- Controleer Netlify dashboard status
- Verifieer custom domain instellingen

---

**Status**: 🚀 Ready for Deployment
**Tijd**: 5 minuten
**Moeilijkheid**: Eenvoudig
