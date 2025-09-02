# 🚀 Slim Minder Deployment Handleiding

## 📍 GitHub Repository
- **URL**: https://github.com/mvgrieken/slim-minder
- **Status**: ✅ Actief en up-to-date

## 🌐 Netlify Deployment

### Automatische Deployment
De app wordt automatisch gedeployed naar Netlify via GitHub integratie.

### Handmatige Deployment
1. Ga naar [Netlify](https://netlify.com)
2. Klik op "New site from Git"
3. Kies GitHub en selecteer `mvgrieken/slim-minder`
4. Build instellingen:
   - **Build command**: `echo 'Build completed'`
   - **Publish directory**: `apps/mobile/web-build`
   - **Node version**: 18

### Environment Variables
Voeg deze environment variables toe in Netlify:
```
NODE_VERSION=18
```

## 📱 App Functionaliteiten

### ✅ Wat Werkt:
- **API Server**: Volledig werkende backend op poort 4000
- **Mobile App**: React Native app met Supabase authenticatie
- **Web Interface**: Responsive web design
- **Database**: Supabase PostgreSQL integratie
- **Authentication**: Login/registratie systeem
- **Real-time Data**: Live updates van API

### 🔗 Endpoints:
- **Health**: `/health`
- **Transactions**: `/api/transactions`
- **Budgets**: `/api/budgets`
- **Goals**: `/api/goals`
- **Bank**: `/api/bank/accounts`
- **AI Chat**: `/api/ai/chat`

## 🛠️ Lokale Development

### API Server Starten:
```bash
cd apps/api
npm run dev
```

### Mobile App Starten:
```bash
cd apps/mobile
npm run start
```

### Alle Services Starten:
```bash
npm run dev:all
```

## 📊 Deployment Status

- **GitHub**: ✅ Gedeployed
- **Netlify**: 🚀 Klaar voor deployment
- **API Server**: ✅ Werkend (localhost:4000)
- **Mobile App**: ✅ Werkend (localhost:8081)

## 🔧 Troubleshooting

### Build Errors:
- Installeer ontbrekende dependencies: `npm install`
- Controleer Node.js versie: `node --version`
- Clear cache: `npm run clean`

### API Server Issues:
- Controleer poort 4000: `lsof -i :4000`
- Restart server: `pkill -f "tsx" && npm run dev:api`

### Mobile App Issues:
- Controleer poort 8081: `lsof -i :8081`
- Restart app: `pkill -f "expo" && npm run start`

## 📞 Support

Voor vragen of problemen:
1. Check de GitHub issues
2. Controleer de logs
3. Neem contact op via GitHub

---

**Status**: 🚀 Ready for Production Deployment
**Last Updated**: 2025-09-02
**Version**: 1.0.0
