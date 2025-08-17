import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Edit, 
  Trash2,
  ArrowRight
} from 'react-feather';
import { useApp } from '../contexts/AppContext';
import { Transaction } from '../types/transaction';
import { 
  FullPageLoading, 
  TransactionSkeleton, 
  EmptyState as LoadingEmptyState, 
  ErrorState as LoadingErrorState 
} from '../components/ui/LoadingStates';

const TransactionsPage: React.FC = () => {
  const { transactions, categories, createTransaction, updateTransaction, deleteTransaction, loading, error } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || transaction.categories?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (formData: Partial<Transaction>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, formData);
    } else {
      createTransaction({
        ...formData,
        transaction_date: new Date().toISOString().split('T')[0],
        currency: 'EUR'
      } as Omit<Transaction, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) {
      deleteTransaction(id);
    }
  };

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

  // Loading state
  if (loading) {
    return <FullPageLoading message="Transacties laden..." />;
  }

  // Error state
  if (error) {
    return <LoadingErrorState title="Fout bij laden transacties" message={error} />;
  }

  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>Transacties</Title>
          <Subtitle>Beheer je inkomsten en uitgaven</Subtitle>
        </HeaderContent>
        <HeaderActions>
          <ActionButton onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={16} />
            Nieuwe Transactie
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard className="glass">
          <StatIcon>
            <ArrowRight size={24} />
          </StatIcon>
          <StatContent>
            <StatValue positive>€{totalIncome.toLocaleString()}</StatValue>
            <StatLabel>Inkomsten</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <ArrowRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </StatIcon>
          <StatContent>
            <StatValue negative>€{totalExpenses.toLocaleString()}</StatValue>
            <StatLabel>Uitgaven</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <Download size={24} />
          </StatIcon>
          <StatContent>
            <StatValue positive={netAmount >= 0}>
              €{Math.abs(netAmount).toLocaleString()}
            </StatValue>
            <StatLabel>{netAmount >= 0 ? 'Netto Winst' : 'Netto Verlies'}</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard className="glass">
          <StatIcon>
            <Filter size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{transactions.length}</StatValue>
            <StatLabel>Totaal Transacties</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <FiltersSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Zoek transacties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>

        <CategoryFilter
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">Alle Categorieën</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </CategoryFilter>
      </FiltersSection>

      <TransactionsList>
        {filteredTransactions.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Download size={48} />
            </EmptyIcon>
            <EmptyTitle>Geen transacties gevonden</EmptyTitle>
            <EmptyDescription>
              {transactions.length === 0 
                ? 'Voeg je eerste transactie toe om te beginnen'
                : 'Geen transacties voldoen aan je zoekcriteria'
              }
            </EmptyDescription>
            {transactions.length === 0 && (
              <EmptyAction onClick={() => setIsModalOpen(true)} className="btn-primary">
                <Plus size={16} />
                Eerste Transactie
              </EmptyAction>
            )}
          </EmptyState>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} className="card">
              <TransactionInfo>
                <TransactionHeader>
                  <TransactionTitle>{transaction.description}</TransactionTitle>
                  <TransactionCategory>{transaction.categories?.name || 'Onbekend'}</TransactionCategory>
                </TransactionHeader>
                <TransactionDate>
                  {new Date(transaction.transaction_date).toLocaleDateString('nl-NL')}
                </TransactionDate>
              </TransactionInfo>

              <TransactionAmount positive={transaction.amount > 0}>
                {transaction.amount > 0 ? '+' : ''}€{transaction.amount.toLocaleString()}
              </TransactionAmount>

              <TransactionActions>
                <ActionButton onClick={() => handleEdit(transaction)}>
                  <Edit size={16} />
                </ActionButton>
                <ActionButton onClick={() => handleDelete(transaction.id)}>
                  <Trash2 size={16} />
                </ActionButton>
              </TransactionActions>
            </TransactionCard>
          ))
        )}
      </TransactionsList>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
          categories={categories.map(cat => cat.name)}
        />
      )}
    </Container>
  );
};

// Modal Component
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Transaction>) => void;
  transaction?: Transaction | null;
  categories: string[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  categories
}) => {
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    category: transaction?.categories?.name || categories[0]
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
            {transaction ? 'Bewerk Transactie' : 'Nieuwe Transactie'}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Beschrijving</FormLabel>
            <FormInput
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Bijv. Boodschappen Albert Heijn"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Bedrag (€)</FormLabel>
            <FormInput
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
            <FormHint>Gebruik negatieve waarden voor uitgaven, positieve voor inkomsten</FormHint>
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

          <ModalActions>
            <CancelButton type="button" onClick={onClose}>
              Annuleren
            </CancelButton>
            <SubmitButton type="submit" className="btn-primary">
              {transaction ? 'Bijwerken' : 'Toevoegen'}
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

const StatValue = styled.div<{ positive?: boolean; negative?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, positive, negative }) => 
    positive ? theme.colors.successLight :
    negative ? theme.colors.errorLight :
    theme.colors.white
  };
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const FiltersSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray400};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
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

const CategoryFilter = styled.select`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.base};
  cursor: pointer;
  min-width: 200px;

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

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TransactionCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TransactionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const TransactionCategory = styled.div`
  background: ${({ theme }) => theme.colors.gradientAccent};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const TransactionDate = styled.div`
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const TransactionAmount = styled.div<{ positive?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, positive }) => 
    positive ? theme.colors.successLight : theme.colors.errorLight
  };
  margin: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0;
  }
`;

const TransactionActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
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

const FormHint = styled.div`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSizes.sm};
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

export default TransactionsPage; 