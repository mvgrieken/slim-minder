import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
  status: 'active' | 'inactive' | 'pending';
  lastSync?: string;
}

interface BankAccountsProps {
  navigation: any;
}

export default function BankAccounts({ navigation }: BankAccountsProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/bank/accounts', {
        headers: {
          'Content-Type': 'application/json',
          'x-sm-user-id': 'test-user-id', // TODO: Get from auth context
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
      Alert.alert('Error', 'Failed to load bank accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadAccounts();
    setIsRefreshing(false);
  };

  const connectBank = async () => {
    try {
      setIsConnecting(true);
      const response = await fetch('/api/bank/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sm-user-id': 'test-user-id', // TODO: Get from auth context
        },
        body: JSON.stringify({
          provider: 'tink', // TODO: Let user choose
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // TODO: Open web browser for OAuth flow
        Alert.alert(
          'Bank Verbinden',
          'Je wordt doorgestuurd naar je bank om de verbinding te autoriseren.',
          [
            {
              text: 'OK',
              onPress: () => {
                // TODO: Open web browser with auth URL
                console.log('Auth URL:', data.authUrl);
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to start bank connection');
      }
    } catch (error) {
      console.error('Failed to connect bank:', error);
      Alert.alert('Error', 'Failed to connect bank');
    } finally {
      setIsConnecting(false);
    }
  };

  const syncAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/bank/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-sm-user-id': 'test-user-id', // TODO: Get from auth context
        },
        body: JSON.stringify({
          accountId,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Account synchronized successfully');
        loadAccounts(); // Refresh to get updated lastSync
      } else {
        Alert.alert('Error', 'Failed to sync account');
      }
    } catch (error) {
      console.error('Failed to sync account:', error);
      Alert.alert('Error', 'Failed to sync account');
    }
  };

  const disconnectAccount = async (accountId: string) => {
    Alert.alert(
      'Account Verbreken',
      'Weet je zeker dat je deze bankverbinding wilt verbreken?',
      [
        { text: 'Annuleren', style: 'cancel' },
        {
          text: 'Verbreken',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`/api/bank/accounts/${accountId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'x-sm-user-id': 'test-user-id', // TODO: Get from auth context
                },
              });

              if (response.ok) {
                Alert.alert('Success', 'Account disconnected successfully');
                loadAccounts(); // Refresh list
              } else {
                Alert.alert('Error', 'Failed to disconnect account');
              }
            } catch (error) {
              console.error('Failed to disconnect account:', error);
              Alert.alert('Error', 'Failed to disconnect account');
            }
          },
        },
      ]
    );
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return 'card-outline';
      case 'savings':
        return 'wallet-outline';
      case 'credit':
        return 'card-outline';
      default:
        return 'card-outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actief';
      case 'inactive':
        return 'Inactief';
      case 'pending':
        return 'In behandeling';
      default:
        return 'Onbekend';
    }
  };

  const formatBalance = (balance: number, currency: string) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(balance);
  };

  const renderAccount = ({ item }: { item: BankAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <Ionicons
            name={getAccountIcon(item.type) as any}
            size={24}
            color="#007AFF"
          />
          <View style={styles.accountDetails}>
            <Text style={styles.accountName}>{item.name}</Text>
            <Text style={styles.accountNumber}>
              **** {item.accountNumber.slice(-4)}
            </Text>
          </View>
        </View>
        <View style={styles.accountActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => syncAccount(item.id)}
          >
            <Ionicons name="refresh" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => disconnectAccount(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.accountBalance}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <Text style={styles.balanceAmount}>
          {formatBalance(item.balance, item.currency)}
        </Text>
      </View>

      <View style={styles.accountFooter}>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
        {item.lastSync && (
          <Text style={styles.lastSyncText}>
            Laatste sync: {new Date(item.lastSync).toLocaleDateString('nl-NL')}
          </Text>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="card-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Geen bankaccounts</Text>
      <Text style={styles.emptyStateSubtitle}>
        Verbind je eerste bankaccount om te beginnen
      </Text>
      <TouchableOpacity
        style={styles.connectButton}
        onPress={connectBank}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.connectButtonText}>Bank Verbinden</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Bankaccounts laden...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bankaccounts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={connectBank}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Ionicons name="add" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Accounts List */}
      <FlatList
        data={accounts}
        renderItem={renderAccount}
        keyExtractor={(item) => item.id}
        style={styles.accountsList}
        contentContainerStyle={styles.accountsContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  addButton: {
    padding: 8,
  },
  accountsList: {
    flex: 1,
  },
  accountsContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    color: '#666',
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  accountBalance: {
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  lastSyncText: {
    fontSize: 12,
    color: '#999',
  },
});
