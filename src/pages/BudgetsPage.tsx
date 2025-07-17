import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Edit, 
  Trash2,
  DollarSign,
  PieChart,
  ArrowRight
} from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { Budget } from '../types/budget';

const BudgetsPage: React.FC = () => {
  const { budgets, transactions, createBudget, updateBudget, deleteBudget } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const categories = ['Voeding', 'Transport', 'Entertainment', 'Woning', 'Gezondheid', 'Shopping', 'Overig'];

  const budgetsWithProgress = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = (spent / budget.amount) * 100;
    const isOverBudget = percentage > 100;
    const isNearLimit = percentage > 80;

    return {
      ...budget,
      spent,
      percentage,
      isOverBudget,
      isNearLimit
    };
  });

  const handleSubmit = (formData: Partial<Budget>) => {
    if (editingBudget) {
      updateBudget(editingBudget.id, formData);
    } else {
      createBudget(formData as Omit<Budget, 'id' | 'created_at' | 'spent' | 'remaining'>);
    }
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Weet je zeker dat je dit budget wilt verwijderen?')) {
      deleteBudget(id);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetsWithProgress.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Budgets</Title>
          <Subtitle>Beheer je uitgavenlimieten per categorie</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <ActionButton onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            Nieuw Budget
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard className="glass">
          <StatIcon>
            <Target size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalBudget.toLocaleString()}</StatValue>
            <StatLabel>Totaal Budget</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalSpent.toLocaleString()}</StatValue>
            <StatLabel>Uitgegeven</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>€{totalRemaining.toLocaleString()}</StatValue>
            <StatLabel>Resterend</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <PieChart size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{Math.round((totalSpent / totalBudget) * 100)}%</StatValue>
            <StatLabel>Gebruikt</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <BudgetsGrid>
        {budgetsWithProgress.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Target size={48} />
            </EmptyIcon>
            <EmptyTitle>Nog geen budgets ingesteld</EmptyTitle>
            <EmptyDescription>
              Stel je eerste budget in om je uitgaven te monitoren
            </EmptyDescription>
            <EmptyAction onClick={() => setIsModalOpen(true)} className="btn-primary">
              <Plus size={16} />
              Eerste Budget
            </EmptyAction>
          </EmptyState>
        ) : (
          budgetsWithProgress.map((budget) => (
            <BudgetCard key={budget.id} className="card">
              <BudgetHeader>
                <BudgetInfo>
                  <BudgetCategory>{budget.category}</BudgetCategory>
                  <BudgetStatus isOverBudget={budget.isOverBudget} isNearLimit={budget.isNearLimit}>
                    {budget.isOverBudget ? (
                      <AlertTriangle size={16} />
                    ) : budget.isNearLimit ? (
                      <TrendingUp size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {budget.isOverBudget ? 'Over budget' : budget.isNearLimit ? 'Bijna op' : 'Op schema'}
                  </BudgetStatus>
                </BudgetInfo>
                <BudgetActions>
                  <ActionButton onClick={() => handleEdit(budget)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(budget.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </BudgetActions>
              </BudgetHeader>

              <BudgetProgress>
                <ProgressBar>
                  <ProgressFill 
                    percentage={Math.min(budget.percentage, 100)} 
                    isOverBudget={budget.isOverBudget}
                  />
                </ProgressBar>
                <ProgressText>
                  €{budget.spent.toLocaleString()} van €{budget.amount.toLocaleString()}
                </ProgressText>
              </BudgetProgress>

              <BudgetDetails>
                <BudgetAmount>
                  <AmountLabel>Budget</AmountLabel>
                  <AmountValue>€{budget.amount.toLocaleString()}</AmountValue>
                </BudgetAmount>
                <BudgetAmount>
                  <AmountLabel>Uitgegeven</AmountLabel>
                  <AmountValue>€{budget.spent.toLocaleString()}</AmountValue>
                </BudgetAmount>
                <BudgetAmount>
                  <AmountLabel>Resterend</AmountLabel>
                  <AmountValue remaining={budget.amount - budget.spent}>
                    €{(budget.amount - budget.spent).toLocaleString()}
                  </AmountValue>
                </BudgetAmount>
              </BudgetDetails>
            </BudgetCard>
          ))
        )}
      </BudgetsGrid>

      {isModalOpen && (
        <BudgetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
          onSubmit={handleSubmit}
          budget={editingBudget}
          categories={categories}
          existingCategories={budgets.map(b => b.category)}
        />
      )}
    </Container>
  );
};

// Modal Component
interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Budget>) => void;
  budget?: Budget | null;
  categories: string[];
  existingCategories: string[];
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  budget,
  categories,
  existingCategories
}) => {
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    amount: budget?.amount || 0
  });

  const availableCategories = categories.filter(cat => 
    !existingCategories.includes(cat) || cat === budget?.category
  );

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
            {budget ? 'Bewerk Budget' : 'Nieuw Budget'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Categorie</FormLabel>
            <FormSelect
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Selecteer categorie</option>
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel>Budget Bedrag (€)</FormLabel>
            <FormInput
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </FormGroup>

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Annuleren
            </CancelButton>
            <SubmitButton type="submit" className="btn-primary">
              {budget ? 'Bijwerken' : 'Toevoegen'}
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

const BudgetsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const BudgetCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const BudgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const BudgetInfo = styled.div``;

const BudgetCategory = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BudgetStatus = styled.div<{ isOverBudget?: boolean; isNearLimit?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, isOverBudget, isNearLimit }) => {
    if (isOverBudget) return theme.colors.errorLight;
    if (isNearLimit) return theme.colors.warning;
    return theme.colors.successLight;
  }};
`;

const BudgetActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const BudgetProgress = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ percentage: number; isOverBudget?: boolean }>`
  height: 100%;
  background: ${({ theme, isOverBudget, percentage }) => 
    isOverBudget ? theme.colors.gradientError :
    percentage > 80 ? theme.colors.gradientAccent :
    theme.colors.gradientSuccess
  };
  width: ${({ percentage }) => percentage}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;

const BudgetDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const BudgetAmount = styled.div`
  text-align: center;
`;

const AmountLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AmountValue = styled.div<{ remaining?: number }>`
  color: ${({ theme, remaining }) => 
    remaining !== undefined && remaining < 0 ? theme.colors.errorLight :
    remaining !== undefined && remaining < 100 ? theme.colors.warning :
    theme.colors.white
  };
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
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

export default BudgetsPage; 