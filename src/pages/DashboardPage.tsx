import React from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PiggyBank,
  CreditCard,
  Calendar,
  Plus
} from 'react-feather';
import { useApp } from '../contexts/AppContext';

const DashboardPage: React.FC = () => {
  const { user, transactions, budgets, savingsGoals } = useApp();

  // Calculate summary data - using mock data since we don't have type field
  const totalIncome = transactions
    .filter(t => t.amount > 0) // Assume positive amounts are income
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0) // Assume negative amounts are expenses
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Get recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Get budget alerts
  const budgetAlerts = budgets.filter(budget => {
    const spent = transactions
      .filter(t => t.category.name === budget.name && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return spent > budget.amount * 0.8; // Alert when 80% spent
  });

  return (
    <Container>
      <Header>
        <HeaderContent>
          <WelcomeText>
            Welkom terug, <UserName>{user?.firstName || 'Gebruiker'}</UserName>! 👋
          </WelcomeText>
          <DateText>{new Date().toLocaleDateString('nl-NL', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</DateText>
        </HeaderContent>
        <QuickActions>
          <QuickActionButton>
            <Plus size={16} />
            Transactie
          </QuickActionButton>
          <QuickActionButton>
            <Target size={16} />
            Budget
          </QuickActionButton>
        </QuickActions>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryIcon positive>
            <TrendingUp size={24} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryLabel>Inkomsten</SummaryLabel>
            <SummaryAmount>€{totalIncome.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</SummaryAmount>
            <SummaryChange positive>+12.5% vs vorige maand</SummaryChange>
          </SummaryContent>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon negative>
            <TrendingDown size={24} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryLabel>Uitgaven</SummaryLabel>
            <SummaryAmount>€{totalExpenses.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</SummaryAmount>
            <SummaryChange negative>-8.2% vs vorige maand</SummaryChange>
          </SummaryContent>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon positive={netIncome >= 0}>
            <DollarSign size={24} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryLabel>Netto Inkomen</SummaryLabel>
            <SummaryAmount positive={netIncome >= 0}>
              €{netIncome.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </SummaryAmount>
            <SummaryChange positive={netIncome >= 0}>
              {netIncome >= 0 ? '+' : ''}{savingsRate.toFixed(1)}% spaarpercentage
            </SummaryChange>
          </SummaryContent>
        </SummaryCard>

        <SummaryCard>
          <SummaryIcon positive>
            <PiggyBank size={24} />
          </SummaryIcon>
          <SummaryContent>
            <SummaryLabel>Spaargeld</SummaryLabel>
            <SummaryAmount>
              €{savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
            </SummaryAmount>
            <SummaryChange positive>+€450 deze maand</SummaryChange>
          </SummaryContent>
        </SummaryCard>
      </SummaryGrid>

      <ContentGrid>
        <MainContent>
          <Section>
            <SectionHeader>
              <SectionTitle>Recente Transacties</SectionTitle>
              <ViewAllLink href="/transactions">Bekijk alle</ViewAllLink>
            </SectionHeader>
            <TransactionsList>
              {recentTransactions.map((transaction) => (
                <TransactionItem key={transaction.id}>
                  <TransactionIcon type={transaction.amount > 0 ? 'income' : 'expense'}>
                    {transaction.amount > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  </TransactionIcon>
                  <TransactionDetails>
                    <TransactionTitle>{transaction.description}</TransactionTitle>
                    <TransactionCategory>{transaction.category.name}</TransactionCategory>
                  </TransactionDetails>
                  <TransactionAmount type={transaction.amount > 0 ? 'income' : 'expense'}>
                    {transaction.amount > 0 ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </TransactionAmount>
                  <TransactionDate>
                    {new Date(transaction.date).toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit' })}
                  </TransactionDate>
                </TransactionItem>
              ))}
            </TransactionsList>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Budget Overzicht</SectionTitle>
              <ViewAllLink href="/budgets">Bekijk alle</ViewAllLink>
            </SectionHeader>
            <BudgetsGrid>
              {budgets.slice(0, 4).map((budget) => {
                const spent = transactions
                  .filter(t => t.category.name === budget.name && t.amount < 0)
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0);
                const percentage = (spent / budget.amount) * 100;
                const isOverBudget = percentage > 100;
                const isNearLimit = percentage > 80;

                return (
                  <BudgetCard key={budget.id}>
                    <BudgetHeader>
                      <BudgetCategory>{budget.name}</BudgetCategory>
                      <BudgetStatus isOverBudget={isOverBudget} isNearLimit={isNearLimit}>
                        {isOverBudget ? <AlertTriangle size={12} /> : isNearLimit ? <Clock size={12} /> : <CheckCircle size={12} />}
                      </BudgetStatus>
                    </BudgetHeader>
                    <BudgetProgress>
                      <ProgressBar>
                        <ProgressFill percentage={Math.min(percentage, 100)} isOverBudget={isOverBudget} />
                      </ProgressBar>
                      <BudgetAmounts>
                        <SpentAmount>€{spent.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</SpentAmount>
                        <TotalAmount>/ €{budget.amount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</TotalAmount>
                      </BudgetAmounts>
                    </BudgetProgress>
                  </BudgetCard>
                );
              })}
            </BudgetsGrid>
          </Section>
        </MainContent>

        <Sidebar>
          <Section>
            <SectionHeader>
              <SectionTitle>Alerts</SectionTitle>
            </SectionHeader>
            <AlertsList>
              {budgetAlerts.length > 0 ? (
                budgetAlerts.map((budget) => (
                  <AlertItem key={budget.id}>
                    <AlertIcon>
                      <AlertTriangle size={16} />
                    </AlertIcon>
                    <AlertContent>
                      <AlertTitle>Budget bijna op</AlertTitle>
                      <AlertDescription>{budget.name} budget is bijna bereikt</AlertDescription>
                    </AlertContent>
                  </AlertItem>
                ))
              ) : (
                <NoAlerts>
                  <CheckCircle size={24} />
                  <NoAlertsText>Geen alerts</NoAlertsText>
                  <NoAlertsDescription>Je budgetten zijn onder controle</NoAlertsDescription>
                </NoAlerts>
              )}
            </AlertsList>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Spaardoelen</SectionTitle>
              <ViewAllLink href="/savings">Bekijk alle</ViewAllLink>
            </SectionHeader>
            <SavingsList>
              {savingsGoals.slice(0, 3).map((goal) => {
                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                return (
                  <SavingsItem key={goal.id}>
                    <SavingsIcon>
                      <Target size={16} />
                    </SavingsIcon>
                    <SavingsDetails>
                      <SavingsTitle>{goal.name}</SavingsTitle>
                      <SavingsProgress>
                        <ProgressBar>
                          <ProgressFill percentage={percentage} />
                        </ProgressBar>
                        <SavingsAmounts>
                          €{goal.currentAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} / €{goal.targetAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </SavingsAmounts>
                      </SavingsProgress>
                    </SavingsDetails>
                  </SavingsItem>
                );
              })}
            </SavingsList>
          </Section>
        </Sidebar>
      </ContentGrid>
    </Container>
  );
};

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
    align-items: flex-start;
  }
`;

const HeaderContent = styled.div``;

const WelcomeText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UserName = styled.span`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.primaryDark} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const SummaryIcon = styled.div<{ positive?: boolean; negative?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, positive, negative }) => {
    if (positive) return `linear-gradient(135deg, ${theme.colors.success}20 0%, ${theme.colors.success}10 100%)`;
    if (negative) return `linear-gradient(135deg, ${theme.colors.error}20 0%, ${theme.colors.error}10 100%)`;
    return `linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.primary}10 100%)`;
  }};
  color: ${({ theme, positive, negative }) => {
    if (positive) return theme.colors.success;
    if (negative) return theme.colors.error;
    return theme.colors.primary;
  }};
`;

const SummaryContent = styled.div`
  flex: 1;
`;

const SummaryLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SummaryAmount = styled.div<{ positive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, positive }) => positive !== undefined ? (positive ? theme.colors.success : theme.colors.error) : theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SummaryChange = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme, positive, negative }) => {
    if (positive) return theme.colors.success;
    if (negative) return theme.colors.error;
    return theme.colors.textSecondary;
  }};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ViewAllLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const TransactionsList = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, type }) => 
    type === 'income' 
      ? `linear-gradient(135deg, ${theme.colors.success}20 0%, ${theme.colors.success}10 100%)`
      : `linear-gradient(135deg, ${theme.colors.error}20 0%, ${theme.colors.error}10 100%)`
  };
  color: ${({ theme, type }) => type === 'income' ? theme.colors.success : theme.colors.error};
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TransactionCategory = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TransactionAmount = styled.div<{ type: string }>`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, type }) => type === 'income' ? theme.colors.success : theme.colors.error};
`;

const TransactionDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BudgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const BudgetCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.gray50};
`;

const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const BudgetCategory = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BudgetStatus = styled.div<{ isOverBudget?: boolean; isNearLimit?: boolean }>`
  color: ${({ theme, isOverBudget, isNearLimit }) => {
    if (isOverBudget) return theme.colors.error;
    if (isNearLimit) return theme.colors.warning;
    return theme.colors.success;
  }};
`;

const BudgetProgress = styled.div``;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled.div<{ percentage: number; isOverBudget?: boolean }>`
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  background: ${({ theme, isOverBudget }) => 
    isOverBudget 
      ? `linear-gradient(90deg, ${theme.colors.error} 0%, ${theme.colors.errorLight} 100%)`
      : `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`
  };
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: width ${({ theme }) => theme.transitions.base};
`;

const BudgetAmounts = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SpentAmount = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TotalAmount = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AlertsList = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const AlertIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.warning}20 0%, ${({ theme }) => theme.colors.warning}10 100%);
  color: ${({ theme }) => theme.colors.warning};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AlertDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NoAlerts = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.success};
`;

const NoAlertsText = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const NoAlertsDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SavingsList = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SavingsItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const SavingsIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20 0%, ${({ theme }) => theme.colors.primary}10 100%);
  color: ${({ theme }) => theme.colors.primary};
`;

const SavingsDetails = styled.div`
  flex: 1;
`;

const SavingsTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SavingsProgress = styled.div``;

const SavingsAmounts = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default DashboardPage; 