import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, RefreshControl } from 'react-native';
import { useSession } from '../session';
import { listCategories, createCategory, updateCategory, deleteCategory, Category, createBudget } from '../api';
import { useToast } from '../toast';
import { supabase } from '../supabase';

export default function CategoriesScreen() {
  const { userId } = useSession();
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [limit, setLimit] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [rename, setRename] = useState('');
  const toast = useToast();

  async function refresh() {
    if (!userId) return;
    setLoading(true);
    try {
      const list = await listCategories(userId);
      setCats(list.filter(c => !c.archived));
    } catch (e: any) {
      toast.show(`Laden mislukt: ${e.message || e}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, [userId]);

  async function onAdd() {
    if (!userId || !name.trim()) return;
    try {
      await createCategory(userId, name.trim());
      setName('');
      toast.show('Categorie toegevoegd', 'success');
      refresh();
    } catch (e: any) {
      toast.show(`Toevoegen mislukt: ${e.message || e}`, 'error');
    }
  }

  async function onArchive(id: string) {
    if (!userId) return;
    try {
      await updateCategory(userId, id, { archived: true });
      if (selectedCat === id) setSelectedCat(null);
      toast.show('Categorie gearchiveerd', 'success');
      refresh();
    } catch (e: any) {
      toast.show(`Archiveren mislukt: ${e.message || e}`, 'error');
    }
  }

  async function onCreateBudget() {
    if (!userId || !selectedCat) return;
    const val = parseFloat(limit);
    if (!isFinite(val) || val <= 0) return;
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10);
    try {
      await createBudget(userId, { categoryId: selectedCat, limit: val, currency: 'EUR', startsOn: firstOfMonth });
      setLimit('');
      setSelectedCat(null);
      toast.show('Budget aangemaakt', 'success');
    } catch (e: any) {
      toast.show(`Budget maken mislukt: ${e.message || e}`, 'error');
    }
  }

  async function onStartRename(cat: Category) {
    setRenamingId(cat.id);
    setRename(cat.name);
  }

  async function onSaveRename() {
    if (!renamingId || !userId) return;
    const newName = rename.trim();
    if (!newName) return;
    try {
      await updateCategory(userId, renamingId, { name: newName });
      toast.show('Categorie hernoemd', 'success');
      setRenamingId(null);
      setRename('');
      refresh();
    } catch (e: any) {
      toast.show(`Hernoemen mislukt: ${e.message || e}`, 'error');
    }
  }

  async function onDelete(id: string) {
    if (!userId) return;
    try {
      await deleteCategory(userId, id);
      if (selectedCat === id) setSelectedCat(null);
      toast.show('Categorie verwijderd', 'success');
      refresh();
    } catch (e: any) {
      toast.show(`Verwijderen mislukt: ${e.message || e}`, 'error');
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.h1}>Categorieën</Text>
        <Pressable onPress={async () => { await supabase.auth.signOut(); }}><Text style={styles.link}>Uitloggen</Text></Pressable>
      </View>
      <View style={styles.row}>
        <TextInput placeholder="Nieuwe categorie" value={name} onChangeText={setName} style={styles.input} />
        <Pressable disabled={!name.trim()} style={[styles.btn, !name.trim() && styles.btnDisabled]} onPress={onAdd}><Text style={styles.btnTxt}>Voeg toe</Text></Pressable>
      </View>

      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {renamingId === item.id ? (
              <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                <TextInput value={rename} onChangeText={setRename} style={[styles.input, { flex: 1 }]} />
                <Pressable style={styles.btn} onPress={onSaveRename}><Text style={styles.btnTxt}>Opslaan</Text></Pressable>
                <Pressable onPress={() => { setRenamingId(null); setRename(''); }}><Text style={styles.link}>Annuleer</Text></Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setSelectedCat(item.id)} style={{ flex: 1 }}>
                <Text style={[styles.item, selectedCat === item.id && styles.itemSel]}>{item.name}</Text>
              </Pressable>
            )}
            <Pressable onPress={() => onStartRename(item)}><Text style={styles.link}>Hernoem</Text></Pressable>
            <Pressable onPress={() => onArchive(item.id)}><Text style={styles.linkWarn}>Archiveer</Text></Pressable>
            <Pressable onPress={() => onDelete(item.id)}><Text style={styles.linkDanger}>Verwijder</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.muted}>Nog geen categorieën.</Text>}
        style={{ marginTop: 12 }}
      />

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={styles.h2}>Budget voor geselecteerde categorie</Text>
        <Text style={styles.muted}>Selecteer een categorie hierboven.</Text>
        <View style={styles.row}>
          <TextInput placeholder="Limiet (EUR)" keyboardType="numeric" value={limit} onChangeText={setLimit} style={styles.input} />
          <Pressable disabled={!selectedCat || !parseFloat(limit)} style={[styles.btn, (!selectedCat || !parseFloat(limit)) && styles.btnDisabled]} onPress={onCreateBudget}><Text style={styles.btnTxt}>Maak budget</Text></Pressable>
        </View>
      </View>
      {loading && <Text style={styles.muted}>Laden…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  h1: { fontSize: 24, fontWeight: '700' },
  h2: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, height: 44 },
  btn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  btnDisabled: { backgroundColor: '#9ca3af' },
  btnTxt: { color: '#fff', fontWeight: '600' },
  muted: { color: '#666' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  item: { fontSize: 16 },
  itemSel: { fontWeight: '700' },
  linkDanger: { color: '#b91c1c', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  linkWarn: { color: '#b45309', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  link: { color: '#2563eb', fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  card: { padding: 12, borderRadius: 12, backgroundColor: '#f7f7f7' },
});
