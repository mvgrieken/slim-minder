import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit3, Target, TrendingUp, AlertTriangle, CheckCircle, X, Save, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

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

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        `;
      case 'secondary':
        return `
          background: #6c757d;
          color: white;
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
        `;
      default:
        return `
          background: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #667eea;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
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

const categories = [
  { value: 'boodschappen', label: 'Boodschappen' },
  { value: 'vervoer', label: 'Vervoer' },
  { value: 'vrije-tijd', label: 'Vrije tijd' },
  { value: 'wonen', label: 'Wonen' },
  { value: 'gezondheid', label: 'Gezondheid' },
  { value: 'kleding', label: 'Kleding' },
  { value: 'onderwijs', label: 'Onderwijs' }
];

const BudgetsPage: React.FC = () => {
  const { budgets, loading, error, createBudget, updateBudget, deleteBudget, user } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'boodschappen',
    budget: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
  });

  const openModal = (budget?: any) => {
    if (budget) {
      setEditingBudget(budget);
      setFormData({
        name: budget.name,
        category: budget.category,
        budget: budget.budget.toString(),
        period: budget.period
      });
    } else {
      setEditingBudget(null);
      setFormData({
        name: '',
        category: 'boodschappen',
        budget: '',
        period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({
      name: '',
      category: 'boodschappen',
      budget: '',
      period: 'monthly' as 'monthly' | 'weekly' | 'yearly'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔄 Starting budget save...');
      console.log('📝 Form data:', formData);
      console.log('👤 User:', user);
      
      const budgetData = {
        name: formData.name,
        category: formData.category,
        budget: parseFloat(formData.budget),
        period: formData.period,
        user_id: user?.id || ''
      };

      console.log('💾 Budget data to save:', budgetData);

      if (editingBudget) {
        console.log('✏️ Updating existing budget:', editingBudget.id);
        await updateBudget(editingBudget.id, budgetData);
        console.log('✅ Budget updated successfully');
      } else {
        console.log('➕ Creating new budget');
        await createBudget(budgetData);
        console.log('✅ Budget created successfully');
      }

      closeModal();
    } catch (error) {
      console.error('❌ Error saving budget:', error);
      alert(`Fout bij het opslaan van budget: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (budgetId: number) => {
    if (window.confirm('Weet je zeker dat je dit budget wilt verwijderen?')) {
      try {
        await deleteBudget(budgetId.toString());
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  if (loading) {
    return (
      <BudgetsContainer>
        <LoadingSpinner>Budgetten laden...</LoadingSpinner>
      </BudgetsContainer>
    );
  }

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

      {error && <ErrorMessage>Fout bij het laden van budgetten: {error}</ErrorMessage>}

      <HeaderActions>
        <AddButton onClick={() => openModal()}>
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
                  <ActionButton title="Bewerken" onClick={() => openModal(budget)}>
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton title="Verwijderen" onClick={() => handleDelete(parseInt(budget.id))}>
                    <Trash2 size={16} />
                  </ActionButton>
                </BudgetActions>
              </BudgetHeader>

              <BudgetProgress>
                <ProgressHeader>
                  <ProgressAmount>€{budget.spent.toFixed(2)} van €{budget.budget.toFixed(2)}</ProgressAmount>
                  <ProgressPercentage status={status}>{((budget.spent / budget.budget) * 100).toFixed(1)}%</ProgressPercentage>
                </ProgressHeader>
                <ProgressBar percentage={(budget.spent / budget.budget) * 100} status={status} />
              </BudgetProgress>

              <BudgetDetails>
                <DetailItem>
                  <DetailValue>€{budget.remaining.toFixed(2)}</DetailValue>
                  <DetailLabel>Resterend</DetailLabel>
                </DetailItem>
                <DetailItem>
                  <DetailValue>€{budget.spent.toFixed(2)}</DetailValue>
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

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingBudget ? 'Budget bewerken' : 'Nieuw budget'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">Naam</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Bijv. Boodschappen"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="category">Categorie</Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="budget">Budget bedrag (€)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={handleInputChange}
                required
                placeholder="500.00"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="period">Periode</Label>
              <Select
                id="period"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                required
              >
                <option value="monthly">Maandelijks</option>
                <option value="weekly">Wekelijks</option>
                <option value="yearly">Jaarlijks</option>
              </Select>
            </FormGroup>

            <FormActions>
              <Button type="button" variant="secondary" onClick={closeModal}>
                Annuleren
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div>Opslaan...</div>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingBudget ? 'Bijwerken' : 'Toevoegen'}
                  </>
                )}
              </Button>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>
    </BudgetsContainer>
  );
};

export default BudgetsPage; 