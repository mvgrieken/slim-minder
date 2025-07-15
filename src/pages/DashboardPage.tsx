import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle } from 'lucide-react';

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
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 3200,
    totalExpenses: 1850,
    totalSavings: 1350,
    budgetStatus: 'on-track',
    topCategories: [
      { name: 'Boodschappen', amount: 450, budget: 500, percentage: 90 },
      { name: 'Vervoer', amount: 320, budget: 400, percentage: 80 },
      { name: 'Vrije tijd', amount: 280, budget: 300, percentage: 93 },
      { name: 'Wonen', amount: 800, budget: 800, percentage: 100 }
    ],
    alerts: [
      { type: 'warning', message: 'Je boodschappenbudget is bijna op (90%)', icon: AlertTriangle },
      { type: 'success', message: 'Je hebt deze maand €150 meer gespaard dan vorige maand', icon: CheckCircle },
      { type: 'info', message: 'Nieuwe spaartip: Overweeg automatisch sparen', icon: Target }
    ]
  });

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
              <ActionButton>Budget aanpassen</ActionButton>
              <ActionButton>Spaardoel toevoegen</ActionButton>
              <ActionButton>Transactie toevoegen</ActionButton>
              <ActionButton>Rapport bekijken</ActionButton>
            </QuickActions>
          </Section>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage; 