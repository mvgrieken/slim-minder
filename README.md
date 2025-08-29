# Slim Minder - Personal Budget Coach

Een intelligente budget-app die je helpt om gezonder met geld om te gaan door middel van slimme waarschuwingen, categorisering van uitgaven en persoonlijke coaching.

## 🚀 Features

- **Budget Management**: Stel budgetten in per categorie en houd je uitgaven bij
- **Smart Categorization**: Automatische categorisering van transacties
- **AI Coaching**: Persoonlijke adviezen en tips van een AI-coach
- **Bank Integration**: Veilige PSD2-integratie voor automatische transactie-import
- **Push Notifications**: Slimme waarschuwingen bij overschrijdingen
- **Cross-platform**: Werkt op iOS, Android en Web

## 🛠 Tech Stack

- **Frontend**: React Native + Expo
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Supabase Auth
- **Banking**: PSD2 API Integration
- **AI**: OpenAI/Anthropic API
- **Deployment**: Netlify (Web), EAS Build (Mobile)

## 📋 Requirements

- Node.js 18+
- npm 9+
- Expo CLI
- Supabase account
- OpenAI/Anthropic API key (optioneel)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/mvgrieken/slim-minder.git
cd slim-minder
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
# Vul je Supabase en andere API keys in
```

### 3. Database Setup

```bash
npm run db:migrate
npm run db:seed
```

### 4. Start Development

```bash
# Start alle services
npm run dev:all

# Of individueel:
npm run dev:api      # Backend API
npm run dev:mobile   # Mobile app
npm run dev:worker   # Background jobs
```

## 📱 Mobile Development

### iOS
```bash
cd apps/mobile
npm run ios
```

### Android
```bash
cd apps/mobile
npm run android
```

### Web Development
```bash
cd apps/mobile
npm run start:web
```

## 🌐 Web Build & Deployment

### Local Build
```bash
cd apps/mobile
npm run build:web
```

### Local Preview
```bash
cd apps/mobile
npm run preview:web
```

### Netlify Deployment
De app is geconfigureerd voor automatische deployment naar Netlify:

1. **Build Command**: `npm run build:web`
2. **Publish Directory**: `web-build`
3. **Environment Variables**: Configureer in Netlify dashboard

### Build Scripts
- `npm run build:web` - Build voor web deployment
- `npm run preview:web` - Local preview op poort 4173
- `npm run start:web` - Development server

## 🐳 Docker Development

### Start Local Stack
```bash
docker-compose up -d
```

### Services
- **PostgreSQL**: Database op poort 5432
- **Redis**: Cache op poort 6379
- **API**: Backend op poort 3000
- **Worker**: Background jobs
- **Prisma Studio**: Database GUI op poort 5555
- **MailHog**: Email testing op poort 8025

## 🧪 Testing

```bash
# Run all tests
npm test

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Budgets
- `GET /budgets` - List user budgets
- `POST /budgets` - Create new budget
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget

### Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Categories
- `GET /categories` - List categories
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## 🔒 Security

- **Rate Limiting**: API endpoints zijn beschermd tegen abuse
- **CORS**: Configureerd voor veilige cross-origin requests
- **Helmet**: Security headers voor web deployment
- **Input Validation**: Zod schema validation
- **Authentication**: JWT tokens via Supabase

## 📈 Monitoring

### Health Checks
- Database connectivity
- External API status
- Memory usage
- Uptime monitoring

### Logging
- Structured logging met Morgan
- Error tracking
- Performance monitoring

## 🤝 Contributing

1. Fork de repository
2. Maak een feature branch: `git checkout -b feature/amazing-feature`
3. Commit je changes: `git commit -m 'Add amazing feature'`
4. Push naar de branch: `git push origin feature/amazing-feature`
5. Open een Pull Request

## 📄 License

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/mvgrieken/slim-minder/issues)
- **Documentation**: [Wiki](https://github.com/mvgrieken/slim-minder/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/mvgrieken/slim-minder/discussions)

## 🗺 Roadmap

### MVP (Current)
- [x] User authentication
- [x] Basic budget management
- [x] Transaction tracking
- [x] Category management
- [x] Web deployment

### Phase 2
- [ ] PSD2 bank integration
- [ ] AI coaching features
- [ ] Push notifications
- [ ] Mobile app deployment

### Phase 3
- [ ] Advanced analytics
- [ ] Goal tracking
- [ ] Social features
- [ ] Multi-currency support

---

**Slim Minder** - Maak van budgetteren een gewoonte! 💰
