import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Edit3, Target, TrendingUp, Calendar, DollarSign, Award } from 'lucide-react';

const SavingsContainer = styled.div`
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

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GoalCard = styled.div<{ status: 'active' | 'completed' | 'overdue' }>`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${({ status }) => {
    switch (status) {
      case 'active': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'overdue': return '#dc3545';
    }
  }};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const GoalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GoalIcon = styled.div<{ category: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ category }) => {
    const colors: { [key: string]: string } = {
      'vakantie': '#d4edda',
      'noodfonds': '#f8d7da',
      'grote-aankoop': '#fff3cd',
      'onderwijs': '#d1ecf1',
      'pensioen': '#e2e3e5',
      'feest': '#f8d7da'
    };
    return colors[category] || '#e9ecef';
  }};
  color: ${({ category }) => {
    const colors: { [key: string]: string } = {
      'vakantie': '#28a745',
      'noodfonds': '#dc3545',
      'grote-aankoop': '#856404',
      'onderwijs': '#17a2b8',
      'pensioen': '#6c757d',
      'feest': '#dc3545'
    };
    return colors[category] || '#6c757d';
  }};
`;

const GoalName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const GoalActions = styled.div`
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

const GoalProgress = styled.div`
  margin-bottom: 20px;
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

const ProgressPercentage = styled.div<{ status: 'active' | 'completed' | 'overdue' }>`
  font-size: 0.9rem;
  color: ${({ status }) => {
    switch (status) {
      case 'active': return '#17a2b8';
      case 'completed': return '#28a745';
      case 'overdue': return '#dc3545';
    }
  }};
  font-weight: 500;
`;

const ProgressBar = styled.div<{ percentage: number; status: 'active' | 'completed' | 'overdue' }>`
  width: 100%;
  height: 10px;
  background: #e9ecef;
  border-radius: 5px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ percentage }) => Math.min(percentage, 100)}%;
    background: ${({ status }) => {
      switch (status) {
        case 'active': return '#17a2b8';
        case 'completed': return '#28a745';
        case 'overdue': return '#dc3545';
      }
    }};
    transition: width 0.3s ease;
  }
`;

const GoalDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
`;

const DetailIcon = styled.div`
  color: #6c757d;
`;

const DetailInfo = styled.div``;

