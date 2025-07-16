import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Shield, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Banknote,
  ArrowRight,
  Settings,
  Download,
  Calendar
} from 'lucide-react';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

const PageHeader = styled.div`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 30px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const SecurityBanner = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SecurityIcon = styled.div`
  color: #28a745;
  flex-shrink: 0;
`;

const SecurityContent = styled.div``;

const SecurityTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SecurityText = styled.div`
  color: #666;
  font-size: 0.95rem;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BanksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const BankCard = styled.div<{ connected?: boolean }>`
  background: white;
  border: 2px solid ${({ connected }) => connected ? '#28a745' : '#e9ecef'};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const BankHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const BankLogo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const BankInfo = styled.div`
  flex: 1;
`;

const BankName = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
`;

const BankStatus = styled.div<{ connected?: boolean }>`
  font-size: 0.9rem;
  color: ${({ connected }) => connected ? '#28a745' : '#6c757d'};
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ConnectionButton = styled.button<{ connected?: boolean }>`
  background: ${({ connected }) => connected ? '#dc3545' : '#28a745'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    background: ${({ connected }) => connected ? '#c82333' : '#218838'};
  }
`;

const SyncStatus = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
`;

const SyncHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const SyncInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SyncButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const SyncDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const SyncItem = styled.div`
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const SyncValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SyncLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SettingsSection = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div``;

const SettingTitle = styled.div`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const SettingDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const SettingToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #28a745;
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const banks = [
  {
    id: 'ing',
    name: 'ING Bank',
    logo: 'ING',
    connected: true,
    lastSync: '2024-01-15T10:30:00Z'
  },
  {
    id: 'rabobank',
    name: 'Rabobank',
    logo: 'RABO',
    connected: false
  },
  {
    id: 'abnamro',
    name: 'ABN AMRO',
    logo: 'ABN',
    connected: false
  },
  {
    id: 'bunq',
    name: 'Bunq',
    logo: 'BUNQ',
    connected: false
  },
  {
    id: 'sns',
    name: 'SNS Bank',
    logo: 'SNS',
    connected: false
  },
  {
    id: 'asn',
    name: 'ASN Bank',
    logo: 'ASN',
    connected: false
  }
];

