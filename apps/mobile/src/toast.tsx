import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Toast = { id: number; type: 'info'|'success'|'error'; message: string };
type Ctx = { show: (msg: string, type?: Toast['type']) => void };
const ToastCtx = createContext<Ctx>({ show: () => {} });

export function useToast() { return useContext(ToastCtx); }

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [items, setItems] = useState<Toast[]>([]);
  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, type, message }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 2500);
  }, []);
  const value = useMemo(() => ({ show }), [show]);
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <View pointerEvents="none" style={styles.wrap}>
        {items.map(t => (
          <View key={t.id} style={[styles.toast, t.type === 'success' ? styles.succ : t.type === 'error' ? styles.err : styles.info]}>
            <Text style={styles.text}>{t.message}</Text>
          </View>
        ))}
      </View>
    </ToastCtx.Provider>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' },
  toast: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 8, maxWidth: '90%' },
  text: { color: '#fff' },
  info: { backgroundColor: '#374151' },
  succ: { backgroundColor: '#16a34a' },
  err: { backgroundColor: '#dc2626' },
});

