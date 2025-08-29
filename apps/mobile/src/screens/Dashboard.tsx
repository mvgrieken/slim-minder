import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useSession } from '../session';
import { budgetsProgress, BudgetProgress } from '../api';
import { formatCurrency } from '@slim-minder/utils';

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

  if (loading) return <View style={styles.center}><ActivityIndicator /><Text style={styles.muted}>Sessieladen…</Text></View>;
  if (error) return <View style={styles.center}><Text style={{ color: '#a00' }}>{error}</Text></View>;

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={doRefresh} /> }>
      <Text style={styles.h1}>Overzicht</Text>
      <Text style={styles.sub}>Periode vanaf {periodStart}</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Budgetten</Text>
        {items.length === 0 && <Text style={styles.muted}>Nog geen budgetten. Voeg er een toe onder Categorieën/Budgetten.</Text>}
        {items.map((b) => {
          const spent = b.spent || 0;
          const ratio = Math.min(1, (b.limit ? spent / b.limit : 0));
          const color = ratio >= 1 ? '#dc2626' : ratio >= 0.8 ? '#ea580c' : '#16a34a';
          const status = ratio >= 1 ? 'Overschreden' : ratio >= 0.8 ? 'Bijna op' : 'OK';
          return (
            <View key={b.budgetId} style={styles.budgetRow}>
              <View style={styles.rowHeader}>
                <Text style={styles.cat}>{b.categoryName || 'Categorie'}</Text>
                <Text style={styles.amt}>{formatCurrency(spent)} / {formatCurrency(b.limit)}</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFg, { width: `${ratio * 100}%`, backgroundColor: color }]} />
              </View>
              <Text style={[styles.status, { color }]}>{status}</Text>
            </View>
          );
        })}
      </View>
      {refreshing && <Text style={styles.muted}>Verversen…</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  h1: { fontSize: 28, fontWeight: '700' },
  sub: { color: '#666', marginTop: 4 },
  h2: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f7f7f7', marginTop: 16 },
  budgetRow: { marginBottom: 12 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  cat: { fontSize: 16 },
  amt: { color: '#444' },
  progressBg: { height: 8, backgroundColor: '#e5e5e5', borderRadius: 999, overflow: 'hidden', marginTop: 6 },
  progressFg: { height: 8 },
  muted: { color: '#666' },
  status: { marginTop: 4, fontWeight: '600' },
});
