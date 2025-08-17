import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Simple components without styled-components
const SimpleHomePage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h1 style={{ color: '#1e40af' }}>🏦 Slim Minder - Fintech Platform</h1>
    <p style={{ fontSize: '18px', marginBottom: '24px' }}>
      Welkom bij Slim Minder - je persoonlijke financiële coach
    </p>
    
    <nav style={{ marginBottom: '32px' }}>
      <Link to="/login" style={{ marginRight: '16px', padding: '12px 24px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
        🔐 Inloggen
      </Link>
      <Link to="/register" style={{ marginRight: '16px', padding: '12px 24px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
        📝 Registreren
      </Link>
      <Link to="/test" style={{ marginRight: '16px', padding: '12px 24px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
        🧪 Test
      </Link>
    </nav>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>💰 Transacties</h3>
        <p>Beheer je inkomsten en uitgaven</p>
        <Link to="/transactions">Ga naar transacties →</Link>
      </div>
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>📊 Budgetten</h3>
        <p>Stel budgetten op en volg je uitgaven</p>
        <Link to="/budgets">Ga naar budgetten →</Link>
      </div>
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>🎯 Spaardoelen</h3>
        <p>Track je voortgang naar financiële doelen</p>
        <Link to="/savings">Ga naar spaardoelen →</Link>
      </div>
      
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
        <h3>📱 Dashboard</h3>
        <p>Compleet overzicht van je financiën</p>
        <Link to="/dashboard">Ga naar dashboard →</Link>
      </div>
    </div>

    <div style={{ marginTop: '40px', padding: '20px', background: '#f0f9ff', borderRadius: '8px' }}>
      <h4>✅ App Status: Werkend!</h4>
      <p>JavaScript, React Router en basis functionaliteit werken correct.</p>
      <p><strong>🔄 Cache Bypass:</strong> v2.0 - {new Date().toLocaleString('nl-NL')}</p>
      <small>Build tijd: {new Date().toISOString()}</small>
    </div>
  </div>
);

const SimpleLoginPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
    <h2>🔐 Inloggen bij Slim Minder</h2>
    <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
    
    <div style={{ marginTop: '20px', padding: '16px', background: '#e0f2fe', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Login Pagina Werkt!</h4>
      <p>React Router navigatie is succesvol. Je bent op: /login</p>
    </div>
    
    <form style={{ marginTop: '20px' }} onSubmit={(e) => {
      e.preventDefault();
      alert('🎉 Login formulier werkt! (Demo mode - connectie met Supabase volgt later)');
    }}>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Email:</label>
        <input 
          type="email" 
          placeholder="john@example.com" 
          required
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} 
        />
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Wachtwoord:</label>
        <input 
          type="password" 
          placeholder="••••••••" 
          required
          style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px' }} 
        />
      </div>
      
      <button type="submit" style={{ width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        🚀 Inloggen (Demo)
      </button>
    </form>
    
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <Link to="/register" style={{ color: '#059669', textDecoration: 'none' }}>
        Nog geen account? Registreer hier →
      </Link>
    </div>
  </div>
);

const SimpleTestPage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <h2>🧪 Test Pagina</h2>
    <Link to="/" style={{ color: '#1e40af' }}>← Terug naar home</Link>
    <div style={{ marginTop: '20px', padding: '20px', background: '#f0fdf4', borderRadius: '8px' }}>
      <h3>✅ JavaScript Test Succesvol!</h3>
      <p>React Router werkt correct - je kunt tussen pagina's navigeren.</p>
    </div>
  </div>
);

// Simple Register Page
const SimpleRegisterPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
    <h2>📝 Registreren bij Slim Minder</h2>
    <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Terug naar home</Link>
    
    <div style={{ marginTop: '20px', padding: '16px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Register Pagina Werkt!</h4>
      <p>Maak je account aan om te beginnen met budgetteren.</p>
    </div>
    
    <form style={{ marginTop: '20px' }} onSubmit={(e) => {
      e.preventDefault();
      alert('🎉 Registratie formulier werkt! Account wordt aangemaakt...');
    }}>
      <input type="text" placeholder="Volledige naam" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
      <input type="email" placeholder="Email adres" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
      <input type="password" placeholder="Wachtwoord" required style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
      <button type="submit" style={{ width: '100%', padding: '12px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
        🚀 Account Aanmaken
      </button>
    </form>
  </div>
);

// Simple Dashboard Page
const SimpleDashboardPage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none' }}>← Home</Link>
    </nav>
    
    <h2>📊 Dashboard</h2>
    
    <div style={{ padding: '16px', background: '#dbeafe', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Dashboard Werkt!</h4>
      <p>Hier zou je financiële overzicht komen te staan.</p>
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#059669' }}>€0</h3>
        <p>Totaal Saldo</p>
      </div>
      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#dc2626' }}>€0</h3>
        <p>Deze Maand Uitgegeven</p>
      </div>
      <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#1e40af' }}>€0</h3>
        <p>Spaardoelen</p>
      </div>
    </div>
    
    <div style={{ marginTop: '32px' }}>
      <h3>🚀 Snelle Acties</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/transactions" style={{ padding: '12px 20px', background: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          💰 Transacties
        </Link>
        <Link to="/budgets" style={{ padding: '12px 20px', background: '#059669', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          📊 Budgetten
        </Link>
        <Link to="/savings" style={{ padding: '12px 20px', background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: '6px' }}>
          🎯 Spaardoelen
        </Link>
      </div>
    </div>
  </div>
);

// Simple Transactions Page
const SimpleTransactionsPage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
      <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
    </nav>
    
    <h2>💰 Transacties</h2>
    
    <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Transacties Pagina Werkt!</h4>
      <p>Hier kun je je inkomsten en uitgaven beheren.</p>
    </div>
    
    <button 
      onClick={() => alert('🎉 Nieuwe transactie functie werkt!')}
      style={{ padding: '12px 24px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}
    >
      ➕ Nieuwe Transactie
    </button>
    
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <h4>Recente Transacties</h4>
      <p style={{ color: '#6b7280' }}>Geen transacties gevonden. Voeg je eerste transactie toe!</p>
    </div>
  </div>
);

// Simple Budgets Page  
const SimpleBudgetsPage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
      <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
    </nav>
    
    <h2>📊 Budgetten</h2>
    
    <div style={{ padding: '16px', background: '#fff7ed', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Budgetten Pagina Werkt!</h4>
      <p>Stel hier je maandelijkse budgetten in per categorie.</p>
    </div>
    
    <button 
      onClick={() => alert('🎯 Nieuw budget functie werkt!')}
      style={{ padding: '12px 24px', background: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}
    >
      ➕ Nieuw Budget
    </button>
    
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <h4>Jouw Budgetten</h4>
      <p style={{ color: '#6b7280' }}>Nog geen budgetten ingesteld. Begin met je eerste budget!</p>
    </div>
  </div>
);

// Simple Savings Page
const SimpleSavingsPage: React.FC = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    <nav style={{ marginBottom: '20px' }}>
      <Link to="/" style={{ color: '#1e40af', textDecoration: 'none', marginRight: '16px' }}>← Home</Link>
      <Link to="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>📊 Dashboard</Link>
    </nav>
    
    <h2>🎯 Spaardoelen</h2>
    
    <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '8px', marginBottom: '20px' }}>
      <h4>✅ Spaardoelen Pagina Werkt!</h4>
      <p>Stel concrete spaardoelen en volg je voortgang.</p>
    </div>
    
    <button 
      onClick={() => alert('🏆 Nieuw spaardoel functie werkt!')}
      style={{ padding: '12px 24px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}
    >
      ➕ Nieuw Spaardoel
    </button>
    
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      <h4>Jouw Spaardoelen</h4>
      <p style={{ color: '#6b7280' }}>Geen spaardoelen ingesteld. Stel je eerste doel in!</p>
    </div>
  </div>
);

const SimpleApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/register" element={<SimpleRegisterPage />} />
        <Route path="/dashboard" element={<SimpleDashboardPage />} />
        <Route path="/transactions" element={<SimpleTransactionsPage />} />
        <Route path="/budgets" element={<SimpleBudgetsPage />} />
        <Route path="/savings" element={<SimpleSavingsPage />} />
        <Route path="/test" element={<SimpleTestPage />} />
        <Route path="*" element={
          <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
            <h2>404 - Pagina niet gevonden</h2>
            <p>De pagina die je zoekt bestaat niet.</p>
            <Link to="/" style={{ color: '#1e40af' }}>🏠 Terug naar home</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default SimpleApp;