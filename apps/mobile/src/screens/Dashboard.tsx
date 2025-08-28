import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useSession } from '../session';
import { budgetsProgress, BudgetProgress } from '../api';

// Currency formatting utility
const formatCurrency = (amount: number, currency: string = 'EUR', locale: string = 'nl-NL') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

export default function DashboardScreen() {
  const { userId, loading, error } = useSession();
  const [items, setItems] = useState<BudgetProgress[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const periodStart = useMemo(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10), []);

  async function doRefresh() {
    if (!userId) return;
    setRefreshing(true);
    try {
      const p = await budgetsProgress(userId, periodStart);
      setItems(p);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { if (userId) doRefresh(); }, [userId, periodStart]);

  if (loading) return (
    <View className="flex-1 justify-center items-center p-4">
      <ActivityIndicator size="large" className="mb-4" />
      <Text className="text-gray-600">Sessie laden…</Text>
    </View>
  );
  
  if (error) return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-red-600 text-center">{error}</Text>
    </View>
  );

  const totalBudget = items.reduce((sum, item) => sum + Number(item.limit), 0);
  const totalSpent = items.reduce((sum, item) => sum + Number(item.spent || 0), 0);
  const overallProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={doRefresh} />}
    >
      {/* Header */}
      <View className="px-6 py-8 bg-white">
        <Text className="text-3xl font-bold text-gray-900">Dashboard</Text>
        <Text className="text-gray-600 mt-1">Periode vanaf {new Date(periodStart).toLocaleDateString()}</Text>
      </View>

      {/* Summary Cards */}
      <View className="px-6 py-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Overzicht deze maand</Text>
          <View className="flex-row justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</Text>
              <Text className="text-gray-600">Uitgegeven</Text>
            </View>
            <View className="flex-1 items-end">
              <Text className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</Text>
              <Text className="text-gray-600">Budget</Text>
            </View>
          </View>
          
          {/* Overall Progress Bar */}
          <View className="bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
            <View 
              className={`h-full rounded-full ${
                overallProgress >= 100 ? 'bg-red-500' : 
                overallProgress >= 80 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </View>
          <Text className={`text-sm font-medium ${
            overallProgress >= 100 ? 'text-red-600' : 
            overallProgress >= 80 ? 'text-yellow-600' : 
            'text-green-600'
          }`}>
            {overallProgress.toFixed(1)}% van budget gebruikt
          </Text>
        </View>

        {/* Budget Categories */}
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Budgetten per categorie</Text>
          
          {items.length === 0 ? (
            <View className="py-8 items-center">
              <Text className="text-gray-600 text-center mb-4">Nog geen budgetten ingesteld</Text>
              <TouchableOpacity className="bg-primary-500 px-6 py-3 rounded-lg">
                <Text className="text-white font-medium">Voeg budget toe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            items.map((budget) => {
              const spent = Number(budget.spent || 0);
              const limit = Number(budget.limit);
              const ratio = limit > 0 ? spent / limit : 0;
              const percentage = Math.min(ratio * 100, 100);
              
              const getStatusColor = () => {
                if (ratio >= 1) return 'bg-red-500';
                if (ratio >= 0.8) return 'bg-yellow-500';
                return 'bg-green-500';
              };

              const getStatusText = () => {
                if (ratio >= 1) return 'Overschreden';
                if (ratio >= 0.8) return 'Bijna op';
                return 'Op schema';
              };

              const getStatusTextColor = () => {
                if (ratio >= 1) return 'text-red-600';
                if (ratio >= 0.8) return 'text-yellow-600';
                return 'text-green-600';
              };

              return (
                <TouchableOpacity key={budget.budgetId} className="mb-6 last:mb-0">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-medium text-gray-900">
                      {budget.categoryName || 'Categorie'}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {formatCurrency(spent)} / {formatCurrency(limit)}
                    </Text>
                  </View>
                  
                  <View className="bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                    <View 
                      className={`h-full rounded-full ${getStatusColor()}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className={`text-sm font-medium ${getStatusTextColor()}`}>
                      {getStatusText()}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatCurrency(limit - spent)} resterend
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>

      {refreshing && (
        <View className="py-4 items-center">
          <Text className="text-gray-600">Verversen…</Text>
        </View>
      )}
    </ScrollView>
  );
}
