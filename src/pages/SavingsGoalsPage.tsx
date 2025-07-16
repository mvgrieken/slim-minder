import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit3, Target, TrendingUp, Calendar, DollarSign, Award, X, Save, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

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
      'feest': '#f8d7da',
      'huis': '#e2e3e5',
      'auto': '#d1ecf1'
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
      'feest': '#dc3545',
      'huis': '#6c757d',
      'auto': '#17a2b8'
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

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  
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
    'vakantie': '🏖️',
    'noodfonds': '🛡️',
    'grote-aankoop': '🛒',
    'onderwijs': '📚',
    'pensioen': '💰',
    'feest': '🎉',
    'huis': '🏠',
    'auto': '🚗'
  };
  return icons[category] || '💰';
};

const categories = [
  { value: 'vakantie', label: 'Vakantie' },
  { value: 'noodfonds', label: 'Noodfonds' },
  { value: 'grote-aankoop', label: 'Grote aankoop' },
  { value: 'onderwijs', label: 'Onderwijs' },
  { value: 'pensioen', label: 'Pensioen' },
  { value: 'feest', label: 'Feest' },
  { value: 'huis', label: 'Huis' },
  { value: 'auto', label: 'Auto' }
];

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

const SavingsGoalsPage: React.FC = () => {
  const { savingsGoals, loading, error, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, user } = useApp();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'vakantie',
    target_amount: '',
    current_amount: '',
    deadline: '',
    description: ''
  });

  const openModal = (goal?: any) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData({
        name: goal.name,
        category: goal.category,
        target_amount: goal.target_amount.toString(),
        current_amount: goal.current_amount.toString(),
        deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        description: goal.description || ''
      });
    } else {
      setEditingGoal(null);
      setFormData({
        name: '',
        category: 'vakantie',
        target_amount: '',
        current_amount: '',
        deadline: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    setFormData({
      name: '',
      category: 'vakantie',
      target_amount: '',
      current_amount: '',
      deadline: '',
      description: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      // Check if user is authenticated
      if (!user || !user.id) {
        throw new Error('Je moet ingelogd zijn om een spaardoel op te slaan');
      }
      
      const goalData = {
        name: formData.name,
        category: formData.category,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount),
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        description: formData.description,
        user_id: user.id
      };

      if (editingGoal) {
        await updateSavingsGoal(editingGoal.id, goalData);
      } else {
        await createSavingsGoal(goalData);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving savings goal:', error);
      alert(`Fout bij het opslaan van spaardoel: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (window.confirm('Weet je zeker dat je dit spaardoel wilt verwijderen?')) {
      try {
        await deleteSavingsGoal(goalId);
      } catch (error) {
        console.error('Error deleting savings goal:', error);
      }
    }
  };

  if (loading) {
    return (
      <SavingsContainer>
        <LoadingSpinner>Spaardoelen laden...</LoadingSpinner>
      </SavingsContainer>
    );
  }

  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalRemaining = totalTarget - totalSaved;
  const activeCount = savingsGoals.filter(goal => getGoalStatus(goal.current_amount, goal.target_amount, goal.deadline || '')).length;
  const completedCount = savingsGoals.filter(goal => getGoalStatus(goal.current_amount, goal.target_amount, goal.deadline || '') === 'completed').length;
  const overdueCount = savingsGoals.filter(goal => getGoalStatus(goal.current_amount, goal.target_amount, goal.deadline || '') === 'overdue').length;

  return (
    <SavingsContainer>
      <PageHeader>
        <PageTitle>Spaardoelen</PageTitle>
        <PageSubtitle>Plan en bereik je financiële doelen</PageSubtitle>
      </PageHeader>

      {error && <ErrorMessage>Fout bij het laden van spaardoelen: {error}</ErrorMessage>}

      <HeaderActions>
        <AddButton onClick={() => openModal()}>
          <Plus size={16} />
          Nieuw spaardoel
        </AddButton>
      </HeaderActions>

      <GoalsGrid>
        {savingsGoals.map((goal) => {
          const status = getGoalStatus(goal.current_amount, goal.target_amount, goal.deadline || '');
          const percentage = (goal.current_amount / goal.target_amount) * 100;
          const monthlyAmount = goal.deadline ? calculateMonthlyAmount(goal.target_amount, goal.current_amount, goal.deadline) : 0;
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
                  <ActionButton title="Bewerken" onClick={() => openModal(goal)}>
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton title="Verwijderen" onClick={() => handleDelete(goal.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </GoalActions>
              </GoalHeader>

              <GoalProgress>
                <ProgressHeader>
                  <ProgressAmount>€{goal.current_amount.toFixed(2)} van €{goal.target_amount.toFixed(2)}</ProgressAmount>
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
                    <DetailValue>
                      {goal.deadline ? formatDate(goal.deadline) : 'Geen deadline'}
                    </DetailValue>
                    <DetailLabel>Deadline</DetailLabel>
                  </DetailInfo>
                </DetailItem>
                <DetailItem>
                  <DetailIcon>
                    <DollarSign size={16} />
                  </DetailIcon>
                  <DetailInfo>
                    <DetailValue>
                      {goal.deadline ? `€${monthlyAmount}/maand` : 'Geen deadline'}
                    </DetailValue>
                    <DetailLabel>Nodig</DetailLabel>
                  </DetailInfo>
                </DetailItem>
              </GoalDetails>

              {goal.description && (
                <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#6c757d' }}>
                  {goal.description}
                </div>
              )}

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

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingGoal ? 'Spaardoel bewerken' : 'Nieuw spaardoel'}
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
                placeholder="Bijv. Vakantie naar Bali"
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
              <Label htmlFor="target_amount">Doelbedrag (€)</Label>
              <Input
                id="target_amount"
                name="target_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.target_amount}
                onChange={handleInputChange}
                required
                placeholder="2500.00"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="current_amount">Huidig bedrag (€)</Label>
              <Input
                id="current_amount"
                name="current_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.current_amount}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="deadline">Deadline (optioneel)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Beschrijving (optioneel)</Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Beschrijf je spaardoel..."
              />
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
                    {editingGoal ? 'Bijwerken' : 'Toevoegen'}
                  </>
                )}
              </Button>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>
    </SavingsContainer>
  );
};

export default SavingsGoalsPage; 