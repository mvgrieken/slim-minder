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
      <small>Build tijd: {new Date().toISOString()}</small>
    </div>
  </div>
);

const SimpleLoginPage: React.FC = () => (
  <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
    <h2>🔐 Inloggen</h2>
    <Link to="/" style={{ color: '#1e40af' }}>← Terug naar home</Link>
    <form style={{ marginTop: '20px' }}>
      <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
      <input type="password" placeholder="Wachtwoord" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '6px' }} />
      <button type="submit" style={{ width: '100%', padding: '12px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
        Inloggen
      </button>
    </form>
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

const SimpleApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleHomePage />} />
        <Route path="/login" element={<SimpleLoginPage />} />
        <Route path="/test" element={<SimpleTestPage />} />
        <Route path="*" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>404 - Pagina niet gevonden</h2>
            <Link to="/">Terug naar home</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default SimpleApp;