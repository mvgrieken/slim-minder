# Deployment Guide - Slim Minder

Complete guide for deploying the Slim Minder Budgetcoach App to production environments.

## Prerequisites

### Required Tools
- **Node.js** >= 18.17
- **Expo CLI**: `npm install -g @expo/cli`
- **EAS CLI**: `npm install -g eas-cli`
- **Apple Developer Account** (for iOS deployment)
- **Google Play Developer Account** (for Android deployment)
- **Supabase Account** (for backend services)

### Environment Setup
- All environment variables configured in `.env`
- Production Supabase project set up
- Push notification certificates/keys ready

## Backend Deployment (Supabase)

### 1. Supabase Project Setup
```bash
# Create Supabase project at supabase.com
# Copy project URL and anon key

# Apply database schema
psql -h YOUR_PROJECT.supabase.co -U postgres -p 5432 -d postgres < supabase/schema.sql

# Set environment variables
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_KEY
```

### 2. Row Level Security (RLS)
- Verify RLS policies are active
- Test data access with different user roles
- Configure storage bucket permissions

### 3. Edge Functions (Future)
```bash
# Deploy AI chat functions
supabase functions deploy ai-chat
supabase functions deploy whisper-transcribe
```

## Mobile App Deployment

### 1. EAS Build Configuration
```bash
# Initialize EAS in project
eas build:configure

# Create eas.json configuration
```

**eas.json example:**
```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 2. iOS Deployment

#### Setup
```bash
# Login to Apple Developer
eas device:create

# Configure app identifiers
eas build:configure
```

#### Build & Submit
```bash
# Production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### App Store Requirements
- **Privacy Policy**: Required for financial app
- **App Description**: Clear explanation of budgeting features  
- **Screenshots**: All device sizes (iPhone, iPad)
- **App Store Categories**: Finance, Lifestyle
- **Age Rating**: 4+ (suitable for all ages)

### 3. Android Deployment

#### Build & Submit
```bash
# Production build
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

#### Play Store Requirements
- **Privacy Policy**: Link in app listing
- **Financial Permissions**: Justify camera/microphone usage
- **Data Safety**: Complete data collection disclosure
- **Target API Level**: Latest Android API

### 4. Web Deployment

#### Build
```bash
# Export web build
npx expo export --platform web
```

#### Hosting Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel --prod
```

**Netlify**
```bash
# Build command: expo export --platform web
# Publish directory: dist
```

**Custom Hosting**
- Upload `dist/` folder to web server
- Configure HTTPS (required for PWA features)
- Set up proper headers for SPA routing

## Environment Variables

### Production `.env`
```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_PRODUCTION_ANON_KEY

# App Configuration
EXPO_PUBLIC_ALLOW_GUEST=false
EXPO_PUBLIC_USE_MOCK_DATA=false
EXPO_PUBLIC_ANALYTICS_ENABLED=true

# AI Services (Server-side only)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Push Notifications
EXPO_PUSH_TOKEN_ENDPOINT=https://exp.host/--/api/v2/push/send

# Security
ENCRYPTION_KEY=your-256-bit-encryption-key
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## CI/CD Pipeline

### GitHub Actions (Recommended)

**.github/workflows/deploy.yml**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: TypeScript check
        run: npm run typecheck
        
      - name: Lint code
        run: npm run lint
        
      - name: Run tests
        run: npm test
        
      - name: Setup EAS
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Build iOS
        run: eas build --platform ios --non-interactive
        
      - name: Build Android  
        run: eas build --platform android --non-interactive
        
      - name: Deploy Web
        run: |
          npx expo export --platform web
          # Deploy to your hosting provider
```

### Environment Secrets
Set these in your CI/CD environment:
- `EXPO_TOKEN`: EAS authentication token
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service key
- `OPENAI_API_KEY`: OpenAI API key
- `ANTHROPIC_API_KEY`: Anthropic API key

## Monitoring & Analytics

### 1. Sentry Setup (Error Tracking)
```bash
npm install sentry-expo

# Add to App.tsx
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});
```

### 2. Analytics (Optional)
```bash
# Firebase Analytics
npm install firebase

# Expo Analytics
npm install expo-analytics-segment
```

### 3. Performance Monitoring
- **Flipper**: React Native debugging
- **Reactotron**: State inspection
- **Expo DevTools**: Build monitoring

## Security Checklist

### Pre-Deployment Security Review
- [ ] All API keys removed from client code
- [ ] Environment variables properly configured
- [ ] HTTPS enforced on all endpoints
- [ ] RLS policies tested and active
- [ ] Input validation implemented (Zod)
- [ ] SQL injection protection verified
- [ ] XSS protection in web views
- [ ] Biometric authentication working
- [ ] Data encryption at rest configured
- [ ] CORS properly configured

### Post-Deployment Monitoring
- [ ] Error rates monitored
- [ ] API response times tracked
- [ ] User authentication flows tested
- [ ] Data sync integrity verified
- [ ] Push notifications working
- [ ] Backup procedures tested

## Rollback Procedures

### Mobile App Rollback
```bash
# Use previous build
eas build:version:set --platform ios
eas build:version:set --platform android

# Emergency: Use Over-the-Air updates
eas update --branch production --message "Rollback to stable version"
```

### Backend Rollback
```bash
# Supabase database migration rollback
supabase migration down

# Restore from backup if needed
```

## Support & Maintenance

### Regular Tasks
- **Weekly**: Check error rates and user feedback
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Performance review and optimization
- **Annually**: Security audit and compliance review

### Emergency Contacts
- **Technical Lead**: [Contact info]
- **DevOps**: [Contact info] 
- **Product Owner**: [Contact info]

### Documentation
- Keep deployment logs
- Document configuration changes
- Maintain incident response procedures
- Update user support documentation

---

**Note**: This guide assumes production deployment. For staging/test environments, adjust configurations accordingly and use appropriate environment variables.