const DetailValue = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
`;

const GoalStatus = styled.div<{ status: 'active' | 'completed' | 'overdue' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  background: ${({ status }) => {
    switch (status) {
      case 'active': return '#d1ecf1';
      case 'completed': return '#d4edda';
      case 'overdue': return '#f8d7da';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'active': return '#0c5460';
      case 'completed': return '#155724';
      case 'overdue': return '#721c24';
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
    'vakantie': '🏖️',
    'noodfonds': '🛡️',
    'grote-aankoop': '🛒',
    'onderwijs': '📚',
    'pensioen': '👴',
    'feest': '🎉'
  };
  return icons[category] || '💰';
};

const getGoalStatus = (saved: number, target: number, deadline: string): 'active' | 'completed' | 'overdue' => {
  if (saved >= target) return 'completed';
  const today = new Date();
  const deadlineDate = new Date(deadline);
  if (today > deadlineDate) return 'overdue';
  return 'active';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateMonthlyAmount = (target: number, saved: number, deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const monthsLeft = Math.max(1, (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
  return Math.ceil((target - saved) / monthsLeft);
};

const mockGoals = [
  {
    id: 1,
    name: 'Vakantie naar Bali',
    category: 'vakantie',
    target: 2500,
    saved: 1800,
    deadline: '2024-06-15',
    description: 'Droomvakantie naar Indonesië'
  },
  {
    id: 2,
    name: 'Noodfonds',
    category: 'noodfonds',
    target: 5000,
    saved: 3200,
    deadline: '2024-12-31',
    description: 'Veiligheidsnet voor onverwachte uitgaven'
  },
  {
    id: 3,
    name: 'Nieuwe laptop',
    category: 'grote-aankoop',
    target: 1200,
    saved: 800,
    deadline: '2024-03-01',
    description: 'MacBook voor werk en studie'
  },
  {
    id: 4,
    name: 'Cursus Spaans',
    category: 'onderwijs',
    target: 800,
    saved: 600,
    deadline: '2024-04-01',
    description: 'Online cursus voor vakantie'
  },
  {
    id: 5,
    name: 'Verjaardagsfeest',
    category: 'feest',
    target: 300,
    saved: 300,
    deadline: '2024-02-15',
    description: '30e verjaardag vieren'
  }
];

const SavingsGoalsPage: React.FC = () => {
  const [goals] = useState(mockGoals);

  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);
  const totalRemaining = totalTarget - totalSaved;
  const activeCount = goals.filter(goal => getGoalStatus(goal.saved, goal.target, goal.deadline) === 'active').length;
  const completedCount = goals.filter(goal => getGoalStatus(goal.saved, goal.target, goal.deadline) === 'completed').length;
  const overdueCount = goals.filter(goal => getGoalStatus(goal.saved, goal.target, goal.deadline) === 'overdue').length;

  return (
    <SavingsContainer>
      <PageHeader>
        <PageTitle>Spaardoelen</PageTitle>
        <PageSubtitle>Plan en bereik je financiële doelen</PageSubtitle>
      </PageHeader>

      <HeaderActions>
        <AddButton>
          <Plus size={16} />
          Nieuw spaardoel
        </AddButton>
      </HeaderActions>

      <GoalsGrid>
        {goals.map((goal) => {
          const status = getGoalStatus(goal.saved, goal.target, goal.deadline);
          const percentage = (goal.saved / goal.target) * 100;
          const monthlyAmount = calculateMonthlyAmount(goal.target, goal.saved, goal.deadline);
          const StatusIcon = status === 'active' ? Target : status === 'completed' ? Award : TrendingUp;
          
          return (
            <GoalCard key={goal.id} status={status}>
              <GoalHeader>
                <GoalTitle>
                  <GoalIcon category={goal.category}>
                    {getCategoryIcon(goal.category)}
                  </GoalIcon>
                  <GoalName>{goal.name}</GoalName>
                </GoalTitle>
                <GoalActions>
                  <ActionButton title="Bewerken">
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton title="Instellingen">
                    <Target size={16} />
                  </ActionButton>
                </GoalActions>
              </GoalHeader>

              <GoalProgress>
                <ProgressHeader>
                  <ProgressAmount>€{goal.saved} van €{goal.target}</ProgressAmount>
                  <ProgressPercentage status={status}>{percentage.toFixed(1)}%</ProgressPercentage>
                </ProgressHeader>
                <ProgressBar percentage={percentage} status={status} />
              </GoalProgress>

              <GoalDetails>
                <DetailItem>
                  <DetailIcon>
                    <Calendar size={16} />
                  </DetailIcon>
                  <DetailInfo>
                    <DetailValue>{formatDate(goal.deadline)}</DetailValue>
                    <DetailLabel>Deadline</DetailLabel>
                  </DetailInfo>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <DollarSign size={16} />
                  </DetailIcon>
                  <DetailInfo>
                    <DetailValue>€{monthlyAmount}/maand</DetailValue>
                    <DetailLabel>Nodig</DetailLabel>
                  </DetailInfo>
                </DetailItem>
              </GoalDetails>

              <GoalStatus status={status}>
                <StatusIcon size={16} />
                {status === 'active' && 'Actief'}
                {status === 'completed' && 'Voltooid'}
                {status === 'overdue' && 'Achterstand'}
              </GoalStatus>
            </GoalCard>
          );
        })}
      </GoalsGrid>

      <SummarySection>
        <SummaryTitle>Spaardoelen overzicht</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <SummaryValue>€{totalTarget.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totaal doelbedrag</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>€{totalSaved.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totaal gespaard</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: totalRemaining > 0 ? '#17a2b8' : '#28a745' }}>
              €{totalRemaining.toFixed(2)}
            </SummaryValue>
            <SummaryLabel>Nog te sparen</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: '#17a2b8' }}>{activeCount}</SummaryValue>
            <SummaryLabel>Actieve doelen</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: '#28a745' }}>{completedCount}</SummaryValue>
            <SummaryLabel>Voltooid</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: '#dc3545' }}>{overdueCount}</SummaryValue>
            <SummaryLabel>Achterstand</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>
      </SummarySection>
    </SavingsContainer>
  );
};

export default SavingsGoalsPage; 