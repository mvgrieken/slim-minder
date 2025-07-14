# Slim Minder - Deployment Guide

Deze gids helpt je om Slim Minder te deployen met GitHub, Vercel en Supabase.

## 🚀 Stap-voor-stap Deployment

### 1. GitHub Repository Setup

#### a) Initialiseer Git Repository
```bash
# In je project directory
git init
git add .
git commit -m "Initial commit: Slim Minder MVP setup"
```

#### b) Maak GitHub Repository
1. Ga naar https://github.com/new
2. Repository naam: `slim-minder-web`
3. Beschrijving: `Slim Minder - Dutch fintech platform for debt prevention and financial coaching`
4. Selecteer **Private** (voor nu)
5. Klik **Create repository**

#### c) Connect Local Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/slim-minder-web.git
git branch -M main
git push -u origin main
```

### 2. Supabase Project Setup

#### a) Maak Supabase Account
1. Ga naar https://supabase.com
2. Sign up/Login met GitHub account
3. Klik **New Project**

#### b) Project Configuratie
- **Organization**: Selecteer of maak nieuwe
- **Project name**: `slim-minder-production`
- **Database password**: Genereer sterke wachtwoord (bewaar veilig!)
- **Region**: Europe (West) - voor GDPR compliance
- **Pricing plan**: Start met Free tier

#### c) Database Setup
1. Wacht tot project is aangemaakt (2-3 minuten)
2. Ga naar **SQL Editor**
3. Maak nieuwe query
4. Kopieer en plak inhoud van `supabase/schema.sql`
5. Klik **Run** om database schema aan te maken

#### d) API Keys ophalen
1. Ga naar **Settings** → **API**
2. Kopieer:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (alleen voor server-side)

### 3. Environment Variables Setup

#### a) Lokale Ontwikkeling
1. Kopieer `environment-template.txt` naar `.env.local`
```bash
cp environment-template.txt .env.local
```

2. Vul je Supabase credentials in:
```bash
# .env.local
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
REACT_APP_JWT_SECRET=your-jwt-secret-here
REACT_APP_API_BASE_URL=https://your-project-id.supabase.co/rest/v1
REACT_APP_ENVIRONMENT=development
```

### 4. Vercel Deployment

#### a) Vercel Account
1. Ga naar https://vercel.com
2. Sign up met je GitHub account
3. Autoriseer Vercel toegang tot GitHub

#### b) Project Importeren
1. Klik **New Project**
2. Selecteer je `slim-minder-web` repository
3. **Framework Preset**: Create React App
4. **Root Directory**: `./` (default)
5. Klik **Deploy**

#### c) Environment Variables in Vercel
1. Ga naar **Settings** → **Environment Variables**
2. Voeg toe (voor alle environments):

```
REACT_APP_SUPABASE_URL = https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY = your-anon-key-here
REACT_APP_JWT_SECRET = your-jwt-secret-here
REACT_APP_API_BASE_URL = https://your-project-id.supabase.co/rest/v1
REACT_APP_ENVIRONMENT = production
```

#### d) Custom Domain (Optioneel)
1. Ga naar **Settings** → **Domains**
2. Voeg je custom domain toe
3. Update DNS records volgens Vercel instructies

### 5. CI/CD Pipeline

De deployment is nu automatisch:
- **Push naar `main`** → Automatische deployment naar productie
- **Pull requests** → Preview deployments
- **Builds falen?** → Check Vercel logs in dashboard

### 6. Database Management

#### a) Production Data
```sql
-- Voeg test gebruikers toe (via Supabase Dashboard → Authentication)
-- Voeg test categorieën toe (gebeurt automatisch via schema.sql)
-- Monitor performance via Database → Logs
```

#### b) Backups
- Supabase maakt automatisch backups
- Voor extra zekerheid: **Settings** → **Database** → **Backups**

### 7. Monitoring & Analytics

#### a) Supabase Monitoring
- **Reports** → Real-time API calls
- **Logs** → Database queries en errors
- **Auth** → User registraties en logins

#### b) Vercel Analytics
- **Analytics** tab → Performance metrics
- **Functions** → Serverless function logs
- **Speed Insights** → Core Web Vitals

### 8. Security Checklist

#### a) Supabase Security
- ✅ Row Level Security (RLS) enabled
- ✅ API keys configured correctly
- ✅ Database in EU region (GDPR)
- ✅ Regular security updates

#### b) Vercel Security
- ✅ HTTPS enforced
- ✅ Security headers configured
- ✅ Environment variables encrypted
- ✅ No sensitive data in client-side code

### 9. Testing Deployment

#### a) Functionele Tests
```bash
# Lokaal testen voor deployment
npm run build
npm run start

# Check of alle environment variables werken
# Test authentication flow
# Verify database connections
```

#### b) Performance Tests
- Check Lighthouse scores
- Test mobile responsiveness
- Verify loading speeds

### 10. Go Live Checklist

- [ ] Domain gekoppeld en werkend
- [ ] SSL certificaat actief
- [ ] Database schema toegepast
- [ ] Test gebruiker kan registreren/inloggen
- [ ] Alle environment variables correct
- [ ] Monitoring dashboards opgezet
- [ ] Backup strategie geïmplementeerd
- [ ] Error tracking werkend
- [ ] GDPR compliance gecheckt

## 🔧 Troubleshooting

### Veelvoorkomende Issues

#### Build Fails
```bash
# Check TypeScript errors
npm run type-check

# Check for missing dependencies
npm install

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

#### Supabase Connection Issues
- Controleer API keys in environment variables
- Verify CORS settings in Supabase dashboard
- Check database permissions (RLS policies)

#### Vercel Deployment Issues
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure all dependencies in package.json

## 📞 Support

Voor deployment issues:
1. Check Vercel/Supabase documentatie
2. Supabase Discord community
3. GitHub Issues in dit project

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor Supabase usage limits
- Check Vercel analytics
- Review error logs weekly
- Database performance monitoring

### Backup Strategy
- Supabase automatic backups (7 days retention)
- Manual exports before major updates
- Code backup via Git
- Environment variables backup securely stored 