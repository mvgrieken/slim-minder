// User Account Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountTier: AccountTier;
  createdAt: Date;
  updatedAt: Date;
  preferences: UserPreferences;
  profile: UserProfile;
}

export type AccountTier = 'FREE' | 'CORE' | 'PREMIUM';

export interface UserPreferences {
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  language: 'nl' | 'en';
}

export interface UserProfile {
  dateOfBirth?: Date;
  occupation?: string;
  monthlyIncome?: number;
  householdSize?: number;
  financialGoals: string[];
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  savingsReminders: boolean;
  weeklyReports: boolean;
}

export interface PrivacySettings {
  shareDataForAnalytics: boolean;
  allowPersonalizedTips: boolean;
  dataRetentionPeriod: number; // in months
}

export interface AccessibilitySettings {
  largeFonts: boolean;
  highContrast: boolean;
  screenReaderSupport: boolean;
  reducedMotion: boolean;
}

// Bank Account & Transaction Types
export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  balance: number;
  currency: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT';
  isConnected: boolean;
  lastSyncAt: Date;
  connectedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  category: TransactionCategory;
  categoryConfidence: number; // 0-1, how confident the AI is about the category
  merchantName?: string;
  location?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  tags: string[];
  notes?: string;
  counterParty?: string;
}

export interface TransactionCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  parentCategoryId?: string;
  isCustom: boolean;
}

export interface RecurringPattern {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number; // every X days/weeks/months/years
  nextExpectedDate: Date;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  alertThresholds: AlertThreshold[];
  spent: number;
  remaining: number;
  percentageUsed: number;
}

export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface AlertThreshold {
  percentage: number; // 50, 75, 90, 100
  triggered: boolean;
  triggeredAt?: Date;
}

// Savings Goals Types
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  category: SavingsCategory;
  priority: GoalPriority;
  isActive: boolean;
  createdAt: Date;
  completedAt?: Date;
  suggestedMonthlyAmount: number;
  progress: number; // 0-100 percentage
}

export type SavingsCategory = 'EMERGENCY' | 'VACATION' | 'ELECTRONICS' | 'HOME' | 'EDUCATION' | 'CUSTOM';
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// Gamification Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: BadgeCategory;
  criteria: BadgeCriteria;
  rarity: BadgeRarity;
}

export type BadgeCategory = 'SAVINGS' | 'BUDGETING' | 'STREAK' | 'MILESTONE' | 'SPECIAL';
export type BadgeRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface BadgeCriteria {
  type: 'SAVINGS_GOAL_COMPLETED' | 'BUDGET_STREAK' | 'SPENDING_REDUCTION' | 'FIRST_GOAL' | 'CONSISTENT_SAVER';
  value?: number;
  timeframe?: number; // in days
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  isVisible: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: ChallengeType;
  duration: number; // in days
  targetValue: number;
  reward: ChallengeReward;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export type ChallengeType = 'SAVINGS_CHALLENGE' | 'SPENDING_REDUCTION' | 'BUDGET_ADHERENCE' | 'TRANSACTION_TRACKING';

export interface ChallengeReward {
  type: 'BADGE' | 'POINTS' | 'SPECIAL_FEATURE';
  value: string | number;
}

export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  progress: number; // 0-100
  isCompleted: boolean;
  startedAt: Date;
  completedAt?: Date;
}

// AI Coach Types
export interface ChatMessage {
  id: string;
  userId: string;
  conversationId: string;
  content: string;
  sender: 'USER' | 'AI';
  timestamp: Date;
  messageType: MessageType;
  context?: ChatContext;
}

export type MessageType = 'TEXT' | 'SUGGESTION' | 'WARNING' | 'CELEBRATION' | 'ANALYSIS';

export interface ChatContext {
  relatedTransactions?: string[];
  relatedBudgets?: string[];
  relatedGoals?: string[];
  financialData?: FinancialSummary;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  lastMessageAt: Date;
  isActive: boolean;
  messages: ChatMessage[];
}

// Financial Analysis Types
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  period: 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  categoryBreakdown: CategorySpending[];
  trends: SpendingTrend[];
  recommendations: string[];
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  budgetComparison?: BudgetComparison;
}

export interface BudgetComparison {
  budgeted: number;
  spent: number;
  variance: number;
  status: 'UNDER' | 'OVER' | 'ON_TRACK';
}

export interface SpendingTrend {
  category: string;
  direction: 'INCREASING' | 'DECREASING' | 'STABLE';
  changePercentage: number;
  timeframe: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
  data?: Record<string, any>;
}

export type NotificationType = 
  | 'BUDGET_ALERT' 
  | 'SAVINGS_MILESTONE' 
  | 'GOAL_ACHIEVED' 
  | 'UNUSUAL_SPENDING' 
  | 'MONTHLY_REPORT' 
  | 'CHALLENGE_COMPLETED'
  | 'BADGE_EARNED'
  | 'TIP_OF_THE_DAY';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Dashboard & Insights Types
export interface DashboardData {
  user: User;
  accounts: BankAccount[];
  recentTransactions: Transaction[];
  budgetOverview: BudgetOverview;
  savingsOverview: SavingsOverview;
  notifications: Notification[];
  insights: FinancialInsight[];
  gamificationData: GamificationData;
}

export interface BudgetOverview {
  totalBudgeted: number;
  totalSpent: number;
  budgetsOnTrack: number;
  budgetsOverspent: number;
  topCategories: CategorySpending[];
}

export interface SavingsOverview {
  totalSaved: number;
  activeGoals: number;
  completedGoalsThisMonth: number;
  projectedSavings: number;
  recommendedSavings: number;
}

export interface FinancialInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
  category?: string;
  suggestedAction?: string;
  createdAt: Date;
}

export type InsightType = 
  | 'SPENDING_PATTERN' 
  | 'SAVINGS_OPPORTUNITY' 
  | 'BUDGET_OPTIMIZATION' 
  | 'GOAL_ADJUSTMENT'
  | 'RECURRING_EXPENSE'
  | 'UNUSUAL_ACTIVITY';

export interface GamificationData {
  userLevel: number;
  totalPoints: number;
  badges: UserBadge[];
  activeChallenges: UserChallenge[];
  streaks: UserStreak[];
  leaderboard?: LeaderboardEntry[];
}

export interface UserStreak {
  type: 'BUDGET_ADHERENCE' | 'DAILY_TRACKING' | 'SAVINGS_CONSISTENCY';
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  rank: number;
  badges: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface BudgetForm {
  name: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  alertThresholds: number[];
}

export interface GoalForm {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate: Date;
  category: SavingsCategory;
  priority: GoalPriority;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  requiredTier?: AccountTier;
  children?: NavigationItem[];
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
}

export interface ComparisonData {
  period: string;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
} 