import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../supabase';
import { SMButton } from '../../../packages/ui/src/components/SMButton';
import { useForm, Controller } from 'react-hook-form';

interface AuthFormData {
  email: string;
  password: string;
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<AuthFormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    try {
      if (isPasswordReset) {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: 'slimminder://reset-password',
        });
        
        if (error) throw error;
        
        Alert.alert(
          'Wachtwoord reset',
          'Er is een e-mail verzonden met instructies om je wachtwoord te resetten.',
          [{ text: 'OK' }]
        );
        setIsPasswordReset(false);
        reset();
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        
        if (error) throw error;
        
        Alert.alert(
          'Account aangemaakt',
          'Er is een bevestigingsmail verzonden naar je e-mailadres.',
          [{ text: 'OK' }]
        );
        setIsLogin(true);
        reset();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert(
        'Fout',
        error.message || 'Er is iets misgegaan. Probeer het opnieuw.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onGuestLogin = async () => {
    setLoading(true);
    try {
      // Create a guest user or use a demo account
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@slimminder.app',
        password: 'demo123',
      });
      
      if (error) {
        // If demo account doesn't exist, create a guest session
        const { error: guestError } = await supabase.auth.signInAnonymously();
        if (guestError) throw guestError;
      }
    } catch (error: any) {
      console.error('Guest login error:', error);
      Alert.alert(
        'Fout',
        'Kon niet inloggen als gast. Probeer het opnieuw.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsPasswordReset(false);
    reset();
  };

  const togglePasswordReset = () => {
    setIsPasswordReset(!isPasswordReset);
    reset();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>💰</Text>
            <Text style={styles.title}>Slim Minder</Text>
            <Text style={styles.subtitle}>
              Je persoonlijke budgetcoach
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isPasswordReset 
                ? 'Wachtwoord resetten'
                : isLogin 
                  ? 'Welkom terug'
                  : 'Maak je account'
              }
            </Text>

            <Controller
              control={control}
              name="email"
              rules={{ 
                required: 'E-mail is verplicht',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Voer een geldig e-mailadres in'
                }
              }}
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>E-mail</Text>
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="jouw@email.nl"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholderTextColor="#94A3B8"
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </View>
              )}
            />

            {!isPasswordReset && (
              <Controller
                control={control}
                name="password"
                rules={{ 
                  required: 'Wachtwoord is verplicht',
                  minLength: {
                    value: 6,
                    message: 'Wachtwoord moet minimaal 6 karakters bevatten'
                  }
                }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Wachtwoord</Text>
                    <TextInput
                      style={[styles.input, errors.password && styles.inputError]}
                      placeholder="••••••••"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#94A3B8"
                    />
                    {errors.password && (
                      <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}
                  </View>
                )}
              />
            )}

            {/* Submit Button */}
            <SMButton
              title={
                loading 
                  ? 'Bezig...'
                  : isPasswordReset
                    ? 'Reset wachtwoord'
                    : isLogin
                      ? 'Inloggen'
                      : 'Account aanmaken'
              }
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="large"
              loading={loading}
              fullWidth
              style={styles.submitButton}
            />

            {/* Mode Toggle */}
            {!isPasswordReset && (
              <TouchableOpacity
                style={styles.modeToggle}
                onPress={toggleMode}
                disabled={loading}
              >
                <Text style={styles.modeToggleText}>
                  {isLogin 
                    ? 'Nog geen account? Maak er een aan'
                    : 'Al een account? Log in'
                  }
                </Text>
              </TouchableOpacity>
            )}

            {/* Password Reset */}
            {isLogin && !isPasswordReset && (
              <TouchableOpacity
                style={styles.passwordReset}
                onPress={togglePasswordReset}
                disabled={loading}
              >
                <Text style={styles.passwordResetText}>
                  Wachtwoord vergeten?
                </Text>
              </TouchableOpacity>
            )}

            {/* Back to Login */}
            {isPasswordReset && (
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={togglePasswordReset}
                disabled={loading}
              >
                <Text style={styles.backToLoginText}>
                  Terug naar inloggen
                </Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>of</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Guest Login */}
            <SMButton
              title="Probeer als gast"
              onPress={onGuestLogin}
              variant="outline"
              size="large"
              loading={loading}
              fullWidth
              style={styles.guestButton}
            />

            {/* Features */}
            <View style={styles.features}>
              <Text style={styles.featuresTitle}>Wat kun je met Slim Minder?</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📊</Text>
                  <Text style={styles.featureText}>Budgetten instellen en bijhouden</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>💰</Text>
                  <Text style={styles.featureText}>Uitgaven categoriseren</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🎯</Text>
                  <Text style={styles.featureText}>Spaardoelen stellen</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🔔</Text>
                  <Text style={styles.featureText}>Slimme waarschuwingen</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 8,
  },
  modeToggle: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  modeToggleText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  passwordReset: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  passwordResetText: {
    fontSize: 14,
    color: '#64748B',
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  backToLoginText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#64748B',
  },
  guestButton: {
    marginBottom: 32,
  },
  features: {
    marginTop: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
});

