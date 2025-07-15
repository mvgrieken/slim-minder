import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
  duration?: number;
}

const GlobalStyle = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
`;

const TestContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TestHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  text-align: center;
`;

const TestTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const TestSubtitle = styled.p`
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
`;

const OverallStatus = styled.div<{ allPassed: boolean }>`
  background: ${props => props.allPassed ? '#d4edda' : '#f8d7da'};
  color: ${props => props.allPassed ? '#155724' : '#721c24'};
  padding: 20px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  border-bottom: 1px solid ${props => props.allPassed ? '#c3e6cb' : '#f5c6cb'};
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  padding: 30px;
`;

const TestCard = styled.div<{ status: string }>`
  background: white;
  border: 2px solid ${props => {
    switch (props.status) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#e9ecef';
    }
  }};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const TestName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const StatusIndicator = styled.div<{ status: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  }};
`;

const TestDuration = styled.span`
  margin-left: auto;
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: normal;
`;

const TestMessage = styled.div`
  font-size: 1rem;
  margin-bottom: 10px;
  color: #495057;
`;

const TestDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  white-space: pre-line;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  border-left: 4px solid #dee2e6;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 30px 30px 30px;
  width: calc(100% - 60px);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const initialTests = useMemo((): Omit<TestResult, 'status' | 'message' | 'duration'>[] => [
    { name: 'Omgevingsvariabelen' },
    { name: 'Supabase Connectie' },
    { name: 'Database Schema' },
    { name: 'Authenticatie Service' },
    { name: 'API Endpoints' },
    { name: 'Browser Compatibiliteit' },
  ], []);

  const testEnvironmentVariables = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const requiredVars = [
        'REACT_APP_SUPABASE_URL',
        'REACT_APP_SUPABASE_ANON_KEY'
      ];
      const missingVars = requiredVars.filter(varName => !process.env[varName]);
      if (missingVars.length > 0) {
        return {
          name: 'Omgevingsvariabelen',
          status: 'error',
          message: `${missingVars.length} variabelen ontbreken`,
          details: `Ontbrekend: ${missingVars.join(', ')}\nControleer je .env.local bestand`,
          duration: Date.now() - startTime
        };
      }
      return {
        name: 'Omgevingsvariabelen',
        status: 'success',
        message: 'Alle vereiste variabelen aanwezig',
        details: `Supabase URL: ${process.env.REACT_APP_SUPABASE_URL?.substring(0, 20)}...\nAnon Key: ${process.env.REACT_APP_SUPABASE_ANON_KEY?.substring(0, 20)}...`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Omgevingsvariabelen',
        status: 'error',
        message: 'Fout bij controleren variabelen',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testSupabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const { error } = await supabase
        .from('transaction_categories')
        .select('count')
        .limit(1);
      if (error) throw error;
      return {
        name: 'Supabase Connectie',
        status: 'success',
        message: 'Database connectie succesvol',
        details: 'Supabase client werkt correct\nDatabase queries mogelijk',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Supabase Connectie',
        status: 'error',
        message: 'Database connectie gefaald',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testDatabaseSchema = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const { error } = await supabase
        .from('transaction_categories')
        .select('id, name, type')
        .limit(1);
      if (error) throw error;
      return {
        name: 'Database Schema',
        status: 'success',
        message: 'Database schema correct',
        details: 'Tabel transaction_categories bestaat\nSchema is toegankelijk',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Database Schema',
        status: 'error',
        message: 'Database schema fout',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testAuthenticationService = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      const isLoggedIn = !!session;
      return {
        name: 'Authenticatie Service',
        status: 'success',
        message: 'Authenticatie service werkt correct',
        details: `Status: ${isLoggedIn ? 'Ingelogd' : 'Niet ingelogd'}\nAuth endpoint bereikbaar`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Authenticatie Service',
        status: 'error',
        message: 'Authenticatie service fout',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testAPIEndpoints = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const { error } = await supabase
        .from('transaction_categories')
        .select('id, name, type')
        .limit(5);
      if (error) throw error;
      return {
        name: 'API Endpoints',
        status: 'success',
        message: 'API endpoints bereikbaar',
        details: `API response succesvol`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'API Endpoints',
        status: 'error',
        message: 'API endpoints niet bereikbaar',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testBrowserCompatibility = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const features: { [key: string]: boolean } = {
        localStorage: typeof window !== 'undefined' && typeof window.localStorage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        arrow: (() => { try { return true; } catch { return false; } })(),
        modules: (() => { try { return typeof document !== 'undefined' && 'noModule' in document.createElement('script'); } catch { return false; } })()
      };
      const supported = Object.keys(features).filter((key) => features[key]);
      const unsupported = Object.keys(features).filter((key) => !features[key]);
      if (unsupported.length > 0) {
        return {
          name: 'Browser Compatibiliteit',
          status: 'error',
          message: `${unsupported.length} features niet ondersteund`,
          details: `Ondersteund: ${supported.join(', ')}\nNiet ondersteund: ${unsupported.join(', ')}`,
          duration: Date.now() - startTime
        };
      }
      return {
        name: 'Browser Compatibiliteit',
        status: 'success',
        message: 'Browser volledig compatibel',
        details: `Alle features ondersteund: ${supported.join(', ')}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Browser Compatibiliteit',
        status: 'error',
        message: 'Browser compatibiliteit test gefaald',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const runTest = useCallback(async (testName: string): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      switch (testName) {
        case 'Omgevingsvariabelen':
          return await testEnvironmentVariables();
        case 'Supabase Connectie':
          return await testSupabaseConnection();
        case 'Database Schema':
          return await testDatabaseSchema();
        case 'Authenticatie Service':
          return await testAuthenticationService();
        case 'API Endpoints':
          return await testAPIEndpoints();
        case 'Browser Compatibiliteit':
          return await testBrowserCompatibility();
      }
      // fallback voor typescript
      return {
        name: testName,
        status: 'error',
        message: 'Onbekende test',
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: testName,
        status: 'error',
        message: `Test gefaald: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        duration: Date.now() - startTime
      };
    }
  }, []);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setTests(initialTests.map(test => ({ ...test, status: 'pending' as const, message: 'Test wordt uitgevoerd...' })));
    for (let i = 0; i < initialTests.length; i++) {
      const testResult = await runTest(initialTests[i].name);
      setTests(prevTests => 
        prevTests.map((test, index) => 
          index === i ? testResult : test
        )
      );
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    setIsRunning(false);
  }, [initialTests, runTest]);

  useEffect(() => {
    runAllTests();
  }, [runAllTests]);

  const allTestsComplete = tests.length > 0 && tests.every(test => test.status !== 'pending');
  const allTestsPassed = tests.every(test => test.status === 'success');

  return (
    <GlobalStyle>
      <TestContainer>
        <TestHeader>
          <TestTitle>🔧 Slim Minder System Test</TestTitle>
          <TestSubtitle>Controleer alle systeem connecties en configuraties</TestSubtitle>
        </TestHeader>
        {allTestsComplete && (
          <OverallStatus allPassed={allTestsPassed}>
            {allTestsPassed 
              ? '✅ Alle tests succesvol - Systeem is klaar voor gebruik!'
              : '❌ Sommige tests gefaald - Controleer de details hieronder'
            }
          </OverallStatus>
        )}
        <TestGrid>
          {tests.map((test, index) => (
            <TestCard key={index} status={test.status}>
              <TestName>
                <StatusIndicator status={test.status} />
                {test.name}
                {test.duration && <TestDuration>{test.duration}ms</TestDuration>}
              </TestName>
              <TestMessage>{test.message}</TestMessage>
              {test.details && <TestDetails>{test.details}</TestDetails>}
            </TestCard>
          ))}
        </TestGrid>
        <RefreshButton 
          onClick={runAllTests} 
          disabled={isRunning}
        >
          {isRunning ? 'Tests worden uitgevoerd...' : '🔄 Tests opnieuw uitvoeren'}
        </RefreshButton>
      </TestContainer>
    </GlobalStyle>
  );
};

export default TestPage; 