import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../supabase';
import { handleAuthError, handleValidationError } from '../utils/errorHandler';
import { useAuthRateLimit } from '../hooks/useRateLimit';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Rate limiting for authentication
  const rateLimit = useAuthRateLimit();

  const validateInputs = (): boolean => {
    if (!email || !password) {
      handleValidationError(new Error('Vul alle velden in'));
      return false;
    }

    if (!email.includes('@')) {
      handleValidationError(new Error('Voer een geldig email adres in'));
      return false;
    }

    if (password.length < 6) {
      handleValidationError(new Error('Wachtwoord moet minimaal 6 karakters bevatten'));
      return false;
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateInputs()) {
      return;
    }

    // Check rate limiting
    if (rateLimit.isRateLimited()) {
      const remainingTime = Math.ceil(rateLimit.getRemainingBlockTime() / 1000 / 60);
      Alert.alert(
        'Te veel pogingen',
        `Je hebt te veel pogingen gedaan. Probeer het over ${remainingTime} minuten opnieuw.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.session) {
          Alert.alert(
            'Controleer je email',
            'We hebben een bevestigingslink gestuurd naar je email adres.'
          );
        } else if (data.session) {
          rateLimit.resetAttempts(); // Reset on success
          onLoginSuccess();
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          rateLimit.resetAttempts(); // Reset on success
          onLoginSuccess();
        }
      }
    } catch (error: unknown) {
      rateLimit.incrementAttempts(); // Increment on failure
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // Voor development/testing doeleinden
    Alert.alert(
      'Gast Login',
      'Je logt in als gast gebruiker. Dit is alleen voor development doeleinden.',
      [
        { text: 'Annuleren', style: 'cancel' },
        { text: 'Doorgaan', onPress: onLoginSuccess }
      ]
    );
  };

  const remainingAttempts = rateLimit.getRemainingAttempts();
  const isBlocked = rateLimit.isRateLimited();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>💰 Slim Minder</Text>
          <Text style={styles.subtitle}>Je persoonlijke budgetcoach</Text>
        </View>

        {isBlocked && (
          <View style={styles.rateLimitWarning}>
            <Text style={styles.rateLimitText}>
              ⚠️ Te veel pogingen. Probeer het later opnieuw.
            </Text>
          </View>
        )}

        <View style={styles.form}>
          <TextInput
            style={[styles.input, isBlocked && styles.inputDisabled]}
            placeholder="Email adres"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isBlocked}
          />

          <TextInput
            style={[styles.input, isBlocked && styles.inputDisabled]}
            placeholder="Wachtwoord"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isBlocked}
          />

          <TouchableOpacity
            style={[styles.button, (isLoading || isBlocked) && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={isLoading || isBlocked}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Bezig...' : (isSignUp ? 'Account aanmaken' : 'Inloggen')}
            </Text>
          </TouchableOpacity>

          {!isBlocked && (
            <>
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setIsSignUp(!isSignUp)}
              >
                <Text style={styles.switchButtonText}>
                  {isSignUp ? 'Al een account? Log in' : 'Nog geen account? Maak er een aan'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
              >
                <Text style={styles.guestButtonText}>
                  🧪 Gast Login (Development)
                </Text>
              </TouchableOpacity>
            </>
          )}

          {!isBlocked && remainingAttempts < 3 && (
            <Text style={styles.attemptsWarning}>
              Nog {remainingAttempts} pogingen over
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Door in te loggen ga je akkoord met onze voorwaarden
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputDisabled: {
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 16,
  },
  switchButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  guestButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
  },
  rateLimitWarning: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rateLimitText: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '600',
  },
  attemptsWarning: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
