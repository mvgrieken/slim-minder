# Slim Minder MVP - React Web Application

Een modern fintech platform voor schuldpreventie en gedragsverandering in persoonlijke financiën, gebouwd met React en TypeScript.

## 📋 Overzicht

Slim Minder is een sociaal-fintech platform dat gebruikers helpt bij het voorkomen van schulden door:
- 🏦 **Bankkoppeling via PSD2** - Veilige verbinding met bankrekeningen
- 📊 **Automatische categorisatie** - Slimme indeling van transacties
- 💡 **Budgettering & waarschuwingen** - Proactieve nudges bij overschrijdingen
- 🎯 **Spaardoelen** - Motiverende doelen met voortgangstracking
- 🤖 **AI-coach** - Persoonlijk financieel advies via chatbot
- 🏆 **Gamification** - Badges, challenges en beloningen
- 📱 **Responsive design** - Optimaal op alle apparaten

## 🚀 Features Geïmplementeerd

### ✅ Voltooid
- **Project Setup**
  - TypeScript configuratie
  - Styled Components theming
  - React Router v6 setup
  - Comprehensive type definitions
  
- **Authentication System**
  - Context-based auth management
  - Protected/Public route guards
  - Account tier system (Free/Core/Premium)
  - JWT token handling met refresh

- **API Infrastructure**
  - Axios client met interceptors
  - Automatic token refresh
  - Error handling & notifications
  - Service layer architectuur

- **UI Foundation**
  - Modern design system
  - Accessibility features (WCAG 2.1)
  - Loading states & error boundaries
  - Responsive styling

- **Core Pages**
  - Landing page met features showcase
  - 404 Not Found page
  - Authentication layouts

### 🚧 In Ontwikkeling
- Dashboard componenten
- Transactie management
- Budget & goals interfaces
- AI Coach chat systeem
- Gamification systeem

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Styled Components
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📁 Project Structuur

```
src/
├── components/           # Herbruikbare UI componenten
│   ├── ui/              # Basis UI componenten (Button, Input, etc.)
│   ├── layout/          # Layout componenten (Header, Sidebar, etc.)
│   └── ErrorBoundary.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Route pagina's
│   ├── auth/           # Login, Register, etc.
│   ├── HomePage.tsx    # Landing page
│   └── NotFoundPage.tsx
├── services/           # API services
│   ├── apiClient.ts    # HTTP client configuratie
│   └── authService.ts  # Authentication API calls
├── styles/             # Styling configuratie
│   ├── theme.ts        # Design system tokens
│   └── GlobalStyles.ts # Globale CSS reset & utilities
├── types/              # TypeScript type definitions
│   └── index.ts        # Alle interface definities
├── utils/              # Helper functies
└── App.tsx             # Root component
```

## 🎨 Design System

Het project gebruikt een uitgebreid design system gebaseerd op moderne fintech principes:

### Kleuren
- **Primary**: Blauw (#0ea5e9) - Vertrouwen & professionaliteit
- **Secondary**: Groen (#22c55e) - Succes & groei
- **Warning**: Oranje (#f59e0b) - Waarschuwingen
- **Error**: Rood (#ef4444) - Fouten & kritiek
- **Categories**: Specifieke kleuren per uitgavencategorie

### Typography
- **Font**: Inter (modern, leesbaar)
- **Sizes**: Responsive schaalsysteem (xs tot 5xl)
- **Weights**: Light tot ExtraBold

### Spacing & Layout
- **8px grid system**
- **Responsive breakpoints**
- **Consistente margins & padding**

## 📱 Accessibility Features

- **WCAG 2.1 AA compliance**
- **Screen reader support**
- **Keyboard navigation**
- **High contrast mode**
- **Reduced motion support**
- **Skip links**
- **Focus management**

## 🔐 Security & Privacy

- **Bank-level security** met OAuth 2.0
- **HTTPS/TLS encryption**
- **GDPR compliance**
- **Data minimalization**
- **EU server hosting**
- **2FA ondersteuning**

## 📊 Account Tiers

### Free
- 1 bankrekening
- Basis categorieën
- Beperkte AI-coach (5 vragen/maand)
- Basis budgetten

### Core (Standaard)
- Onbeperkt bankrekeningen
- Volledige functionaliteit
- Unlimited AI-coach
- Alle waarschuwingen & nudges

### Premium
- Proactieve coaching
- Advanced rapportages
- Gezinsaccounts
- Extra personalisatie

## 🚀 Installatie & Setup

### Vereisten
- Node.js 16+
- npm of yarn
- Git

### Stappen

1. **Clone de repository**
```bash
git clone [repository-url]
cd slim-minder
```

2. **Installeer dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Configureer API endpoints
```

4. **Start development server**
```bash
npm start
```

De app is beschikbaar op `http://localhost:3000`

### Beschikbare Scripts

```bash
npm start          # Development server
npm build          # Production build
npm test           # Run tests
npm run lint       # ESLint check
npm run lint:fix   # Fix ESLint issues
npm run type-check # TypeScript check
```

## 🧪 Testing

```bash
npm test           # Unit tests
npm run test:e2e   # End-to-end tests (Cypress)
npm run test:a11y  # Accessibility tests
```

## 📦 Build & Deployment

```bash
npm run build      # Optimized production build
npm run serve      # Serve production build locally
```

## 🗺 Roadmap

### Phase 1 - MVP Core (Q4 2024)
- [x] Project foundation
- [x] Authentication system
- [ ] Dashboard implementation
- [ ] Basic transactions view
- [ ] Budget management

### Phase 2 - Enhanced Features (Q1 2025)
- [ ] AI Coach integration
- [ ] Gamification system
- [ ] Advanced analytics
- [ ] Real-time notifications

### Phase 3 - Advanced Features (Q2 2025)
- [ ] PSD2 bank integration
- [ ] Advanced reporting
- [ ] Multi-user households
- [ ] Mobile app parity

## 🤝 Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/nieuwe-functie`)
3. Commit changes (`git commit -m 'Voeg nieuwe functie toe'`)
4. Push naar branch (`git push origin feature/nieuwe-functie`)
5. Open een Pull Request

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License - zie het [LICENSE](LICENSE) bestand voor details.

## 📞 Support

Voor vragen of support:
- 📧 Email: support@slimminder.nl
- 📖 Documentatie: [docs.slimminder.nl](https://docs.slimminder.nl)
- 🐛 Bug reports: GitHub Issues

## 🙏 Acknowledgements

- Design geïnspireerd door moderne fintech apps
- Icons van Lucide React
- Gebaseerd op React best practices
- Accessibility guidelines van WCAG 2.1
