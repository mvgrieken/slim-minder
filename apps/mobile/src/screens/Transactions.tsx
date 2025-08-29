import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../session';
import { listTransactions, Transaction, createTransaction } from '../api';
import { formatCurrency } from '../../../packages/utils/src/currency';
import { SMButton } from '../../../packages/ui/src/components/SMButton';
import { format, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';
import { useForm, Controller } from 'react-hook-form';

interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  categoryId?: string;
}

export default function TransactionsScreen() {
  const { userId, loading, error } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: {
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const loadTransactions = async (refresh = false) => {
    if (!userId) return;
    
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const txs = await listTransactions(userId, {
        from: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
        to: format(new Date(), 'yyyy-MM-dd'),
        categoryId: filterCategory || undefined,
      });
      
      setTransactions(txs);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      Alert.alert('Fout', 'Kon transacties niet laden. Probeer het opnieuw.');
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) loadTransactions(true);
  }, [userId, filterCategory]);

  const filteredTransactions = transactions.filter(tx =>
    tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.merchant?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTransactions = filteredTransactions.reduce((groups, tx) => {
    const date = format(parseISO(tx.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  const onSubmitTransaction = async (data: TransactionFormData) => {
    if (!userId) return;

    try {
      const amount = parseFloat(data.amount);
      if (isNaN(amount)) {
        Alert.alert('Fout', 'Voer een geldig bedrag in');
        return;
      }

      await createTransaction(userId, {
        amount: -Math.abs(amount), // Always negative for expenses
        currency: 'EUR',
        date: data.date,
        description: data.description,
        categoryId: data.categoryId || null,
      });

      setShowAddModal(false);
      reset();
      loadTransactions(true);
      Alert.alert('Succes', 'Transactie toegevoegd');
    } catch (err) {
      console.error('Failed to create transaction:', err);
      Alert.alert('Fout', 'Kon transactie niet toevoegen. Probeer het opnieuw.');
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>
          {item.description || 'Onbekende transactie'}
        </Text>
        {item.merchant && (
          <Text style={styles.transactionMerchant}>{item.merchant}</Text>
        )}
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: item.amount < 0 ? '#DC2626' : '#16A34A' }
        ]}>
          {formatCurrency(Math.abs(item.amount))}
        </Text>
        <Text style={styles.amountLabel}>
          {item.amount < 0 ? 'Uitgave' : 'Inkomsten'}
        </Text>
      </View>
    </View>
  );

  const renderDateSection = ({ item: date }: { item: string }) => (
    <View style={styles.dateSection}>
      <Text style={styles.dateHeader}>
        {format(parseISO(date), 'EEEE d MMMM', { locale: nl })}
      </Text>
      {groupedTransactions[date].map((tx) => (
        <View key={tx.id}>
          {renderTransaction({ item: tx })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Sessie laden...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <SMButton
            title="Opnieuw proberen"
            onPress={() => window.location.reload()}
            variant="primary"
            style={{ marginTop: 16 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Transacties</Text>
        <SMButton
          title="Toevoegen"
          onPress={() => setShowAddModal(true)}
          variant="primary"
          size="small"
        />
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Zoeken in transacties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
        {filterCategory && (
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setFilterCategory(null)}
          >
            <Text style={styles.filterChipText}>Filter: {filterCategory}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Transactions List */}
      <FlatList
        data={sortedDates}
        renderItem={renderDateSection}
        keyExtractor={(date) => date}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadTransactions(true)} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Geen transacties</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterCategory 
                ? 'Geen transacties gevonden met de huidige filters'
                : 'Je hebt nog geen transacties. Voeg je eerste transactie toe!'
              }
            </Text>
            {!searchQuery && !filterCategory && (
              <SMButton
                title="Eerste transactie toevoegen"
                onPress={() => setShowAddModal(true)}
                variant="primary"
                style={{ marginTop: 12 }}
              />
            )}
          </View>
        }
      />

      {/* Add Transaction Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Transactie toevoegen</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalClose}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Controller
              control={control}
              name="description"
              rules={{ required: 'Beschrijving is verplicht' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Beschrijving</Text>
                  <TextInput
                    style={[styles.input, errors.description && styles.inputError]}
                    placeholder="Bijv. Boodschappen Albert Heijn"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.description && (
                    <Text style={styles.errorText}>{errors.description.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="amount"
              rules={{ 
                required: 'Bedrag is verplicht',
                pattern: {
                  value: /^\d+([.,]\d{1,2})?$/,
                  message: 'Voer een geldig bedrag in'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Bedrag (€)</Text>
                  <TextInput
                    style={[styles.input, errors.amount && styles.inputError]}
                    placeholder="0,00"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.amount && (
                    <Text style={styles.errorText}>{errors.amount.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="date"
              rules={{ required: 'Datum is verplicht' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Datum</Text>
                  <TextInput
                    style={[styles.input, errors.date && styles.inputError]}
                    placeholder="YYYY-MM-DD"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.date && (
                    <Text style={styles.errorText}>{errors.date.message}</Text>
                  )}
                </View>
              )}
            />

            <View style={styles.modalActions}>
              <SMButton
                title="Annuleren"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
              />
              <SMButton
                title="Toevoegen"
                onPress={handleSubmit(onSubmitTransaction)}
                variant="primary"
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  filterChipText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  transactionMerchant: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  amountLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalClose: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 32,
  },
});
