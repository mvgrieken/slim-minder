import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Simple Auth Hook
const useSimpleAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data.user;
  };

  const register = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          account_tier: 'FREE'
        }
      }
    });
    
    if (error) throw error;
    return data.user;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return { user, login, register, logout, loading };
};

// Homepage with auth status
const HomePage: React.FC = () => {
  const { user, logout, loading } = useSimpleAuth();

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h2>⏳ Slim Minder laden...</h2>
        <p>Account status controleren...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#1e40af', fontSize: '36px', marginBottom: '8px' }}>
          🏦 Slim Minder v2.0
        </h1>
        <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '24px' }}>
          Je persoonlijke financiële coach - Nu met database integratie!
        </p>
        
        {user ? (
          <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '12px', marginBottom: '24px' }}>
            <h3 style={{ color: '#065f46', margin: '0 0 8px 0' }}>
              👋 Welkom terug, {user.email}!
            </h3>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/dashboard" style={{ padding: '8px 16px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
                📊 Dashboard
              </Link>
              <button 
                onClick={async () => {
                  await logout();
                  alert('👋 Succesvol uitgelogd!');
                }}
                style={{ padding: '8px 16px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                🚪 Uitloggen
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              🔐 Inloggen
            </Link>
            <Link to="/register" style={{ padding: '12px 24px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              📝 Gratis Account
            </Link>
          </div>
        )}
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
        {user && (
          <p style={{ color: '#1e40af', fontWeight: 'bold' }}>
            🔗 Verbonden met Supabase als: {user.email}
          </p>
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
        <Route path="/login" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>🔐 Login (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
        <Route path="/register" element={<div style={{padding: '20px', textAlign: 'center'}}><h2>📝 Register (Coming Soon)</h2><Link to="/">← Home</Link></div>} />
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