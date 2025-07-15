import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: string;
  duration?: number;
}

const TestContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background.primary};
  padding: ${props => props.theme.spacing.xl};
`;

const TestHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const TestTitle = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.xxl};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const TestSubtitle = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
`;

const TestGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const TestCard = styled.div<{ status: TestResult['status'] }>`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.lg};
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'success': return props.theme.colors.success.main;
      case 'error': return props.theme.colors.error.main;
      default: return props.theme.colors.warning.main;
    }
  }};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const TestName = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const StatusIndicator = styled.span<{ status: TestResult['status'] }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'success': return props.theme.colors.success.main;
      case 'error': return props.theme.colors.error.main;
      default: return props.theme.colors.warning.main;
    }
  }};
  ${props => props.status === 'pending' && `
    animation: pulse 1.5s ease-in-out infinite;
  `}
`;

const TestMessage = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const TestDetails = styled.pre`
  background: ${props => props.theme.colors.background.primary};
  color: ${props => props.theme.colors.text.primary};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.sm};
  overflow-x: auto;
  margin-top: ${props => props.theme.spacing.sm};
`;

const TestDuration = styled.span`
  color: ${props => props.theme.colors.text.tertiary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-left: auto;
`;

const RefreshButton = styled.button`
  background: ${props => props.theme.colors.primary.main};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: ${props => props.theme.typography.fontSize.md};
  cursor: pointer;
  margin: ${props => props.theme.spacing.xl} auto 0;
  display: block;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary.dark};
  }

  &:disabled {
    background: ${props => props.theme.colors.neutral.medium};
    cursor: not-allowed;
  }
`;

const OverallStatus = styled.div<{ allPassed: boolean }>`
  background: ${props => props.allPassed ? props.theme.colors.success.light : props.theme.colors.error.light};
  color: ${props => props.allPassed ? props.theme.colors.success.dark : props.theme.colors.error.dark};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  text-align: center;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const GlobalStyle = styled.div`
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const TestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const initialTests: Omit<TestResult, 'status' | 'message' | 'duration'>[] = [
    { name: 'Omgevingsvariabelen' },
    { name: 'Supabase Connectie' },
    { name: 'Database Schema' },
    { name: 'Authenticatie Service' },
    { name: 'API Endpoints' },
    { name: 'Browser Compatibiliteit' },
  ];

  const runTest = async (testName: string): Promise<TestResult> => {
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
        default:
          throw new Error('Onbekende test');
      }
    } catch (error) {
      return {
        name: testName,
        status: 'error',
        message: `Test gefaald: ${error instanceof Error ? error.message : 'Onbekende fout'}`,
        duration: Date.now() - startTime
      };
    }
  };

  const testEnvironmentVariables = async (): Promise<TestResult> => {
    const startTime = Date.now();
    const requiredVars = [
      'REACT_APP_SUPABASE_URL',
      'REACT_APP_SUPABASE_ANON_KEY',
      'REACT_APP_ENVIRONMENT'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    const presentVars = requiredVars.filter(varName => process.env[varName]);

    if (missingVars.length > 0) {
      return {
        name: 'Omgevingsvariabelen',
        status: 'error',
        message: `${missingVars.length} variabelen ontbreken`,
        details: `Ontbrekend: ${missingVars.join(', ')}\nAanwezig: ${presentVars.join(', ')}`,
        duration: Date.now() - startTime
      };
    }

    return {
      name: 'Omgevingsvariabelen',
      status: 'success',
      message: `Alle ${requiredVars.length} omgevingsvariabelen zijn correct ingesteld`,
      details: `Environment: ${process.env.REACT_APP_ENVIRONMENT}\nSupabase URL: ${process.env.REACT_APP_SUPABASE_URL?.slice(0, 30)}...`,
      duration: Date.now() - startTime
    };
  };

  const testSupabaseConnection = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('transaction_categories')
        .select('count', { count: 'exact', head: true });

      if (error) throw error;

      return {
        name: 'Supabase Connectie',
        status: 'success',
        message: 'Supabase connectie succesvol',
        details: `Verbonden met database\nResponse tijd: ${Date.now() - startTime}ms`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Supabase Connectie',
        status: 'error',
        message: 'Kan niet verbinden met Supabase',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testDatabaseSchema = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test if main tables exist by trying to query them
      const tables = [
        'transaction_categories',
        'users',
        'transactions',
        'budgets',
        'savings_goals'
      ];

      const results = await Promise.all(
        tables.map(async (table) => {
          try {
            const { error } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });
            return { table, exists: !error };
          } catch {
            return { table, exists: false };
          }
        })
      );

      const existingTables = results.filter(r => r.exists);
      const missingTables = results.filter(r => !r.exists);

      if (missingTables.length > 0) {
        return {
          name: 'Database Schema',
          status: 'error',
          message: `${missingTables.length} tabellen ontbreken`,
          details: `Bestaand: ${existingTables.map(t => t.table).join(', ')}\nOntbrekend: ${missingTables.map(t => t.table).join(', ')}`,
          duration: Date.now() - startTime
        };
      }

      return {
        name: 'Database Schema',
        status: 'success',
        message: `Alle ${tables.length} hoofdtabellen gevonden`,
        details: `Tabellen: ${existingTables.map(t => t.table).join(', ')}`,
        duration: Date.now() - startTime
      };
    } catch (error) {
      return {
        name: 'Database Schema',
        status: 'error',
        message: 'Kan database schema niet controleren',
        details: error instanceof Error ? error.message : 'Onbekende fout',
        duration: Date.now() - startTime
      };
    }
  };

  const testAuthenticationService = async (): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      // Test if we can get session info (even if user is not logged in)
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
      // Test a simple API call to get transaction categories
      const { data, error } = await supabase
        .from('transaction_categories')
        .select('id, name, type')
        .limit(5);

      if (error) throw error;

      return {
        name: 'API Endpoints',
        status: 'success',
        message: 'API endpoints bereikbaar',
        details: `${data?.length || 0} categorieën opgehaald\nAPI response succesvol`,
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
      const features = {
        localStorage: typeof Storage !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        promise: typeof Promise !== 'undefined',
        arrow: (() => { try { eval('() => {}'); return true; } catch { return false; } })(),
        modules: (() => { try { return typeof document !== 'undefined' && 'noModule' in document.createElement('script'); } catch { return false; } })()
      };

      const supportedFeatures = Object.entries(features).filter(([, supported]) => supported);
      const unsupportedFeatures = Object.entries(features).filter(([, supported]) => !supported);

      if (unsupportedFeatures.length > 0) {
        return {
          name: 'Browser Compatibiliteit',
          status: 'error',
          message: `${unsupportedFeatures.length} features niet ondersteund`,
          details: `Ondersteund: ${supportedFeatures.map(([name]) => name).join(', ')}\nNiet ondersteund: ${unsupportedFeatures.map(([name]) => name).join(', ')}`,
          duration: Date.now() - startTime
        };
      }

      return {
        name: 'Browser Compatibiliteit',
        status: 'success',
        message: 'Browser volledig compatibel',
        details: `Alle features ondersteund: ${supportedFeatures.map(([name]) => name).join(', ')}`,
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

  const runAllTests = async () => {
    setIsRunning(true);
    setTests(initialTests.map(test => ({ ...test, status: 'pending' as const, message: 'Test wordt uitgevoerd...' })));

    for (let i = 0; i < initialTests.length; i++) {
      const testResult = await runTest(initialTests[i].name);
      
      setTests(prevTests => 
        prevTests.map((test, index) => 
          index === i ? testResult : test
        )
      );

      // Small delay between tests for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

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