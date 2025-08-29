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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSession } from '../session';
import { 
  listCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  Category,
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  Budget
} from '../api';
import { formatCurrency } from '../../../packages/utils/src/currency';
import { SMButton } from '../../../packages/ui/src/components/SMButton';
import { useForm, Controller } from 'react-hook-form';

interface CategoryFormData {
  name: string;
  icon?: string;
}

interface BudgetFormData {
  limit: string;
  currency: string;
}

export default function CategoriesScreen() {
  const { userId, loading, error } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoryForm = useForm<CategoryFormData>({
    defaultValues: {
      name: '',
      icon: '',
    }
  });

  const budgetForm = useForm<BudgetFormData>({
    defaultValues: {
      limit: '',
      currency: 'EUR',
    }
  });

  const loadData = async (refresh = false) => {
    if (!userId) return;
    
    if (refresh) {
      setRefreshing(true);
    }

    try {
      const [cats, budgets] = await Promise.all([
        listCategories(userId),
        listBudgets(userId),
      ]);
      
      setCategories(cats.filter(c => !c.archived));
      setBudgets(budgets);
    } catch (err) {
      console.error('Failed to load data:', err);
      Alert.alert('Fout', 'Kon gegevens niet laden. Probeer het opnieuw.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId) loadData(true);
  }, [userId]);

  const onSubmitCategory = async (data: CategoryFormData) => {
    if (!userId) return;

    try {
      if (editingCategory) {
        await updateCategory(userId, editingCategory.id, data);
        Alert.alert('Succes', 'Categorie bijgewerkt');
      } else {
        await createCategory(userId, data.name, data.icon);
        Alert.alert('Succes', 'Categorie toegevoegd');
      }
      
      setShowCategoryModal(false);
      setEditingCategory(null);
      categoryForm.reset();
      loadData(true);
    } catch (err) {
      console.error('Failed to save category:', err);
      Alert.alert('Fout', 'Kon categorie niet opslaan. Probeer het opnieuw.');
    }
  };

  const onSubmitBudget = async (data: BudgetFormData) => {
    if (!userId || !selectedCategory) return;

    try {
      const limit = parseFloat(data.limit);
      if (isNaN(limit) || limit <= 0) {
        Alert.alert('Fout', 'Voer een geldig bedrag in');
        return;
      }

      if (editingBudget) {
        await updateBudget(userId, editingBudget.id, { limit, currency: data.currency });
        Alert.alert('Succes', 'Budget bijgewerkt');
      } else {
        await createBudget(userId, {
          categoryId: selectedCategory,
          limit,
          currency: data.currency,
          startsOn: new Date().toISOString(),
        });
        Alert.alert('Succes', 'Budget toegevoegd');
      }
      
      setShowBudgetModal(false);
      setEditingBudget(null);
      budgetForm.reset();
      loadData(true);
    } catch (err) {
      console.error('Failed to save budget:', err);
      Alert.alert('Fout', 'Kon budget niet opslaan. Probeer het opnieuw.');
    }
  };

  const onDeleteCategory = async (category: Category) => {
    Alert.alert(
      'Categorie verwijderen',
      `Weet je zeker dat je "${category.name}" wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`,
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(userId!, category.id);
              Alert.alert('Succes', 'Categorie verwijderd');
              loadData(true);
            } catch (err) {
              console.error('Failed to delete category:', err);
              Alert.alert('Fout', 'Kon categorie niet verwijderen. Probeer het opnieuw.');
            }
          }
        }
      ]
    );
  };

  const onDeleteBudget = async (budget: Budget) => {
    Alert.alert(
      'Budget verwijderen',
      'Weet je zeker dat je dit budget wilt verwijderen?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verwijderen',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBudget(userId!, budget.id);
              Alert.alert('Succes', 'Budget verwijderd');
              loadData(true);
            } catch (err) {
              console.error('Failed to delete budget:', err);
              Alert.alert('Fout', 'Kon budget niet verwijderen. Probeer het opnieuw.');
            }
          }
        }
      ]
    );
  };

  const openCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      categoryForm.reset({
        name: category.name,
        icon: category.icon || '',
      });
    } else {
      setEditingCategory(null);
      categoryForm.reset();
    }
    setShowCategoryModal(true);
  };

  const openBudgetModal = (categoryId: string, budget?: Budget) => {
    setSelectedCategory(categoryId);
    if (budget) {
      setEditingBudget(budget);
      budgetForm.reset({
        limit: budget.limit.toString(),
        currency: budget.currency,
      });
    } else {
      setEditingBudget(null);
      budgetForm.reset();
    }
    setShowBudgetModal(true);
  };

  const renderCategory = ({ item: category }: { item: Category }) => {
    const categoryBudget = budgets.find(b => b.categoryId === category.id);
    
    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryInfo}>
            {category.icon && (
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            )}
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
          <View style={styles.categoryActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openCategoryModal(category)}
            >
              <Text style={styles.actionText}>Bewerken</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={() => onDeleteCategory(category)}
            >
              <Text style={[styles.actionText, styles.dangerText]}>Verwijderen</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.budgetSection}>
          {categoryBudget ? (
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetLabel}>Budget:</Text>
              <Text style={styles.budgetAmount}>
                {formatCurrency(categoryBudget.limit)} {categoryBudget.currency}
              </Text>
              <TouchableOpacity
                style={styles.editBudgetButton}
                onPress={() => openBudgetModal(category.id, categoryBudget)}
              >
                <Text style={styles.editBudgetText}>Bewerken</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteBudgetButton}
                onPress={() => onDeleteBudget(categoryBudget)}
              >
                <Text style={styles.deleteBudgetText}>Verwijderen</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noBudget}>
              <Text style={styles.noBudgetText}>Geen budget ingesteld</Text>
              <SMButton
                title="Budget toevoegen"
                onPress={() => openBudgetModal(category.id)}
                variant="outline"
                size="small"
              />
            </View>
          )}
        </View>
      </View>
    );
  };

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
        <Text style={styles.title}>Categorieën & Budgetten</Text>
        <SMButton
          title="Categorie toevoegen"
          onPress={() => openCategoryModal()}
          variant="primary"
          size="small"
        />
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Geen categorieën</Text>
            <Text style={styles.emptyText}>
              Voeg je eerste categorie toe om je uitgaven te organiseren
            </Text>
            <SMButton
              title="Eerste categorie toevoegen"
              onPress={() => openCategoryModal()}
              variant="primary"
              style={{ marginTop: 12 }}
            />
          </View>
        }
      />

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingCategory ? 'Categorie bewerken' : 'Nieuwe categorie'}
            </Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.modalClose}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Controller
              control={categoryForm.control}
              name="name"
              rules={{ required: 'Naam is verplicht' }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Naam</Text>
                  <TextInput
                    style={[styles.input, categoryForm.formState.errors.name && styles.inputError]}
                    placeholder="Bijv. Boodschappen"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#94A3B8"
                  />
                  {categoryForm.formState.errors.name && (
                    <Text style={styles.errorText}>{categoryForm.formState.errors.name.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={categoryForm.control}
              name="icon"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Icoon (optioneel)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="🛒"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}
            />

            <View style={styles.modalActions}>
              <SMButton
                title="Annuleren"
                onPress={() => setShowCategoryModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
              />
              <SMButton
                title={editingCategory ? 'Bewerken' : 'Toevoegen'}
                onPress={categoryForm.handleSubmit(onSubmitCategory)}
                variant="primary"
                style={{ flex: 1, marginLeft: 8 }}
              />
        </View>
      </View>
        </SafeAreaView>
      </Modal>

      {/* Budget Modal */}
      <Modal
        visible={showBudgetModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingBudget ? 'Budget bewerken' : 'Nieuw budget'}
            </Text>
            <TouchableOpacity onPress={() => setShowBudgetModal(false)}>
              <Text style={styles.modalClose}>Sluiten</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Controller
              control={budgetForm.control}
              name="limit"
              rules={{ 
                required: 'Bedrag is verplicht',
                pattern: {
                  value: /^\d+([.,]\d{1,2})?$/,
                  message: 'Voer een geldig bedrag in'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Maandelijkse limiet</Text>
                  <TextInput
                    style={[styles.input, budgetForm.formState.errors.limit && styles.inputError]}
                    placeholder="0,00"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94A3B8"
                  />
                  {budgetForm.formState.errors.limit && (
                    <Text style={styles.errorText}>{budgetForm.formState.errors.limit.message}</Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={budgetForm.control}
              name="currency"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Valuta</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="EUR"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              )}
            />

            <View style={styles.modalActions}>
              <SMButton
                title="Annuleren"
                onPress={() => setShowBudgetModal(false)}
                variant="outline"
                style={{ flex: 1, marginRight: 8 }}
              />
              <SMButton
                title={editingBudget ? 'Bewerken' : 'Toevoegen'}
                onPress={budgetForm.handleSubmit(onSubmitBudget)}
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
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  actionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
  },
  dangerText: {
    color: '#DC2626',
  },
  budgetSection: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  editBudgetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#DBEAFE',
  },
  editBudgetText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  deleteBudgetButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#FEF2F2',
  },
  deleteBudgetText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  noBudget: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noBudgetText: {
    fontSize: 14,
    color: '#64748B',
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
