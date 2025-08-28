import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, RefreshControl } from 'react-native';
import { useSession } from '../session';
import { listTransactions, createTransaction, listCategories, Category, Transaction, deleteTransaction, updateTransaction } from '../api';
import { formatCurrency } from '../../../packages/utils/src/currency';
import { useToast } from '../toast';

export default function TransactionsScreen() {
  const { userId } = useSession();
  const [items, setItems] = useState<Transaction[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState<string | null>(null);
  const toast = useToast();

  async function refresh() {
    if (!userId) return;
    setLoading(true);
    try {
      const [tx, c] = await Promise.all([
        listTransactions(userId),
        listCategories(userId),
      ]);
      setItems(tx);
      setCats(c.filter(x => !x.archived));
    } catch (e: any) {
      toast.show(`Laden mislukt: ${e.message || e}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [userId]);

  async function onAdd() {
    if (!userId) return;
    const val = parseFloat(amount);
    if (!isFinite(val) || val <= 0) { toast.show('Voer een geldig bedrag in', 'error'); return; }
    const date = new Date().toISOString();
    try {
      await createTransaction(userId, { amount: val, currency: 'EUR', date, categoryId: selectedCat, description: desc || undefined });
      setAmount(''); setDesc(''); setSelectedCat(null);
      toast.show('Transactie toegevoegd', 'success');
      refresh();
    } catch (e: any) {
      toast.show(`Toevoegen mislukt: ${e.message || e}`, 'error');
    }
  }

  const catName = (id?: string | null) => cats.find(c => c.id === id)?.name || '—';

  async function onDeleteTx(id: string) {
    if (!userId) return;
    try {
      await deleteTransaction(userId, id);
      toast.show('Transactie verwijderd', 'success');
      refresh();
    } catch (e: any) {
      toast.show(`Verwijderen mislukt: ${e.message || e}`, 'error');
    }
  }

  function startEdit(tx: Transaction) {
    setEditingId(tx.id);
    setEditAmount(String(tx.amount));
    setEditDesc(tx.description || '');
    setEditCat(tx.categoryId || null);
  }

  async function saveEdit() {
    if (!userId || !editingId) return;
    const val = parseFloat(editAmount);
    if (!isFinite(val) || val <= 0) { toast.show('Voer een geldig bedrag in', 'error'); return; }
    try {
      await updateTransaction(userId, editingId, { amount: val, description: editDesc || undefined, categoryId: editCat });
      toast.show('Transactie bijgewerkt', 'success');
      setEditingId(null);
      refresh();
    } catch (e: any) {
      toast.show(`Bijwerken mislukt: ${e.message || e}`, 'error');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Transacties</Text>

      <View style={styles.card}>
        <Text style={styles.h2}>Nieuwe transactie</Text>
        <View style={styles.row}>
          <TextInput placeholder="Bedrag (EUR)" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} />
          <TextInput placeholder="Omschrijving (optioneel)" value={desc} onChangeText={setDesc} style={styles.input} />
        </View>
      <FlatList
        data={cats}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 8 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedCat(item.id)} style={[styles.pill, selectedCat === item.id && styles.pillSel]}>
              <Text style={[styles.pillTxt, selectedCat === item.id && styles.pillTxtSel]}>{item.name}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.muted}>Geen categorieën</Text>}
        />
        <Pressable style={[styles.btn, { marginTop: 10 }]} onPress={onAdd}><Text style={styles.btnTxt}>Opslaan</Text></Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        style={{ marginTop: 12 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            {editingId === item.id ? (
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <TextInput value={editAmount} onChangeText={setEditAmount} keyboardType="numeric" style={[styles.input, { flex: 0.6 }]} />
                  <TextInput value={editDesc} onChangeText={setEditDesc} placeholder="Omschrijving" style={[styles.input, { flex: 1 }]} />
                </View>
                <FlatList data={cats} keyExtractor={(i) => i.id} horizontal style={{ marginTop: 6 }} renderItem={({ item: c }) => (
                  <Pressable onPress={() => setEditCat(c.id)} style={[styles.pill, editCat === c.id && styles.pillSel]}>
                    <Text style={[styles.pillTxt, editCat === c.id && styles.pillTxtSel]}>{c.name}</Text>
                  </Pressable>
                )} />
                <View style={[styles.row, { marginTop: 6 }]}>
                  <Pressable onPress={saveEdit} style={styles.btn}><Text style={styles.btnTxt}>Opslaan</Text></Pressable>
                  <Pressable onPress={() => setEditingId(null)}><Text style={styles.link}>Annuleer</Text></Pressable>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                <Text style={styles.txDesc}>{item.description || item.merchant || 'Transactie'}</Text>
                <Text style={styles.muted}>{new Date(item.date).toLocaleDateString('nl-NL')} • {catName(item.categoryId)}</Text>
              </View>
            )}
            {editingId !== item.id && (
              <>
                <Text style={styles.txAmt}>{formatCurrency(item.amount)}</Text>
                <Pressable onPress={() => startEdit(item)}><Text style={styles.link}>Wijzig</Text></Pressable>
                <Pressable onPress={() => onDeleteTx(item.id)}><Text style={styles.linkDanger}>Verwijder</Text></Pressable>
              </>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>Nog geen transacties.</Text>}
      />
      {loading && <Text style={styles.muted}>Laden…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  h1: { fontSize: 24, fontWeight: '700' },
  h2: { fontSize: 18, fontWeight: '600' },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f7f7f7', marginTop: 12 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, height: 44 },
  btn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start' },
  btnTxt: { color: '#fff', fontWeight: '600' },
  link: { color: '#2563eb', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  linkDanger: { color: '#b91c1c', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  muted: { color: '#666' },
  pill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: '#e5e7eb', marginRight: 8 },
  pillSel: { backgroundColor: '#111827' },
  pillTxt: { color: '#111827' },
  pillTxtSel: { color: '#fff' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  txDesc: { fontSize: 16 },
  txAmt: { fontWeight: '700' },
});
