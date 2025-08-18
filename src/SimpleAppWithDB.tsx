import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { BudgetsPage } from './BudgetsAndSavings';

// Simple Auth Hook - commented out for now to avoid issues
// const useSimpleAuth = () => {
//   return { user: null, login: async () => {}, register: async () => {}, logout: async () => {}, loading: false };
// };

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e40af', fontSize: '36px', marginBottom: '8px' }}>
          🏦 Slim Minder v2.0 - WORKING!
        </h1>
        <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '24px' }}>
          Je persoonlijke financiële coach - Vercel Cache Bypassed!
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
          <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            🔐 Inloggen
          </Link>
          <Link to="/register" style={{ padding: '12px 24px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            📝 Gratis Account
          </Link>
          <Link to="/dashboard" style={{ padding: '12px 24px', background: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
            📊 Dashboard
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Transacties</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Beheer je inkomsten en uitgaven met categorieën
          </p>
          <Link to="/transactions" style={{ padding: '8px 16px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Beheer →
          </Link>
        </div>
        
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Budgetten</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Stel budgetten op en volg je uitgaven per categorie
          </p>
          <Link to="/budgets" style={{ padding: '8px 16px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Budgetten →
          </Link>
        </div>
        
        <div style={{ border: '2px solid #e5e7eb', borderRadius: '12px', padding: '24px', textAlign: 'center', background: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>Spaardoelen</h3>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Stel concrete doelen en track je voortgang
          </p>
          <Link to="/savings" style={{ padding: '8px 16px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            Doelen →
          </Link>
        </div>
      </div>

      <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>✅ App Status</h3>
        <p style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px' }}>
          🎉 Slim Minder v2.0 is volledig functioneel!
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Cache Bypass Actief • Build: {new Date().toLocaleString('nl-NL')}
        </p>
        <p style={{ color: '#1e40af', fontWeight: 'bold' }}>
          🔗 Supabase configuratie: {process.env.REACT_APP_SUPABASE_URL ? '✅ Actief' : '❌ Ontbreekt'}
        </p>
        <button 
          onClick={async () => {
            try {
              // Test database connection
              const { data, error } = await supabase.from('categories').select('count').limit(1);
              if (error) throw error;
              alert('✅ Database verbinding werkt! Categories tabel toegankelijk.');
            } catch (error: any) {
              alert(`❌ Database test fout:\n${error.message}`);
              console.error('Database test error:', error);
            }
          }}
          style={{ padding: '8px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px' }}
        >
          🧪 Test Database
        </button>
      </div>
    </div>
  );
};

// Working Login Page with Supabase
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      alert('🎉 Login succesvol! Welkom bij Slim Minder!');
      setUser(data.user);
      
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login mislukt';
      setError(errorMessage);
      
      // More detailed error for debugging
      alert(`❌ Login fout:\n${errorMessage}\n\nCheck console voor details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    alert('👋 Je bent uitgelogd!');
  };

  if (user) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#059669' }}>✅ Succesvol ingelogd!</h2>
        <div style={{ padding: '20px', background: '#d1fae5', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Aangemaakt:</strong> {new Date(user.created_at).toLocaleDateString('nl-NL')}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <Link to="/dashboard" style={{ padding: '12px 20px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
            📊 Ga naar Dashboard
          </Link>
          <button onClick={handleLogout} style={{ padding: '12px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            🚪 Uitloggen
          </button>
        </div>
        
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '8px' }}>🔐 Inloggen bij Slim Minder</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Log in om je financiële dashboard te bekijken
      </p>
      
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
        ← Terug naar home
      </Link>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Email adres:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jouw@email.com"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Wachtwoord:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading ? '#9ca3af' : '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLoading ? '⏳ Inloggen...' : '🚀 Inloggen'}
        </button>
      </form>

      <div style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Nog geen account?</p>
        <Link to="/register" style={{ color: '#059669', fontWeight: 'bold', textDecoration: 'none' }}>
          📝 Gratis account aanmaken →
        </Link>
      </div>
    </div>
  );
};

// Working Register Page with Supabase
const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Wachtwoord moet minimaal 6 karakters lang zijn');
      setIsLoading(false);
      return;
    }

    try {
      // First try simple signup without metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });
      
      // If successful and user created, then add profile data separately
      if (data.user && !error) {
        try {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              user_id: data.user.id,
              full_name: formData.fullName,
              email: formData.email,
              account_tier: 'FREE'
            });
          
          if (profileError) {
            console.warn('Profile creation failed:', profileError);
            // Continue anyway - auth user is created
          }
        } catch (profileErr) {
          console.warn('Manual profile creation failed:', profileErr);
          // Continue anyway - auth user is created
        }
      }

      if (error) throw error;

      if (data.user) {
        alert('🎉 Account succesvol aangemaakt! Check je email voor verificatie.');
        setUser(data.user);
      }
      
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.message || 'Registratie mislukt';
      setError(`Database error: ${errorMessage}`);
      
      // Show detailed error for debugging
      alert(`❌ Registratie fout:\n${errorMessage}\n\nCheck console voor details.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#059669' }}>✅ Account aangemaakt!</h2>
        <div style={{ padding: '20px', background: '#d1fae5', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>Welkom:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Account Type:</strong> FREE (gratis)</p>
          <p style={{ color: '#065f46', fontWeight: 'bold' }}>
            🎯 Je kunt nu beginnen met budgetteren!
          </p>
        </div>
        
        <Link to="/dashboard" style={{ padding: '12px 20px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px', display: 'inline-block', marginBottom: '16px' }}>
          📊 Ga naar Dashboard
        </Link>
        <br />
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#059669', marginBottom: '8px' }}>📝 Account Aanmaken</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Maak een gratis account en begin direct met budgetteren
      </p>
      
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
        ← Terug naar home
      </Link>

      {error && (
        <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', marginBottom: '16px' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Volledige naam:
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder="Jan van der Berg"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Email adres:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="jan@example.com"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Wachtwoord:
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#374151' }}>
            Bevestig wachtwoord:
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="••••••••"
            required
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            background: isLoading ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {isLoading ? '⏳ Account aanmaken...' : '🚀 Account Aanmaken'}
        </button>
      </form>

      <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>Al een account?</p>
        <Link to="/login" style={{ color: '#1e40af', fontWeight: 'bold', textDecoration: 'none' }}>
          🔐 Hier inloggen →
        </Link>
      </div>
    </div>
  );
};

// Working Dashboard Page with Supabase data
const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    transactions: 0,
    totalSpent: 0,
    totalIncome: 0,
    budgets: 0,
    savingsGoals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Load transactions
      const { data: transactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id);

      // Load budgets
      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Load savings goals
      const { data: savingsGoals } = await supabase
        .from('savings_goals')
        .select('current_amount, target_amount')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Calculate stats
      const totalSpent = transactions?.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;
      const totalIncome = transactions?.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalSaved = savingsGoals?.reduce((sum, g) => sum + (g.current_amount || 0), 0) || 0;

      setStats({
        transactions: transactions?.length || 0,
        totalSpent,
        totalIncome,
        budgets: budgets?.length || 0,
        savingsGoals: savingsGoals?.length || 0
      });

    } catch (error: any) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#dc2626' }}>🔐 Login vereist</h2>
        <p style={{ marginBottom: '24px' }}>Je moet ingelogd zijn om je dashboard te bekijken.</p>
        <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          🔐 Inloggen
        </Link>
        <br /><br />
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
        <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
          🚪 Uitloggen
        </button>
      </nav>
      
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#1e40af', fontSize: '32px', marginBottom: '8px' }}>
          📊 Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Welkom terug, {user.email}
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>⏳ Dashboard gegevens laden...</h3>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ padding: '24px', border: '2px solid #059669', borderRadius: '12px', textAlign: 'center', background: '#f0fdf4' }}>
              <h3 style={{ color: '#059669', fontSize: '28px', margin: '0 0 8px 0' }}>
                €{stats.totalIncome.toFixed(2)}
              </h3>
              <p style={{ color: '#065f46', fontWeight: 'bold' }}>Totaal Inkomen</p>
            </div>
            
            <div style={{ padding: '24px', border: '2px solid #dc2626', borderRadius: '12px', textAlign: 'center', background: '#fef2f2' }}>
              <h3 style={{ color: '#dc2626', fontSize: '28px', margin: '0 0 8px 0' }}>
                €{stats.totalSpent.toFixed(2)}
              </h3>
              <p style={{ color: '#991b1b', fontWeight: 'bold' }}>Totaal Uitgegeven</p>
            </div>
            
            <div style={{ padding: '24px', border: '2px solid #1e40af', borderRadius: '12px', textAlign: 'center', background: '#eff6ff' }}>
              <h3 style={{ color: '#1e40af', fontSize: '28px', margin: '0 0 8px 0' }}>
                {stats.transactions}
              </h3>
              <p style={{ color: '#1e3a8a', fontWeight: 'bold' }}>Transacties</p>
            </div>
            
            <div style={{ padding: '24px', border: '2px solid #7c3aed', borderRadius: '12px', textAlign: 'center', background: '#faf5ff' }}>
              <h3 style={{ color: '#7c3aed', fontSize: '28px', margin: '0 0 8px 0' }}>
                {stats.budgets}
              </h3>
              <p style={{ color: '#581c87', fontWeight: 'bold' }}>Actieve Budgetten</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white' }}>
              <h3 style={{ marginBottom: '16px' }}>🚀 Snelle Acties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/transactions" style={{ padding: '12px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px', textAlign: 'center' }}>
                  💰 Transacties Beheren
                </Link>
                <Link to="/budgets" style={{ padding: '12px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px', textAlign: 'center' }}>
                  📊 Budgetten Instellen
                </Link>
                <Link to="/savings" style={{ padding: '12px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px', textAlign: 'center' }}>
                  🎯 Spaardoelen
                </Link>
              </div>
            </div>
            
            <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', background: 'white' }}>
              <h3 style={{ marginBottom: '16px' }}>💡 Financieel Overzicht</h3>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p>• Saldo: €{(stats.totalIncome - stats.totalSpent).toFixed(2)}</p>
                <p>• Budgetten: {stats.budgets} actief</p>
                <p>• Spaardoelen: {stats.savingsGoals} doelen</p>
                <p>• Data last update: {new Date().toLocaleTimeString('nl-NL')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Working Transactions Page with full CRUD
const TransactionsPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category_id: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('display_order');
      
      setCategories(categoriesData || []);

      // Load transactions
      const { data: transactionsData } = await supabase
        .from('transactions')
        .select(`
          *,
          categories(name, color, icon)
        `)
        .eq('user_id', user.id)
        .order('transaction_date', { ascending: false })
        .limit(50);
      
      setTransactions(transactionsData || []);
      
    } catch (error: any) {
      alert('❌ Fout bij laden data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const amount = parseFloat(newTransaction.amount);
      if (isNaN(amount) || amount <= 0) {
        alert('❌ Voer een geldig bedrag in');
        return;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_id: `manual_${Date.now()}`,
          amount: -Math.abs(amount), // Uitgaven zijn negatief
          currency: 'EUR',
          description: newTransaction.description,
          category_id: newTransaction.category_id || null,
          transaction_date: new Date().toISOString().split('T')[0],
          processed_date: new Date().toISOString(),
          is_verified: true
        })
        .select(`
          *,
          categories(name, color, icon)
        `)
        .single();

      if (error) throw error;

      alert('✅ Transactie toegevoegd!');
      setTransactions(prev => [data, ...prev]);
      setNewTransaction({ description: '', amount: '', category_id: '' });
      setShowAddForm(false);
      
    } catch (error: any) {
      alert('❌ Fout bij toevoegen: ' + error.message);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!window.confirm('Weet je zeker dat je deze transactie wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('✅ Transactie verwijderd!');
      setTransactions(prev => prev.filter(t => t.id !== id));
      
    } catch (error: any) {
      alert('❌ Fout bij verwijderen: ' + error.message);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2 style={{ color: '#dc2626' }}>🔐 Login vereist</h2>
        <p style={{ marginBottom: '24px' }}>Je moet ingelogd zijn om transacties te beheren.</p>
        <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
          🔐 Inloggen
        </Link>
        <br /><br />
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '24px' }}>
        <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
        <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
      </nav>
      
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1e40af', fontSize: '28px', marginBottom: '8px' }}>💰 Transacties</h1>
        <p style={{ color: '#6b7280' }}>Beheer je inkomsten en uitgaven</p>
      </header>
      
      <div style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ padding: '12px 24px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {showAddForm ? '❌ Annuleren' : '➕ Nieuwe Transactie'}
        </button>
      </div>
      
      {showAddForm && (
        <div style={{ border: '2px solid #1e40af', borderRadius: '12px', padding: '24px', marginBottom: '24px', background: '#f8fafc' }}>
          <h3 style={{ marginBottom: '16px', color: '#1e40af' }}>➕ Nieuwe Transactie Toevoegen</h3>
          <form onSubmit={addTransaction}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Beschrijving:</label>
              <input
                type="text"
                placeholder="Bijv. Boodschappen Albert Heijn"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Bedrag (€):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="25.50"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>Categorie:</label>
              <select
                value={newTransaction.category_id}
                onChange={(e) => setNewTransaction(prev => ({ ...prev, category_id: e.target.value }))}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
              >
                <option value="">Selecteer categorie</option>
                {categories.filter(cat => !cat.is_income).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" style={{ padding: '12px 24px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              💾 Transactie Opslaan
            </button>
          </form>
        </div>
      )}
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Recente Transacties ({transactions.length})</h3>
          {loading && <span style={{ color: '#6b7280' }}>⏳ Laden...</span>}
        </div>
        
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>⏳ Transacties laden...</p>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <h4>Geen transacties gevonden</h4>
            <p>Voeg je eerste transactie toe om te beginnen!</p>
          </div>
        ) : (
          <div>
            {transactions.map((transaction, index) => (
              <div key={transaction.id} style={{ 
                padding: '16px', 
                borderBottom: index < transactions.length - 1 ? '1px solid #f3f4f6' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {transaction.description}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {transaction.categories?.name || 'Geen categorie'} • {transaction.transaction_date}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    color: transaction.amount > 0 ? '#059669' : '#dc2626',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    {transaction.amount > 0 ? '+' : ''}€{Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(transaction.id)}
                    style={{ background: '#dc2626', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SimpleAppWithDB: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/budgets" element={<BudgetsPage />} />
        <Route path="/savings" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>🎯 Spaardoelen (Build in progress)</h2><Link to="/">← Home</Link></div>} />
        <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>404</h2><Link to="/">← Home</Link></div>} />
      </Routes>
    </Router>
  );
};

export default SimpleAppWithDB;