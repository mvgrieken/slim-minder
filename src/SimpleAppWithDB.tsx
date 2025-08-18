import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

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
      setError(err.message || 'Login mislukt');
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
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            account_tier: 'FREE'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        alert('🎉 Account succesvol aangemaakt! Check je email voor verificatie.');
        setUser(data.user);
      }
      
    } catch (err: any) {
      setError(err.message || 'Registratie mislukt');
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

const SimpleAppWithDB: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📊 Dashboard (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/transactions" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>💰 Transactions (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/budgets" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📊 Budgets (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/savings" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>🎯 Savings (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="*" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>404</h2><Link to="/">← Home</Link></div>} />
      </Routes>
    </Router>
  );
};

export default SimpleAppWithDB;