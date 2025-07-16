import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Filter, Download, Plus, Edit3, Tag, Trash2, X, Save } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../services/api';

const TransactionsContainer = styled.div`
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

const ControlsSection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const FilterButton = styled.button`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  
  &:hover {
    background: #e9ecef;
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
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

const TransactionsList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TransactionItem = styled.div<{ type: 'income' | 'expense' }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f1f3f4;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TransactionIcon = styled.div<{ category: string }>`
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
      'inkomsten': '#d4edda'
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
      'inkomsten': '#28a745'
    };
    return colors[category] || '#6c757d';
  }};
`;

const TransactionInfo = styled.div``;

const TransactionDescription = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const TransactionDate = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const TransactionCategory = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #6c757d;
`;

const TransactionAmount = styled.div<{ type: 'income' | 'expense' }>`
  font-weight: bold;
  font-size: 1.1rem;
  color: ${({ type }) => type === 'income' ? '#28a745' : '#dc3545'};
  text-align: right;
`;

const TransactionActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionIcon = styled.button`
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

const SummarySection = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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

// Modal styles
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
  border-radius: 12px;
  padding: 30px;
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
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
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
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          &:hover { transform: translateY(-1px); }
        `;
      case 'secondary':
        return `
          background: #f8f9fa;
          color: #333;
          border: 2px solid #e9ecef;
          &:hover { background: #e9ecef; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Predefined categories
const categories = [
  'Boodschappen',
  'Vervoer', 
  'Vrije tijd',
  'Wonen',
  'Gezondheid',
  'Inkomen',
  'Salaris',
  'Overig'
];

// Transaction form interface
interface TransactionForm {
  description: string;
  amount: string;
  category: string;
  transaction_date: string;
}

const getCategoryIcon = (category: string) => {
  const icons: { [key: string]: string } = {
    'boodschappen': '🛒',
    'vervoer': '🚗',
    'vrije-tijd': '🎬',
    'wonen': '🏠',
    'gezondheid': '💊',
    'inkomsten': '💰'
  };
  return icons[category] || '📄';
};

const TransactionsPage: React.FC = () => {
  const { user } = useAuth();
  const { transactions, loading, error, createTransaction, updateTransaction, deleteTransaction } = useApp();
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TransactionForm>({
    description: '',
    amount: '',
    category: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  // Form handlers
  const handleInputChange = (field: keyof TransactionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setEditingTransaction(null);
  };

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        transaction_date: transaction.transaction_date
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) throw new Error('Ongeldig bedrag');

      const transactionData = {
        user_id: user.id,
        description: formData.description,
        amount: editingTransaction ? 
          (editingTransaction.amount > 0 ? amount : -amount) : 
          (amount > 0 ? amount : -amount),
        category: formData.category,
        transaction_date: formData.transaction_date
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      closeModal();
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Er ging iets mis bij het opslaan van de transactie');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (transactionId: string) => {
    if (!window.confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) return;

    try {
      await deleteTransaction(transactionId);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Er ging iets mis bij het verwijderen van de transactie');
    }
  };

  return (
    <TransactionsContainer>
      <PageHeader>
        <PageTitle>Transacties</PageTitle>
        <PageSubtitle>Overzicht van al je banktransacties</PageSubtitle>
      </PageHeader>

      <ControlsSection>
        <ControlsGrid>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Zoek in transacties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon>
              <Search size={20} />
            </SearchIcon>
          </SearchContainer>
          
          <FilterButton>
            <Filter size={16} />
            Filter
          </FilterButton>
          
          <ActionButton>
            <Download size={16} />
            Export
          </ActionButton>
          
          <ActionButton onClick={() => openModal()}>
            <Plus size={16} />
            Toevoegen
          </ActionButton>
        </ControlsGrid>
      </ControlsSection>

      <TransactionsList>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <LoadingSpinner />
            <p>Transacties laden...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#dc3545' }}>
            <p>Fout bij het laden van transacties: {error}</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            <p>Geen transacties gevonden</p>
            <ActionButton onClick={() => openModal()} style={{ marginTop: '20px' }}>
              <Plus size={16} />
              Eerste transactie toevoegen
            </ActionButton>
          </div>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} type={transaction.amount > 0 ? 'income' : 'expense'}>
              <TransactionIcon category={transaction.category}>
                {getCategoryIcon(transaction.category)}
              </TransactionIcon>
              
              <TransactionInfo>
                <TransactionDescription>{transaction.description}</TransactionDescription>
                <TransactionDate>{new Date(transaction.transaction_date).toLocaleDateString('nl-NL')}</TransactionDate>
              </TransactionInfo>
              
              <TransactionCategory>
                <Tag size={14} />
                {transaction.category}
              </TransactionCategory>
              
              <TransactionAmount type={transaction.amount > 0 ? 'income' : 'expense'}>
                {transaction.amount > 0 ? '+' : '-'}€{Math.abs(transaction.amount).toFixed(2)}
              </TransactionAmount>
              
              <TransactionActions>
                <ActionIcon title="Bewerken" onClick={() => openModal(transaction)}>
                  <Edit3 size={16} />
                </ActionIcon>
                <ActionIcon title="Verwijderen" onClick={() => handleDelete(transaction.id)}>
                  <Trash2 size={16} />
                </ActionIcon>
              </TransactionActions>
            </TransactionItem>
          ))
        )}
      </TransactionsList>

      <SummarySection>
        <SummaryGrid>
          <SummaryCard>
            <SummaryValue>€{totalIncome.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totale inkomsten</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>€{totalExpenses.toFixed(2)}</SummaryValue>
            <SummaryLabel>Totale uitgaven</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue style={{ color: netAmount >= 0 ? '#28a745' : '#dc3545' }}>
              {netAmount >= 0 ? '+' : ''}€{netAmount.toFixed(2)}
            </SummaryValue>
            <SummaryLabel>Netto bedrag</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{filteredTransactions.length}</SummaryValue>
            <SummaryLabel>Aantal transacties</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>
      </SummarySection>

      {/* Transaction Modal */}
      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingTransaction ? 'Transactie bewerken' : 'Nieuwe transactie'}
            </ModalTitle>
            <CloseButton onClick={closeModal}>
              <X size={24} />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Beschrijving</Label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Bijv. Albert Heijn boodschappen"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Bedrag</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Categorie</Label>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">Selecteer categorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Datum</Label>
              <Input
                type="date"
                value={formData.transaction_date}
                onChange={(e) => handleInputChange('transaction_date', e.target.value)}
                required
              />
            </FormGroup>

            <FormActions>
              <Button type="button" variant="secondary" onClick={closeModal}>
                Annuleren
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    Opslaan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {editingTransaction ? 'Bijwerken' : 'Toevoegen'}
                  </>
                )}
              </Button>
            </FormActions>
          </Form>
        </ModalContent>
      </Modal>
    </TransactionsContainer>
  );
};

export default TransactionsPage; 