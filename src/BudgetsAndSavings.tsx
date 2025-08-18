import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Working Budgets Page
export const BudgetsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    category_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Load categories and budgets
      const [categoriesRes, budgetsRes] = await Promise.all([
        supabase.from('categories').select('*').order('display_order'),
        supabase.from('budgets').select('*, categories(name)').eq('user_id', user.id).eq('is_active', true)
      ]);
      
      setCategories(categoriesRes.data || []);
      setBudgets(budgetsRes.data || []);
      
    } catch (error: any) {
      alert('❌ Fout bij laden: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const amount = parseFloat(newBudget.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('❌ Voer een geldig bedrag in');
        return;
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          name: newBudget.name,
          amount: amount,
          category_id: newBudget.category_id || null,
          period: 'MONTHLY',
          start_date: new Date().toISOString().split('T')[0],
          is_active: true,
          alert_threshold: 0.8,
          current_spent: 0
        })
        .select('*, categories(name)')
        .single();

      if (error) throw error;

      alert('✅ Budget toegevoegd!');
      setBudgets(prev => [...prev, data]);
      setNewBudget({ name: '', amount: '', category_id: '' });
      setShowAddForm(false);
      
    } catch (error: any) {
      alert('❌ Fout: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#dc2626' }}>🔐 Login vereist</h2>
        <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Inloggen</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
        <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
      </nav>
      
      <h1 style={{ color: '#059669', marginBottom: '24px' }}>📊 Budgetten</h1>
      
      <button 
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ padding: '12px 24px', background: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px' }}
      >
        {showAddForm ? '❌ Annuleren' : '➕ Nieuw Budget'}
      </button>
      
      {showAddForm && (
        <div style={{ border: '2px solid #059669', borderRadius: '8px', padding: '20px', marginBottom: '24px', background: '#f0fdf4' }}>
          <form onSubmit={addBudget}>
            <input
              type="text"
              placeholder="Budget naam"
              value={newBudget.name}
              onChange={(e) => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Budget bedrag (€)"
              value={newBudget.amount}
              onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <select
              value={newBudget.category_id}
              onChange={(e) => setNewBudget(prev => ({ ...prev, category_id: e.target.value }))}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            >
              <option value="">Selecteer categorie</option>
              {categories.filter(cat => !cat.is_income).map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '10px 20px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              💾 Opslaan
            </button>
          </form>
        </div>
      )}
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>Jouw Budgetten ({budgets.length})</h3>
        {loading ? (
          <p>⏳ Laden...</p>
        ) : budgets.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Nog geen budgetten. Maak je eerste budget!</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.id} style={{ padding: '16px', border: '1px solid #f3f4f6', margin: '8px 0', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{budget.name}</strong>
                  <br />
                  <small>{budget.categories?.name || 'Algemeen'}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>€{budget.amount}</strong>
                  <br />
                  <small>Uitgegeven: €{budget.current_spent || 0}</small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Working Savings Page
export const SavingsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: '',
    current_amount: '0'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      setGoals(data || []);
      
    } catch (error: any) {
      alert('❌ Fout: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const target = parseFloat(newGoal.target_amount);
      const current = parseFloat(newGoal.current_amount);
      
      if (isNaN(target) || target <= 0) {
        alert('❌ Voer een geldig doel bedrag in');
        return;
      }

      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: user.id,
          name: newGoal.name,
          target_amount: target,
          current_amount: current,
          category: 'GENERAL',
          priority: 'MEDIUM',
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      alert('✅ Spaardoel toegevoegd!');
      setGoals(prev => [...prev, data]);
      setNewGoal({ name: '', target_amount: '', current_amount: '0' });
      setShowAddForm(false);
      
    } catch (error: any) {
      alert('❌ Fout: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#dc2626' }}>🔐 Login vereist</h2>
        <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>Inloggen</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
        <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
      </nav>
      
      <h1 style={{ color: '#dc2626', marginBottom: '24px' }}>🎯 Spaardoelen</h1>
      
      <button 
        onClick={() => setShowAddForm(!showAddForm)}
        style={{ padding: '12px 24px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px' }}
      >
        {showAddForm ? '❌ Annuleren' : '➕ Nieuw Spaardoel'}
      </button>
      
      {showAddForm && (
        <div style={{ border: '2px solid #dc2626', borderRadius: '8px', padding: '20px', marginBottom: '24px', background: '#fef2f2' }}>
          <form onSubmit={addGoal}>
            <input
              type="text"
              placeholder="Spaardoel naam (bijv. Vakantie 2025)"
              value={newGoal.name}
              onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Doel bedrag (€)"
              value={newGoal.target_amount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, target_amount: e.target.value }))}
              required
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Huidig gespaard bedrag (€)"
              value={newGoal.current_amount}
              onChange={(e) => setNewGoal(prev => ({ ...prev, current_amount: e.target.value }))}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
            />
            <button type="submit" style={{ padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              💾 Spaardoel Opslaan
            </button>
          </form>
        </div>
      )}
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>Jouw Spaardoelen ({goals.length})</h3>
        {loading ? (
          <p>⏳ Laden...</p>
        ) : goals.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Nog geen spaardoelen. Stel je eerste doel in!</p>
        ) : (
          goals.map(goal => {
            const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
            return (
              <div key={goal.id} style={{ padding: '16px', border: '1px solid #f3f4f6', margin: '8px 0', borderRadius: '8px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{goal.name}</strong>
                    <span>€{goal.current_amount} / €{goal.target_amount}</span>
                  </div>
                  <div style={{ width: '100%', background: '#f3f4f6', borderRadius: '10px', height: '10px' }}>
                    <div style={{ 
                      width: `${Math.min(progress, 100)}%`, 
                      background: progress >= 100 ? '#059669' : '#1e40af', 
                      borderRadius: '10px', 
                      height: '100%' 
                    }}></div>
                  </div>
                  <small style={{ color: '#6b7280' }}>{progress.toFixed(1)}% bereikt</small>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};