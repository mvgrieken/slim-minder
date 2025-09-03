import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📱 Je werkt offline</Text>
      <Text style={styles.subtext}>Data wordt gecached en gesynchroniseerd wanneer je weer online bent</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#92400E',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
  },
  subtext: {
    color: '#92400E',
    fontSize: 12,
    textAlign: 'center',
  },
});
