import React from 'react';
import { DiagnosticComponent } from '../components/DiagnosticComponent';

const DiagnosticPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Slim Minder - Diagnostic Page</h1>
      <p>This page helps diagnose why the app might not be loading correctly.</p>
      <DiagnosticComponent />
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Manual Tests</h3>
        <button onClick={() => alert('JavaScript is working!')}>
          Test JavaScript
        </button>
        <br /><br />
        <button onClick={() => console.log('Console logging works')}>
          Test Console
        </button>
        <br /><br />
        <button onClick={() => {
          try {
            const test = new Error('Test error');
            console.error('Test error:', test);
            alert('Error logged to console');
          } catch (e) {
            alert('Error handling failed');
          }
        }}>
          Test Error Handling
        </button>
      </div>
    </div>
  );
};

export default DiagnosticPage;