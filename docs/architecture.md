# Technical Architecture - Slim Minder

## System Overview

Slim Minder is a cross-platform budgetcoach application built with modern web technologies, focusing on scalability, security, and user experience across iOS, Android, and Web platforms.

### Core Principles
- **Security First**: No API keys in client, end-to-end encryption
- **Cross-Platform**: Single codebase for iOS, Android, Web
- **Scalable**: Microservices-ready architecture
- **Performance**: Optimized for mobile networks
- **User Experience**: Intuitive, accessible interface

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
├─────────────────────────────────────────────────────────┤
│  React Native App (iOS/Android)  │  React Native Web    │
│  - Expo Runtime                  │  - Browser Runtime   │
│  - Native Modules               │  - Web APIs          │
│  - Push Notifications           │  - PWA Features      │
└─────────────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   API Layer  │
                    │  (Supabase)  │
                    └──────┬──────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                Backend Services                          │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL Database  │  Authentication  │  Storage     │
│  - User Data         │  - JWT Tokens    │  - Files     │
│  - Transactions      │  - RLS Policies  │  - Images    │
│  - Budgets           │  - Sessions      │  - Documents │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│              External Integrations                       │
├─────────────────────────────────────────────────────────┤
│  Open Banking APIs   │  AI Services     │  Notifications│
│  - Tink             │  - OpenAI        │  - Expo Push  │
│  - GoCardless       │  - Anthropic     │  - FCM        │
│  - Nordigen         │  - Whisper       │  - APNs       │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React Native 0.74
- **Platform**: Expo SDK 51
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS via NativeWind
- **Navigation**: React Navigation 6
- **State Management**: React Hooks + Context API
- **HTTP Client**: Supabase Client (built on fetch)

### Project Structure
```
apps/mobile/src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   ├── charts/         # Data visualization
│   └── ui/             # Basic UI elements
├── screens/            # App screens/pages
│   ├── Dashboard.tsx
│   ├── Goals.tsx
│   ├── AIChat.tsx
│   └── ...
├── services/           # External service clients
│   ├── supabase.ts     # Database client
│   ├── mockData.ts     # Development data
│   └── ai/             # AI service wrappers
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication
│   ├── useBudgets.tsx  # Budget operations
│   └── useGoals.tsx    # Goal management
├── utils/              # Helper functions
│   ├── currency.ts     # Money formatting
│   ├── dates.ts        # Date operations
│   └── validation.ts   # Input validation
└── types/              # TypeScript definitions
    ├── api.ts          # API response types
    ├── database.ts     # Database schema types
    └── ui.ts           # UI component types
```

### Component Architecture
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Composition over Inheritance**: Prefer component composition
- **Hooks-First**: Custom hooks for business logic
- **Error Boundaries**: Graceful error handling

### State Management Strategy
```typescript
// Context for global state
const AuthContext = React.createContext();
const UserContext = React.createContext();

// Local state with hooks
const [budgets, setBudgets] = useState<Budget[]>([]);

// Server state with Supabase real-time
const subscription = supabase
  .channel('budgets')
  .on('postgres_changes', callback)
  .subscribe();
```

## Backend Architecture

### Supabase Stack
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: JWT-based with email/social logins
- **Storage**: File uploads with signed URLs
- **Real-time**: WebSocket subscriptions for live updates
- **Edge Functions**: Serverless functions for AI integration

### Database Schema Design

#### Core Tables
```sql
-- User profiles (extends auth.users)
users (id, email, full_name, preferences...)

-- Financial categories  
categories (id, user_id, name, icon, color)

-- Budget definitions
budgets (id, user_id, category_id, amount, period)

-- Financial transactions
transactions (id, user_id, amount, category_id, date, description)

-- Savings goals
goals (id, user_id, title, target_amount, current_amount, deadline)

-- Achievement system
badges (id, user_id, badge_type, earned_at)
```

#### Security Model (RLS Policies)
```sql
-- Users can only access their own data
CREATE POLICY "users_own_data" ON transactions 
  FOR ALL USING (user_id = auth.uid());

-- Default categories visible to all
CREATE POLICY "default_categories" ON categories 
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
```

### API Design Principles
- **RESTful**: Consistent HTTP verbs and status codes
- **GraphQL-like**: Single endpoint with flexible queries
- **Real-time**: WebSocket for live data updates
- **Batch Operations**: Efficient bulk updates
- **Pagination**: Cursor-based for large datasets

## Security Architecture

### Authentication & Authorization
```typescript
// JWT token validation
const { data: user } = await supabase.auth.getUser();

// Row Level Security automatically enforces access
const { data: budgets } = await supabase
  .from('budgets')
  .select('*'); // Only returns user's budgets
```

