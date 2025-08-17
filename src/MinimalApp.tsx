import React from 'react';

// Absolutely minimal app without any dependencies that could cause issues
const MinimalApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#1e40af' }}>🎉 Slim Minder - JavaScript Werkt!</h1>
      
      <div style={{ backgroundColor: '#10b981', color: 'white', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <strong>✅ SUCCESS:</strong> React app is geladen en JavaScript is functioneel!
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>📊 App Status</h2>
        <ul>
          <li>✅ React: {React.version}</li>
          <li>✅ JavaScript: Enabled</li>
          <li>✅ DOM: Ready</li>
          <li>✅ Build: {new Date().toISOString()}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>🧪 Interactive Test</h2>
        <button 
          onClick={() => alert('JavaScript interactivity werkt!')}
          style={{ 
            backgroundColor: '#1e40af', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Test Klik Event
        </button>
        
        <button 
          onClick={() => console.log('Console logging werkt!', { timestamp: new Date(), userAgent: navigator.userAgent })}
          style={{ 
            backgroundColor: '#059669', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Test Console
        </button>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
        <h3>🚀 Next Steps</h3>
        <p>Als je dit ziet, dan werkt de basis React app. Het probleem lag waarschijnlijk aan:</p>
        <ul>
          <li>Styled-components theme provider</li>
          <li>Complex context providers</li>
          <li>Import dependency issues</li>
        </ul>
        <p><strong>Plan:</strong> Stap voor stap componenten terugbrengen tot we de oorzaak vinden.</p>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        <p>
          <strong>Environment:</strong> {process.env.NODE_ENV} | 
          <strong> URL:</strong> {window.location.href} |
          <strong> User Agent:</strong> {navigator.userAgent.substring(0, 50)}...
        </p>
      </div>
    </div>
  );
};

export default MinimalApp;