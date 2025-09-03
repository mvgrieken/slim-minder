import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PSD2Connect } from '../PSD2Connect';

interface ProfileContainerProps {
  user: any;
  isConnected: boolean;
  onPSD2Connect: (authUrl: string) => void;
  onPSD2Success: (accounts: any[]) => void;
  onPSD2Error: (error: string) => void;
  onLogout: () => void;
}

export const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  isConnected,
  onPSD2Connect,
  onPSD2Success,
  onPSD2Error,
  onLogout
}) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👤 Profiel</Text>
        <Text style={styles.subtitle}>Beheer je account en instellingen</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Account Informatie</Text>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Email</Text>
          <Text style={styles.profileValue}>{user?.email || 'Onbekend'}</Text>
        </View>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Lid sinds</Text>
          <Text style={styles.profileValue}>
            {user?.created_at ? new Date(user.created_at).toLocaleDateString('nl-NL') : 'Onbekend'}
          </Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Bank Integratie</Text>
        <View style={styles.profileItem}>
          <Text style={styles.profileLabel}>Status</Text>
          <Text style={[styles.profileValue, { color: isConnected ? '#10B981' : '#EF4444' }]}>
            {isConnected ? 'Verbonden' : 'Niet verbonden'}
          </Text>
        </View>
        {!isConnected && (
          <PSD2Connect
            onConnect={onPSD2Connect}
            onSuccess={onPSD2Success}
            onError={onPSD2Error}
          />
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Uitloggen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  profileSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  profileLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  profileValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
