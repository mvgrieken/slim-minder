import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Edit3, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const BudgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const BudgetCard = styled.div<{ status: 'on-track' | 'warning' | 'over-budget' }>`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ status }) => {
    switch (status) {
      case 'on-track': return '#28a745';
      case 'warning': return '#ffc107';
      case 'over-budget': return '#dc3545';
    }
  }};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BudgetTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BudgetIcon = styled.div<{ category: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ category }) => {
    const colors: { [key: string]: string } = {
      'boodschappen': '#d4edda',
      'vervoer': '#d1ecf1',
      'vrije-tijd': '#fff3cd',
      'wonen': '#f8d7da',
      'gezondheid': '#e2e3e5',
      'kleding': '#f8d7da',
      'onderwijs': '#d1ecf1'
    };
    return colors[category] || '#e9ecef';
  }};
  color: ${({ category }) => {
    const colors: { [key: string]: string } = {
      'boodschappen': '#28a745',
      'vervoer': '#17a2b8',
      'vrije-tijd': '#856404',
      'wonen': '#dc3545',
      'gezondheid': '#6c757d',
      'kleding': '#dc3545',
      'onderwijs': '#17a2b8'
    };
    return colors[category] || '#6c757d';
  }};
`;

const BudgetName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const BudgetActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    background: #f8f9fa;
    color: #333;
  }
`;

const BudgetProgress = styled.div`
  margin-bottom: 15px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProgressAmount = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
`;

const ProgressPercentage = styled.div<{ status: 'on-track' | 'warning' | 'over-budget' }>`
  font-size: 0.9rem;
  color: ${({ status }) => {
    switch (status) {
      case 'on-track': return '#28a745';
      case 'warning': return '#856404';
      case 'over-budget': return '#dc3545';
    }
  }};
  font-weight: 500;
`;

const ProgressBar = styled.div<{ percentage: number; status: 'on-track' | 'warning' | 'over-budget' }>`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ percentage }) => Math.min(percentage, 100)}%;
    background: ${({ status }) => {
      switch (status) {
        case 'on-track': return '#28a745';
        case 'warning': return '#ffc107';
        case 'over-budget': return '#dc3545';
      }
    }};
    transition: width 0.3s ease;
  }
`;

const BudgetDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
`;

const BudgetStatus = styled.div<{ status: 'on-track' | 'warning' | 'over-budget' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${({ status }) => {
    switch (status) {
      case 'on-track': return '#d4edda';
      case 'warning': return '#fff3cd';
      case 'over-budget': return '#f8d7da';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'on-track': return '#155724';
      case 'warning': return '#856404';
      case 'over-budget': return '#721c24';
    }
  }};
  font-size: 0.9rem;
  font-weight: 500;
`;

const SummarySection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const SummaryCard = styled.div`
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SummaryLabel = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'boodschappen': '🛒',
    'vervoer': '🚗',
    'vrije-tijd': '🎬',
    'wonen': '🏠',
    'gezondheid': '💊',
    'kleding': '👕',
    'onderwijs': '📚'
  };
  return icons[category] || '📄';
};

const getBudgetStatus = (spent: number, budget: number): 'on-track' | 'warning' | 'over-budget' => {
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return 'over-budget';
  if (percentage > 80) return 'warning';
  return 'on-track';
};

const mockBudgets = [
  {
    id: 1,
    name: 'Boodschappen',
    category: 'boodschappen',
    budget: 500,
    spent: 450,
    remaining: 50,
    percentage: 90
  },
  {
    id: 2,
    name: 'Vervoer',
    category: 'vervoer',
    budget: 400,
    spent: 320,
    remaining: 80,
    percentage: 80
  },
  {
    id: 3,
    name: 'Vrije tijd',
    category: 'vrije-tijd',
    budget: 300,
    spent: 280,
    remaining: 20,
    percentage: 93
  },
  {
    id: 4,
    name: 'Wonen',
    category: 'wonen',
    budget: 800,
    spent: 800,
    remaining: 0,
    percentage: 100
  },
  {
    id: 5,
    name: 'Gezondheid',
    category: 'gezondheid',
    budget: 200,
    spent: 150,
    remaining: 50,
    percentage: 75
  },
  {
    id: 6,
    name: 'Kleding',
    category: 'kleding',
    budget: 150,
    spent: 180,
    remaining: -30,
    percentage: 120
  }
];

