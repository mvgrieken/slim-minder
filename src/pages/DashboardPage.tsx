import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Bell, 
  Shield, 
  DollarSign,
  ArrowRight,
  PieChart,
  BarChart,
  CreditCard,
  Calendar,
  Plus
} from 'react-feather';
import { useApp } from '../contexts/AppContext';

const DashboardPage: React.FC = () => {
  const { user, transactions, budgets, savingsGoals } = useApp();

  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSavings = savingsGoals.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, s) => sum + s.targetAmount, 0);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <WelcomeText>
            Welkom terug, <GoldText>{user?.name || 'Gebruiker'}</GoldText>
          </WelcomeText>
          <Subtitle>Hier is een overzicht van je financiële status</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <QuickActionButton to="/transactions/new" className="btn-primary">
            <Plus size={16} />
            Nieuwe Transactie
          </QuickActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard className="glass">
          <StatIcon>
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalSpent.toLocaleString()}</StatValue>
            <StatLabel>Uitgegeven deze maand</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <Target size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalBudget.toLocaleString()}</StatValue>
            <StatLabel>Budget beschikbaar</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalSavings.toLocaleString()}</StatValue>
            <StatLabel>Opgespaard totaal</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <Shield size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{Math.round((totalSavings / totalTarget) * 100)}%</StatValue>
            <StatLabel>Spaardoel bereikt</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainSection>
          <SectionTitle>Recente Transacties</SectionTitle>
          <TransactionsCard className="card">
            {transactions.slice(0, 5).map((transaction) => (
              <TransactionItem key={transaction.id}>
                <TransactionIcon>
                  <DollarSign size={16} />
                </TransactionIcon>
                <TransactionDetails>
                  <TransactionTitle>{transaction.description}</TransactionTitle>
                  <TransactionCategory>{transaction.category}</TransactionCategory>
                </TransactionDetails>
                <TransactionAmount>
                  €{transaction.amount.toLocaleString()}
                </TransactionAmount>
              </TransactionItem>
            ))}
            <ViewAllButton to="/transactions" className="btn-secondary">
              Bekijk alle transacties
              <ArrowRight size={16} />
            </ViewAllButton>
          </TransactionsCard>
        </MainSection>

        <SideSection>
          <SectionTitle>Budget Overzicht</SectionTitle>
          <BudgetCard className="card">
            {budgets.slice(0, 3).map((budget) => {
              const spent = transactions
                .filter(t => t.category === budget.category)
                .reduce((sum, t) => sum + t.amount, 0);
              const percentage = (spent / budget.amount) * 100;
              
              return (
                <BudgetItem key={budget.id}>
                  <BudgetHeader>
                    <BudgetCategory>{budget.category}</BudgetCategory>
                    <BudgetAmount>€{budget.amount.toLocaleString()}</BudgetAmount>
                  </BudgetHeader>
                  <ProgressBar>
                    <ProgressFill percentage={Math.min(percentage, 100)} />
                  </ProgressBar>
                  <BudgetStatus>
                    €{spent.toLocaleString()} van €{budget.amount.toLocaleString()} gebruikt
                  </BudgetStatus>
                </BudgetItem>
              );
            })}
            <ViewAllButton to="/budgets" className="btn-secondary">
              Bekijk alle budgets
              <ArrowRight size={16} />
            </ViewAllButton>
          </BudgetCard>
        </SideSection>
      </ContentGrid>

      <QuickActions>
        <ActionCard to="/transactions" className="card">
          <ActionIcon>
            <CreditCard size={32} />
          </ActionIcon>
          <ActionTitle>Transacties</ActionTitle>
          <ActionDescription>Beheer je uitgaven en inkomsten</ActionDescription>
        </ActionCard>

        <ActionCard to="/budgets" className="card">
          <ActionIcon>
            <PieChart size={32} />
          </ActionIcon>
          <ActionTitle>Budgets</ActionTitle>
          <ActionDescription>Stel budgetten in en monitor je uitgaven</ActionDescription>
        </ActionCard>

        <ActionCard to="/savings-goals" className="card">
          <ActionIcon>
            <Target size={32} />
          </ActionIcon>
          <ActionTitle>Spaardoelen</ActionTitle>
          <ActionDescription>Bereik je financiële doelen</ActionDescription>
        </ActionCard>

        <ActionCard to="/ai-coach" className="card">
          <ActionIcon>
            <TrendingUp size={32} />
          </ActionIcon>
          <ActionTitle>AI Coach</ActionTitle>
          <ActionDescription>Krijg persoonlijke financiële adviezen</ActionDescription>
        </ActionCard>
      </QuickActions>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gradientSecondary};
  background-attachment: fixed;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
  padding: ${({ theme }) => theme.spacing.xl};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const HeaderContent = styled.div``;

const WelcomeText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GoldText = styled.span`
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuickActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.div``;

const SideSection = styled.div``;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TransactionsCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const TransactionIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TransactionCategory = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TransactionAmount = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const BudgetCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const BudgetItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const BudgetCategory = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const BudgetAmount = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: ${({ theme, percentage }) => 
    percentage > 80 ? theme.colors.gradientError :
    percentage > 60 ? theme.colors.gradientAccent :
    theme.colors.gradientSuccess
  };
  width: ${({ percentage }) => percentage}%;
  transition: width 0.3s ease;
`;

const BudgetStatus = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ViewAllButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};
  margin-top: ${({ theme }) => theme.spacing.lg};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: ${({ theme }) => theme.colors.white};
    transform: translateY(-1px);
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ActionCard = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ActionIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ActionDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
`;

export default DashboardPage; 