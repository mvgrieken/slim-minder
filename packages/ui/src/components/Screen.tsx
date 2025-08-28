import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';

export const Screen: React.FC<React.PropsWithChildren<{ padded?: boolean }>> = ({ padded = true, children }) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.inner, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1 },
  padded: { padding: 16 },
});