const BudgetsPage: React.FC = () => {
  const [budgets] = useState(mockBudgets);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.budget, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = budgets.reduce((sum, budget) => sum + budget.remaining, 0);
  const onTrackCount = budgets.filter(budget => getBudgetStatus(budget.spent, budget.budget) === 'on-track').length;
  const warningCount = budgets.filter(budget => getBudgetStatus(budget.spent, budget.budget) === 'warning').length;
  const overBudgetCount = budgets.filter(budget => getBudgetStatus(budget.spent, budget.budget) === 'over-budget').length;

  return (
    <BudgetsContainer>
      <PageHeader>
        <PageTitle>Budgetten</PageTitle>
        <PageSubtitle>Beheer je uitgaven per categorie</PageSubtitle>
      </PageHeader>

      <HeaderActions>
        <AddButton>
          <Plus size={16} />
          Nieuw budget
        </AddButton>
      </HeaderActions>

      <BudgetsGrid>
        {budgets.map((budget) => {
          const status = getBudgetStatus(budget.spent, budget.budget);
          const StatusIcon = status === 'on-track' ? CheckCircle : status === 'warning' ? AlertTriangle : TrendingUp;
          
          return (
            <BudgetCard key={budget.id} status={status}>
              <BudgetHeader>
                <BudgetTitle>
                  <BudgetIcon category={budget.category}>
                    {getCategoryIcon(budget.category)}
                  </BudgetIcon>
                  <BudgetName>{budget.name}</BudgetName>
                </BudgetTitle>
                <BudgetActions>
                  <ActionButton title="Bewerken">
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton title="Instellingen">
                    <Target size={16} />
                  </ActionButton>
                </BudgetActions>
              </BudgetHeader>

              <BudgetProgress>
                <ProgressHeader>
                  <ProgressAmount>€{budget.spent} van €{budget.budget}</ProgressAmount>
                  <ProgressPercentage status={status}>{budget.percentage}%</ProgressPercentage>
                </ProgressHeader>
                <ProgressBar percentage={budget.percentage} status={status} />
              </BudgetProgress>

              <BudgetDetails>
                <DetailItem>
                  <DetailValue>€{budget.remaining}</DetailValue>
                  <DetailLabel>Resterend</DetailLabel>
                </DetailItem>
                <DetailItem>
                  <DetailValue>€{budget.spent}</DetailValue>
                  <DetailLabel>Uitgegeven</DetailLabel>
                </DetailItem>
              </BudgetDetails>

              <BudgetStatus status={status}>
                <StatusIcon size={16} />
                {status === 'on-track' && 'Op koers'}
                {status === 'warning' && 'Bijna op'}
                {status === 'over-budget' && 'Over budget'}
              </BudgetStatus>
            </BudgetCard>
          );
        })}
      </BudgetsGrid>

      <SummarySection>
        <SummaryTitle>Budget overzicht</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <SummaryValue>€{totalBudget.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totaal budget</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>€{totalSpent.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totaal uitgegeven</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: totalRemaining >= 0 ? '#28a745' : '#dc3545' }}>
              €{totalRemaining.toFixed(2)}
            </SummaryValue>
            <SummaryLabel>Resterend</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{onTrackCount}</SummaryValue>
            <SummaryLabel>Op koers</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: '#856404' }}>{warningCount}</SummaryValue>
            <SummaryLabel>Waarschuwing</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: '#dc3545' }}>{overBudgetCount}</SummaryValue>
            <SummaryLabel>Over budget</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>
      </SummarySection>
    </BudgetsContainer>
  );
};

export default BudgetsPage; 