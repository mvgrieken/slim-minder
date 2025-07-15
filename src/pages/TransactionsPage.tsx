import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Filter, Download, Plus, Edit3, Tag } from 'lucide-react';

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

const mockTransactions = [
  {
    id: 1,
    description: 'Albert Heijn',
    amount: -45.67,
    date: '2024-01-15',
    category: 'boodschappen',
    type: 'expense' as const
  },
  {
    id: 2,
    description: 'Salaris ING Bank',
    amount: 3200.00,
    date: '2024-01-01',
    category: 'inkomsten',
    type: 'income' as const
  },
  {
    id: 3,
    description: 'NS Reizen',
    amount: -89.50,
    date: '2024-01-14',
    category: 'vervoer',
    type: 'expense' as const
  },
  {
    id: 4,
    description: 'Bioscoop Pathé',
    amount: -12.50,
    date: '2024-01-13',
    category: 'vrije-tijd',
    type: 'expense' as const
  },
  {
    id: 5,
    description: 'Huur appartement',
    amount: -800.00,
    date: '2024-01-01',
    category: 'wonen',
    type: 'expense' as const
  },
  {
    id: 6,
    description: 'Apotheek Centrum',
    amount: -23.45,
    date: '2024-01-12',
    category: 'gezondheid',
    type: 'expense' as const
  }
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions] = useState(mockTransactions);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netAmount = totalIncome - totalExpenses;

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
          
          <ActionButton>
            <Plus size={16} />
            Toevoegen
          </ActionButton>
        </ControlsGrid>
      </ControlsSection>

      <TransactionsList>
        {filteredTransactions.map((transaction) => (
          <TransactionItem key={transaction.id} type={transaction.type}>
            <TransactionIcon category={transaction.category}>
              {getCategoryIcon(transaction.category)}
            </TransactionIcon>
            
            <TransactionInfo>
              <TransactionDescription>{transaction.description}</TransactionDescription>
              <TransactionDate>{new Date(transaction.date).toLocaleDateString('nl-NL')}</TransactionDate>
            </TransactionInfo>
            
            <TransactionCategory>
              <Tag size={14} />
              {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
            </TransactionCategory>
            
            <TransactionAmount type={transaction.type}>
              {transaction.type === 'income' ? '+' : '-'}€{Math.abs(transaction.amount).toFixed(2)}
            </TransactionAmount>
            
            <TransactionActions>
              <ActionIcon title="Bewerken">
                <Edit3 size={16} />
              </ActionIcon>
              <ActionIcon title="Categorie wijzigen">
                <Tag size={16} />
              </ActionIcon>
            </TransactionActions>
          </TransactionItem>
        ))}
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
    </TransactionsContainer>
  );
};

export default TransactionsPage; 