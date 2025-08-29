import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Slim Minder</Text>
      <Text style={styles.subtitle}>Je persoonlijke budgetcoach</Text>
      <Text style={styles.description}>
        Welkom bij Slim Minder! Deze app helpt je om gezonder met geld om te gaan.
      </Text>
      <View style={styles.features}>
        <Text style={styles.feature}>📊 Budgetten instellen en bijhouden</Text>
        <Text style={styles.feature}>💰 Uitgaven categoriseren</Text>
        <Text style={styles.feature}>🎯 Spaardoelen stellen</Text>
        <Text style={styles.feature}>🔔 Slimme waarschuwingen</Text>
      </View>
      <Text style={styles.comingSoon}>
        🚀 Volledige app komt binnenkort beschikbaar!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 400,
  },
  features: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  comingSoon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
});