### Data Protection
- **Encryption at Rest**: PostgreSQL with TDE
- **Encryption in Transit**: HTTPS/WSS only
- **API Key Security**: Server-side only, never in client
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection**: Parameterized queries via Supabase

### Privacy & Compliance
- **GDPR Ready**: Data export and deletion
- **CCPA Compliant**: California privacy rights
- **Financial Regulations**: PCI DSS considerations
- **Data Minimization**: Only collect necessary data

## Performance Architecture

### Frontend Optimization
```typescript
// Lazy loading
const GoalsScreen = React.lazy(() => import('./screens/Goals'));

// Memoization
const expensiveCalculation = useMemo(() => 
  calculateBudgetProgress(transactions), [transactions]);

// Virtual lists for large datasets
<FlatList
  data={transactions}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
/>
```

### Backend Optimization
- **Database Indexes**: Optimized for common queries
- **Connection Pooling**: Supabase built-in pooling
- **Caching**: Redis for frequently accessed data
- **CDN**: Static assets via Supabase Storage

### Mobile Performance
- **Bundle Splitting**: Code splitting for web
- **Image Optimization**: expo-image with caching
- **Network Efficiency**: Request batching and caching
- **Offline Support**: Local storage with sync

## Integration Architecture

### Open Banking (PSD2)
```typescript
interface BankProvider {
  name: 'tink' | 'gocardless' | 'nordigen';
  authenticate(): Promise<AuthResult>;
  fetchAccounts(): Promise<Account[]>;
  fetchTransactions(accountId: string): Promise<Transaction[]>;
  setupWebhook(): Promise<void>;
}
```

### AI Services Integration
```typescript
// Edge function for AI chat (server-side)
export default async function aiChat(request: Request) {
  const { message, userId } = await request.json();
  
  // Validate JWT
  const user = await validateUser(request);
  
  // Call OpenAI/Anthropic
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }],
  });
  
  return Response.json({ reply: response.choices[0].message.content });
}
```

### Push Notifications
```typescript
// Expo Push Tokens
const registerForPushNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  
  // Store token in database
  await supabase.from('push_tokens').upsert({
    user_id: user.id,
    token: token.data
  });
};
```

## Deployment Architecture

### Development Environment
```bash
# Local development
npm run dev:mobile    # Expo dev server
npm run dev:api       # Local API (optional)
docker-compose up -d  # Local PostgreSQL

# Supabase local development
supabase start        # Local Supabase stack
supabase db reset     # Reset local database
```

### Production Environment
- **Mobile Apps**: EAS Build → App Stores
- **Web App**: Vercel/Netlify static hosting  
- **Database**: Supabase managed PostgreSQL
- **Files**: Supabase Storage with CDN
- **Monitoring**: Sentry for error tracking

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- TypeScript compilation
- ESLint code quality
- Unit test execution
- E2E test suite
- Security vulnerability scan
- Build mobile apps (EAS)
- Deploy web app
- Database migrations
```

## Monitoring & Observability

### Error Tracking
```typescript
import * as Sentry from 'sentry-expo';

// Automatic error capture
Sentry.init({ dsn: process.env.SENTRY_DSN });

// Custom error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }
}
```

### Performance Monitoring
- **Bundle Analysis**: Bundle size tracking
- **Render Performance**: React DevTools Profiler
- **Network Requests**: Request timing and failures
- **User Sessions**: App usage analytics

### Business Metrics
```typescript
// Custom analytics events
analytics.track('Budget Created', {
  category: budget.categoryName,
  amount: budget.amount,
  period: budget.period
});

analytics.track('Goal Achieved', {
  goalType: goal.category,
  targetAmount: goal.targetAmount,
  daysToComplete: daysBetween(goal.createdAt, new Date())
});
```

## Scalability Considerations

### Horizontal Scaling
- **Microservices Ready**: Services can be extracted
- **Database Sharding**: User-based data partitioning
- **CDN Distribution**: Global content delivery
- **Load Balancing**: Multiple API instances

### Vertical Scaling
- **Database Optimization**: Query performance tuning
- **Caching Layers**: Redis for hot data
- **Connection Pooling**: Efficient DB connections
- **Resource Monitoring**: Proactive capacity planning

## Future Architecture Evolution

### Phase 1: MVP (Current)
- Basic budgeting and goal tracking
- Manual transaction entry
- Simple AI chat interface

### Phase 2: Integration
- Open Banking connectivity
- Advanced AI coaching
- Push notification system

### Phase 3: Intelligence
- Machine learning insights
- Predictive budgeting
- Automated categorization

### Phase 4: Platform
- Multi-user families
- Third-party integrations
- White-label solutions

---

This architecture provides a solid foundation for the Slim Minder application while remaining flexible enough to evolve with changing requirements and scale with user growth.