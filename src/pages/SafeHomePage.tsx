import React from 'react';

// Safe fallback homepage without complex styling or dependencies
const SafeHomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#1e40af', textAlign: 'center' }}>
        Welkom bij Slim Minder
      </h1>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '20px' }}>
          Jouw persoonlijke financiële coach voor betere geldzaken
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/login" 
            style={{ 
              backgroundColor: '#1e40af', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Inloggen
          </a>
          <a 
            href="/register" 
            style={{ 
              backgroundColor: '#059669', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            Registreren
          </a>
          <a 
            href="/diagnostic" 
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white', 
              padding: '12px 24px', 
              textDecoration: 'none', 
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
          >
            🔍 Diagnostics
          </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>💰 Budget Beheer</h3>
          <p style={{ color: '#6b7280' }}>
            Houd je uitgaven in de gaten en stel slimme budgetten op voor verschillende categorieën.
          </p>
        </div>
        
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>🎯 Spaardoelen</h3>
          <p style={{ color: '#6b7280' }}>
            Stel concrete spaardoelen en volg je voortgang naar financiële vrijheid.
          </p>
        </div>
        
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>🤖 AI Coach</h3>
          <p style={{ color: '#6b7280' }}>
            Krijg persoonlijk financieel advies en tips van onze slimme AI coach.
          </p>
        </div>
        
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>🏆 Gamification</h3>
          <p style={{ color: '#6b7280' }}>
            Verdien badges en punten door goede financiële gewoonten aan te leren.
          </p>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '12px' }}>🚀 Status</h3>
        <p style={{ color: '#059669', fontWeight: 'bold' }}>
          ✅ App is geladen en JavaScript werkt!
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Build tijd: {new Date().toLocaleString('nl-NL')}
        </p>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <nav style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/dashboard" style={{ color: '#1e40af', textDecoration: 'none' }}>Dashboard</a>
          <a href="/transactions" style={{ color: '#1e40af', textDecoration: 'none' }}>Transacties</a>
          <a href="/budgets" style={{ color: '#1e40af', textDecoration: 'none' }}>Budgetten</a>
          <a href="/savings" style={{ color: '#1e40af', textDecoration: 'none' }}>Spaardoelen</a>
          <a href="/coach" style={{ color: '#1e40af', textDecoration: 'none' }}>AI Coach</a>
        </nav>
      </div>
    </div>
  );
};

export default SafeHomePage;