const BankConnectionPage: React.FC = () => {
  const [connectedBanks, setConnectedBanks] = useState(banks.filter(b => b.connected));
  const [syncStatus, setSyncStatus] = useState({
    lastSync: '2024-01-15T10:30:00Z',
    transactionsThisMonth: 45,
    totalTransactions: 1234,
    autoSync: true,
    syncFrequency: 'daily'
  });
  const [isSyncing, setIsSyncing] = useState(false);

  const handleBankConnection = (bankId: string) => {
    const bank = banks.find(b => b.id === bankId);
    if (!bank) return;

    if (bank.connected) {
      // Disconnect bank
      setConnectedBanks(prev => prev.filter(b => b.id !== bankId));
    } else {
      // Connect bank - simulate PSD2 flow
      alert(`PSD2 koppeling met ${bank.name} wordt gestart...\n\nJe wordt doorgestuurd naar de beveiligde inlogpagina van ${bank.name}.`);
      // In a real implementation, this would redirect to the bank's OAuth flow
      setConnectedBanks(prev => [...prev, { ...bank, connected: true }]);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date().toISOString(),
        transactionsThisMonth: prev.transactionsThisMonth + Math.floor(Math.random() * 10)
      }));
      setIsSyncing(false);
    }, 2000);
  };

  const formatLastSync = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <PageHeader>
        <PageTitle>Bankkoppeling</PageTitle>
        <PageSubtitle>Veilige PSD2-koppeling met je bank voor automatische transacties</PageSubtitle>
      </PageHeader>

      <SecurityBanner>
        <SecurityIcon>
          <Shield size={24} />
        </SecurityIcon>
        <SecurityContent>
          <SecurityTitle>Veilige PSD2-koppeling</SecurityTitle>
          <SecurityText>
            Alle bankkoppelingen verlopen via de Europese PSD2-standaard. Je bankgegevens worden nooit opgeslagen en alle communicatie is versleuteld.
          </SecurityText>
        </SecurityContent>
      </SecurityBanner>

      <Section>
        <SectionTitle>
          <Banknote size={20} />
          Beschikbare Banken
        </SectionTitle>
        
        <BanksGrid>
          {banks.map(bank => (
            <BankCard 
              key={bank.id} 
              connected={bank.connected}
              onClick={() => handleBankConnection(bank.id)}
            >
              <BankHeader>
                <BankLogo>{bank.logo}</BankLogo>
                <BankInfo>
                  <BankName>{bank.name}</BankName>
                  <BankStatus connected={bank.connected}>
                    {bank.connected ? (
                      <>
                        <CheckCircle size={14} />
                        Verbonden
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} />
                        Niet verbonden
                      </>
                    )}
                  </BankStatus>
                </BankInfo>
              </BankHeader>
              
              <ConnectionButton connected={bank.connected}>
                {bank.connected ? 'Verbinding verbreken' : 'Verbinden'}
              </ConnectionButton>
            </BankCard>
          ))}
        </BanksGrid>
      </Section>

      {connectedBanks.length > 0 && (
        <Section>
          <SectionTitle>
            <RefreshCw size={20} />
            Synchronisatie Status
          </SectionTitle>
          
          <SyncStatus>
            <SyncHeader>
              <SyncInfo>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    Laatste synchronisatie
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {formatLastSync(syncStatus.lastSync)}
                  </div>
                </div>
              </SyncInfo>
              
              <SyncButton 
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    Synchroniseren...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Nu synchroniseren
                  </>
                )}
              </SyncButton>
            </SyncHeader>
            
            <SyncDetails>
              <SyncItem>
                <SyncValue>{connectedBanks.length}</SyncValue>
                <SyncLabel>Verbonden banken</SyncLabel>
              </SyncItem>
              <SyncItem>
                <SyncValue>{syncStatus.transactionsThisMonth}</SyncValue>
                <SyncLabel>Transacties deze maand</SyncLabel>
              </SyncItem>
              <SyncItem>
                <SyncValue>{syncStatus.totalTransactions}</SyncValue>
                <SyncLabel>Totaal transacties</SyncLabel>
              </SyncItem>
              <SyncItem>
                <SyncValue>{syncStatus.syncFrequency}</SyncValue>
                <SyncLabel>Synchronisatie frequentie</SyncLabel>
              </SyncItem>
            </SyncDetails>
          </SyncStatus>
        </Section>
      )}

      <Section>
        <SectionTitle>
          <Settings size={20} />
          Synchronisatie Instellingen
        </SectionTitle>
        
        <SettingsSection>
          <SettingItem>
            <SettingInfo>
              <SettingTitle>Automatische synchronisatie</SettingTitle>
              <SettingDescription>
                Transacties automatisch synchroniseren volgens ingestelde frequentie
              </SettingDescription>
            </SettingInfo>
            <SettingToggle>
              <ToggleInput 
                type="checkbox" 
                checked={syncStatus.autoSync}
                onChange={(e) => setSyncStatus(prev => ({ ...prev, autoSync: e.target.checked }))}
              />
              <ToggleSlider />
            </SettingToggle>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <SettingTitle>Alleen nieuwe transacties</SettingTitle>
              <SettingDescription>
                Synchroniseer alleen transacties van de laatste 90 dagen
              </SettingDescription>
            </SettingInfo>
            <SettingToggle>
              <ToggleInput type="checkbox" defaultChecked />
              <ToggleSlider />
            </SettingToggle>
          </SettingItem>
          
          <SettingItem>
            <SettingInfo>
              <SettingTitle>Automatische categorisatie</SettingTitle>
              <SettingDescription>
                Gebruik AI om transacties automatisch te categoriseren
              </SettingDescription>
            </SettingInfo>
            <SettingToggle>
              <ToggleInput type="checkbox" defaultChecked />
              <ToggleSlider />
            </SettingToggle>
          </SettingItem>
        </SettingsSection>
      </Section>
    </Container>
  );
};

export default BankConnectionPage; 