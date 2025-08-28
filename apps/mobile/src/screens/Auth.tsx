import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { supabase } from '../supabase';
import { useToast } from '../toast';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function sendCode() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
      if (error) throw error;
      setCodeSent(true);
      toast.show('Er is een code naar je e-mail gestuurd', 'success');
    } catch (e: any) {
      toast.show(`Verzenden mislukt: ${e.message || e}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    if (!email.trim() || !otp.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type: 'email' });
      if (error) throw error;
      toast.show('Ingelogd', 'success');
    } catch (e: any) {
      toast.show(`Verifiëren mislukt: ${e.message || e}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Inloggen</Text>
      {!codeSent ? (
        <View style={{ width: '100%' }}>
          <TextInput placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
          <Pressable onPress={sendCode} disabled={!email || loading} style={[styles.btn, (!email || loading) && styles.btnDisabled]}>
            <Text style={styles.btnTxt}>{loading ? 'Versturen…' : 'Stuur code'}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          <Text style={styles.sub}>Voer de code uit je e-mail in</Text>
          <TextInput placeholder="6-cijferige code" keyboardType="number-pad" value={otp} onChangeText={setOtp} style={styles.input} />
          <Pressable onPress={verifyCode} disabled={!otp || loading} style={[styles.btn, (!otp || loading) && styles.btnDisabled]}>
            <Text style={styles.btnTxt}>{loading ? 'Inloggen…' : 'Log in'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  h1: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  sub: { color: '#666', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, height: 44, marginBottom: 10 },
  btn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#9ca3af' },
  btnTxt: { color: '#fff', fontWeight: '600' },
});

