import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const DiagnosticContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  background-color: #fef3c7;
  font-family: monospace;
`;

const DiagnosticTitle = styled.h2`
  color: #92400e;
  margin-bottom: 16px;
`;

const DiagnosticItem = styled.div`
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
`;

const StatusIndicator = styled.span<{ status: 'ok' | 'error' | 'warning' }>`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => 
    props.status === 'ok' ? '#10b981' : 
    props.status === 'error' ? '#ef4444' : '#f59e0b'
  };
`;

export const DiagnosticComponent: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);

  useEffect(() => {
    const runDiagnostics = async () => {
      const results = [];

      // Check React
      try {
        results.push({
          name: 'React',
          status: 'ok',
          message: `React version: ${React.version}`
        });
      } catch (error) {
        results.push({
          name: 'React',
          status: 'error',
          message: `React error: ${error}`
        });
      }

      // Check environment variables
      const envVars = [
        'REACT_APP_SUPABASE_URL',
        'REACT_APP_SUPABASE_ANON_KEY',
        'REACT_APP_ENVIRONMENT'
      ];

      envVars.forEach(envVar => {
        const value = process.env[envVar];
        results.push({
          name: `ENV: ${envVar}`,
          status: value ? 'ok' : 'error',
          message: value ? 'Set' : 'Missing'
        });
      });

      // Check localStorage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        results.push({
          name: 'localStorage',
          status: 'ok',
          message: 'Available'
        });
      } catch (error) {
        results.push({
          name: 'localStorage',
          status: 'error',
          message: `Error: ${error}`
        });
      }

      // Check if running in browser
      results.push({
        name: 'Environment',
        status: 'ok',
        message: `Window: ${typeof window !== 'undefined'}, Document: ${typeof document !== 'undefined'}`
      });

      // Check current URL and hostname
      results.push({
        name: 'URL',
        status: 'ok',
        message: `${window.location.href}`
      });

      // Check if styled-components is working
      try {
        const testDiv = document.createElement('div');
        testDiv.style.color = 'red';
        results.push({
          name: 'Styled Components',
          status: 'ok',
          message: 'CSS-in-JS working'
        });
      } catch (error) {
        results.push({
          name: 'Styled Components',
          status: 'error',
          message: `Error: ${error}`
        });
      }

      setDiagnostics(results);
    };

    runDiagnostics();
  }, []);

  return (
    <DiagnosticContainer>
      <DiagnosticTitle>🔍 App Diagnostics</DiagnosticTitle>
      <div>
        <strong>Build Time:</strong> {new Date().toISOString()}
      </div>
      <div>
        <strong>User Agent:</strong> {navigator.userAgent}
      </div>
      <br />
      {diagnostics.map((diagnostic, index) => (
        <DiagnosticItem key={index}>
          <StatusIndicator status={diagnostic.status} />
          <strong>{diagnostic.name}:</strong> {diagnostic.message}
        </DiagnosticItem>
      ))}
    </DiagnosticContainer>
  );
};