import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

export const SMButton: React.FC<{
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
}> = ({ title, onPress, style }) => {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]}> 
      <Text style={styles.txt}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  txt: { color: '#fff', fontWeight: '600' },
});

