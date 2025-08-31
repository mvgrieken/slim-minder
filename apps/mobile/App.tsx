import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { PSD2Connect } from './src/components/PSD2Connect';

export default function App() {
  const [accounts, setAccounts] = useState<any[]>([]);

  const handlePSD2Connect = (authUrl: string) => {
    Alert.alert(
      'Bank Verbinding',
      'Je wordt doorgestuurd naar je bank om de verbinding te autoriseren.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Doorgaan', onPress: () => console.log('Opening:', authUrl) }
      ]
    );
  };

  const handlePSD2Success = (newAccounts: any[]) => {
    setAccounts(newAccounts);
    Alert.alert('Succes!', 'Je bankrekening is succesvol verbonden.');
  };

  const handlePSD2Error = (error: string) => {
    Alert.alert('Error', `Er is een fout opgetreden: ${error}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Slim Minder</Text>
        <Text style={styles.subtitle}>Je persoonlijke budgetcoach</Text>
        <Text style={styles.description}>
          Welkom bij Slim Minder! Deze app helpt je om gezonder met geld om te gaan.
        </Text>
      </View>

      <PSD2Connect
        onConnect={handlePSD2Connect}
        onSuccess={handlePSD2Success}
        onError={handlePSD2Error}
      />

      {accounts.length > 0 && (
        <View style={styles.accountsContainer}>
          <Text style={styles.accountsTitle}>🏦 Je Rekeningen</Text>
          {accounts.map((account) => (
            <View key={account.id} style={styles.accountItem}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>
                €{account.balance.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>✨ Features</Text>
        <Text style={styles.feature}>📊 Budgetten instellen en bijhouden</Text>
        <Text style={styles.feature}>💰 Uitgaven categoriseren</Text>
        <Text style={styles.feature}>🎯 Spaardoelen stellen</Text>
        <Text style={styles.feature}>🔔 Slimme waarschuwingen</Text>
        <Text style={styles.feature}>🏦 PSD2 Bank integratie</Text>
        <Text style={styles.feature}>🤖 AI Coaching</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
    maxWidth: 400,
  },
  accountsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  accountName: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  accountBalance: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
  },
  features: {
    padding: 20,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 8,
  },
});
