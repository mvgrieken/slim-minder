import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  DollarSign,
  Calendar,
  Edit, 
  Trash2,
  Award,
  ArrowRight
} from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { SavingsGoal } from '../types/savingsGoal';

const SavingsGoalsPage: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  const categories = ['Reis', 'Auto', 'Huis', 'Onderwijs', 'Noodfonds', 'Investering', 'Overig'];

  const goalsWithProgress = savingsGoals.map(goal => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;
    const isCompleted = percentage >= 100;
    const isNearTarget = percentage >= 80;

    return {
      ...goal,
      percentage,
      remaining,
      isCompleted,
      isNearTarget
    };
  });

  const handleSubmit = (formData: Partial<SavingsGoal>) => {
    if (editingGoal) {
      updateSavingsGoal(editingGoal.id, formData);
    } else {
      addSavingsGoal(formData as SavingsGoal);
    }
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: SavingsGoal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Weet je zeker dat je dit spaardoel wilt verwijderen?')) {
      deleteSavingsGoal(id);
    }
  };

  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalRemaining = totalTarget - totalCurrent;
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Spaardoelen</Title>
          <Subtitle>Bereik je financiële dromen stap voor stap</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <ActionButton onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            Nieuw Spaardoel
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard className="glass">
          <StatIcon>
            <Target size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalTarget.toLocaleString()}</StatValue>
            <StatLabel>Totaal Doel</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalCurrent.toLocaleString()}</StatValue>
            <StatLabel>Opgespaard</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalRemaining.toLocaleString()}</StatValue>
            <StatLabel>Nog te sparen</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <Award size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{Math.round(overallProgress)}%</StatValue>
            <StatLabel>Voortgang</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <OverallProgress className="glass">
        <ProgressHeader>
          <ProgressTitle>Algemene Voortgang</ProgressTitle>
          <ProgressPercentage>{Math.round(overallProgress)}%</ProgressPercentage>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill percentage={overallProgress} />
        </ProgressBar>
        <ProgressDetails>
          <ProgressDetail>
            <DetailLabel>Opgespaard</DetailLabel>
            <DetailValue>€{totalCurrent.toLocaleString()}</DetailValue>
          </ProgressDetail>
          <ProgressDetail>
            <DetailLabel>Doel</DetailLabel>
            <DetailValue>€{totalTarget.toLocaleString()}</DetailValue>
          </ProgressDetail>
        </ProgressDetails>
      </OverallProgress>

      <GoalsGrid>
        {goalsWithProgress.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Target size={48} />
            </EmptyIcon>
            <EmptyTitle>Nog geen spaardoelen ingesteld</EmptyTitle>
            <EmptyDescription>
              Stel je eerste spaardoel in om te beginnen met sparen
            </EmptyDescription>
            <EmptyAction onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              Eerste Spaardoel
            </EmptyAction>
          </EmptyState>
        ) : (
          goalsWithProgress.map((goal) => (
            <GoalCard key={goal.id} className="card">
              <GoalHeader>
                <GoalInfo>
                  <GoalTitle>{goal.name}</GoalTitle>
                  <GoalCategory>{goal.category}</GoalCategory>
                </GoalInfo>
                <GoalActions>
                  <ActionButton onClick={() => handleEdit(goal)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(goal.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </GoalActions>
              </GoalHeader>

              <GoalProgress>
                <ProgressBar>
                  <ProgressFill 
                    percentage={Math.min(goal.percentage, 100)} 
                    isCompleted={goal.isCompleted}
                  />
                </ProgressBar>
                <ProgressText>
                  €{goal.currentAmount.toLocaleString()} van €{goal.targetAmount.toLocaleString()}
                </ProgressText>
              </GoalProgress>

              <GoalDetails>
                <GoalDetail>
                  <DetailLabel>Doelbedrag</DetailLabel>
                  <DetailValue>€{goal.targetAmount.toLocaleString()}</DetailValue>
                </GoalDetail>
                <GoalDetail>
                  <DetailLabel>Huidig</DetailLabel>
                  <DetailValue>€{goal.currentAmount.toLocaleString()}</DetailValue>
                </GoalDetail>
                <GoalDetail>
                  <DetailLabel>Resterend</DetailLabel>
                  <DetailValue remaining={goal.remaining}>
                    €{goal.remaining.toLocaleString()}
                  </DetailValue>
                </GoalDetail>
              </GoalDetails>

              {goal.targetDate && (
                <GoalDeadline>
                  <Calendar size={16} />
                  <DeadlineText>
                    Doel: {new Date(goal.targetDate).toLocaleDateString('nl-NL')}
                  </DeadlineText>
                </GoalDeadline>
              )}

              {goal.isCompleted && (
                <CompletionBadge>
                  <Award size={16} />
                  Doel bereikt!
                </CompletionBadge>
              )}
            </GoalCard>
          ))
        )}
      </GoalsGrid>

      {isModalOpen && (
        <GoalModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingGoal(null);
          }}
          onSubmit={handleSubmit}
          goal={editingGoal}
          categories={categories}
        />
      )}
    </Container>
  );
};

// Modal Component
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SavingsGoal>) => void;
  goal?: SavingsGoal | null;
  categories: string[];
}

const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    category: goal?.category || categories[0],
    targetAmount: goal?.targetAmount || 0,
    currentAmount: goal?.currentAmount || 0,
    targetDate: goal?.targetDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} className="card">
        <ModalHeader>
          <ModalTitle>
            {goal ? 'Bewerk Spaardoel' : 'Nieuw Spaardoel'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Naam van het doel</FormLabel>
            <FormInput
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Bijv. Vakantie naar Bali"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Categorie</FormLabel>
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Doelbedrag (€)</FormLabel>
            <FormInput
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Huidig bedrag (€)</FormLabel>
            <FormInput
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Doeldatum (optioneel)</FormLabel>
            <FormInput
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </FormGroup>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Annuleren
            </CancelButton>
            <SubmitButton type="submit" className="btn-primary">
              {goal ? 'Bijwerken' : 'Toevoegen'}
            </SubmitButton>
          </ModalActions>
        </ModalForm>
      </ModalContent>
    </ModalOverlay>
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

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const OverallProgress = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const ProgressPercentage = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProgressFill = styled.div<{ percentage: number; isCompleted?: boolean }>`
  height: 100%;
  background: ${({ theme, isCompleted, percentage }) => 
    isCompleted ? theme.colors.gradientSuccess :
    percentage > 80 ? theme.colors.gradientAccent :
    theme.colors.gradientPrimary
  };
  width: ${({ percentage }) => percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;

const ProgressDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const ProgressDetail = styled.div`
  text-align: center;
`;

const DetailLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DetailValue = styled.div<{ remaining?: number }>`
  color: ${({ theme, remaining }) => 
    remaining !== undefined && remaining < 0 ? theme.colors.errorLight :
    remaining !== undefined && remaining < 100 ? theme.colors.warning :
    theme.colors.white
  };
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const GoalCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GoalInfo = styled.div``;

const GoalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GoalCategory = styled.div`
  background: ${({ theme }) => theme.colors.gradientAccent};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  display: inline-block;
`;

const GoalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const GoalProgress = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GoalDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GoalDetail = styled.div`
  text-align: center;
`;

const GoalDeadline = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DeadlineText = styled.span``;

const CompletionBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientSuccess};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.div`
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray300};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const EmptyAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.gradientSecondary};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormLabel = styled.label`
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  option {
    background: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const CancelButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export default SavingsGoalsPage; 