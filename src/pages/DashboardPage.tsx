import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, Plus, BarChart3, PiggyBank, Receipt } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const DashboardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  text-align: center;
`;

const DashboardTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DashboardSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div<{ type?: 'income' | 'expense' | 'savings' | 'budget' }>`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ type }) => {
    switch (type) {
      case 'income': return '#28a745';
      case 'expense': return '#dc3545';
      case 'savings': return '#17a2b8';
      case 'budget': return '#ffc107';
      default: return '#6c757d';
    }
  }};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const StatIcon = styled.div<{ type?: 'income' | 'expense' | 'savings' | 'budget' }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type }) => {
    switch (type) {
      case 'income': return '#d4edda';
      case 'expense': return '#f8d7da';
      case 'savings': return '#d1ecf1';
      case 'budget': return '#fff3cd';
      default: return '#e9ecef';
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case 'income': return '#28a745';
      case 'expense': return '#dc3545';
      case 'savings': return '#17a2b8';
      case 'budget': return '#856404';
      default: return '#6c757d';
    }
  }};
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.9rem;
  color: ${({ positive }) => positive ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const Section = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
`;

const CategoryInfo = styled.div``;

const CategoryName = styled.div`
  font-weight: bold;
  color: #333;
`;

const CategoryAmount = styled.div`
  color: #6c757d;
  font-size: 0.9rem;
`;

const CategoryProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProgressBar = styled.div<{ percentage: number }>`
  width: 100px;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ percentage }) => Math.min(percentage, 100)}%;
    background: ${({ percentage }) => percentage > 90 ? '#dc3545' : percentage > 70 ? '#ffc107' : '#28a745'};
    transition: width 0.3s ease;
  }
`;

const ProgressText = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  min-width: 40px;
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlertItem = styled.div<{ type: 'warning' | 'success' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  background: ${({ type }) => {
    switch (type) {
      case 'warning': return '#fff3cd';
      case 'success': return '#d4edda';
      case 'info': return '#d1ecf1';
    }
  }};
  color: ${({ type }) => {
    switch (type) {
      case 'warning': return '#856404';
      case 'success': return '#155724';
      case 'info': return '#0c5460';
    }
  }};
  border-left: 4px solid ${({ type }) => {
    switch (type) {
      case 'warning': return '#ffc107';
      case 'success': return '#28a745';
      case 'info': return '#17a2b8';
    }
  }};
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface Alert {
  type: 'warning' | 'success' | 'info';
  message: string;
  icon: React.ComponentType<{ size?: string | number }>;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { loading, error } = useApp();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    budgetStatus: 'on-track',
    topCategories: [] as Array<{ name: string; amount: number; budget: number; percentage: number }>,
    alerts: [] as Array<{ type: 'warning' | 'success' | 'info'; message: string; icon: React.ComponentType<{ size?: string | number }> }>
  });

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'budget':
        navigate('/budgets');
        break;
      case 'savings':
        navigate('/savings-goals');
        break;
      case 'transaction':
        navigate('/transactions');
        break;
      case 'report':
        navigate('/ai-coach');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        const stats = await ApiService.getDashboardStats(user.id);
        
        // Calculate top categories with budget comparison
        const categoryData = Object.entries(stats.categorySpending).map(([category, amount]) => {
          const budget = stats.budgets.find(b => b.category === category);
          const budgetAmount = budget?.amount || 0;
          const percentage = budgetAmount > 0 ? Math.round((Number(amount) / budgetAmount) * 100) : 0;
          
          return {
            name: category,
            amount: Math.round(Number(amount)),
            budget: budgetAmount,
            percentage: Math.min(percentage, 100)
          };
        }).sort((a, b) => b.amount - a.amount).slice(0, 4);

        // Generate alerts based on data
        const alerts = [];
        
        // Budget alerts
        categoryData.forEach(category => {
          if (category.percentage >= 90) {
            alerts.push({
              type: 'warning' as const,
              message: `Je ${category.name.toLowerCase()}budget is bijna op (${category.percentage}%)`,
              icon: AlertTriangle
            });
          }
        });

        // Savings alert
        if (stats.totalSavings > 0) {
          alerts.push({
            type: 'success' as const,
            message: `Je hebt deze maand €${Math.round(stats.totalSavings)} gespaard`,
            icon: CheckCircle
          });
        }

        // Info alert
        if (alerts.length === 0) {
          alerts.push({
            type: 'info' as const,
            message: 'Nieuwe spaartip: Overweeg automatisch sparen',
            icon: Target
          });
        }

        setDashboardData({
          totalIncome: Math.round(stats.totalIncome),
          totalExpenses: Math.round(stats.totalExpenses),
          totalSavings: Math.round(stats.totalSavings),
          budgetStatus: 'on-track',
          topCategories: categoryData,
          alerts
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <DashboardTitle>Laden...</DashboardTitle>
          <DashboardSubtitle>Je financiële gegevens worden geladen</DashboardSubtitle>
        </DashboardHeader>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <DashboardHeader>
          <DashboardTitle>Fout opgetreden</DashboardTitle>
          <DashboardSubtitle>{error}</DashboardSubtitle>
        </DashboardHeader>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>Welkom terug!</DashboardTitle>
        <DashboardSubtitle>Hier is je financiële overzicht voor deze maand</DashboardSubtitle>
      </DashboardHeader>

      <StatsGrid>
        <StatCard type="income">
          <StatHeader>
            <StatIcon type="income">
              <TrendingUp size={20} />
            </StatIcon>
            <StatTitle>Inkomsten</StatTitle>
          </StatHeader>
          <StatValue>€{dashboardData.totalIncome.toLocaleString()}</StatValue>
          <StatChange positive>
            <TrendingUp size={16} />
            +5% t.o.v. vorige maand
          </StatChange>
        </StatCard>

        <StatCard type="expense">
          <StatHeader>
            <StatIcon type="expense">
              <TrendingDown size={20} />
            </StatIcon>
            <StatTitle>Uitgaven</StatTitle>
          </StatHeader>
          <StatValue>€{dashboardData.totalExpenses.toLocaleString()}</StatValue>
          <StatChange positive={false}>
            <TrendingDown size={16} />
            -2% t.o.v. vorige maand
          </StatChange>
        </StatCard>

        <StatCard type="savings">
          <StatHeader>
            <StatIcon type="savings">
              <DollarSign size={20} />
            </StatIcon>
            <StatTitle>Gespaard</StatTitle>
          </StatHeader>
          <StatValue>€{dashboardData.totalSavings.toLocaleString()}</StatValue>
          <StatChange positive>
            <TrendingUp size={16} />
            +12% t.o.v. vorige maand
          </StatChange>
        </StatCard>

        <StatCard type="budget">
          <StatHeader>
            <StatIcon type="budget">
              <Target size={20} />
            </StatIcon>
            <StatTitle>Budget Status</StatTitle>
          </StatHeader>
          <StatValue>Op koers</StatValue>
          <StatChange positive>
            <CheckCircle size={16} />
            3 van 4 categorieën binnen budget
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          <Section>
            <SectionTitle>Uitgaven per categorie</SectionTitle>
            <CategoryList>
              {dashboardData.topCategories.map((category, index) => (
                <CategoryItem key={index}>
                  <CategoryInfo>
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryAmount>€{category.amount} van €{category.budget}</CategoryAmount>
                  </CategoryInfo>
                  <CategoryProgress>
                    <ProgressBar percentage={category.percentage} />
                    <ProgressText>{category.percentage}%</ProgressText>
                  </CategoryProgress>
                </CategoryItem>
              ))}
            </CategoryList>
          </Section>
        </MainContent>

        <Sidebar>
          <Section>
            <SectionTitle>Meldingen</SectionTitle>
            <AlertList>
              {dashboardData.alerts.map((alert, index) => (
                <AlertItem key={index} type={alert.type}>
                  <alert.icon size={16} />
                  <span>{alert.message}</span>
                </AlertItem>
              ))}
            </AlertList>
          </Section>

          <Section>
            <SectionTitle>Snelle acties</SectionTitle>
            <QuickActions>
              <ActionButton onClick={() => handleQuickAction('budget')}>
                <Target size={16} />
                Budget aanpassen
              </ActionButton>
              <ActionButton onClick={() => handleQuickAction('savings')}>
                <PiggyBank size={16} />
                Spaardoel toevoegen
              </ActionButton>
              <ActionButton onClick={() => handleQuickAction('transaction')}>
                <Receipt size={16} />
                Transactie toevoegen
              </ActionButton>
              <ActionButton onClick={() => handleQuickAction('report')}>
                <BarChart3 size={16} />
                Rapport bekijken
              </ActionButton>
            </QuickActions>
          </Section>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage; 