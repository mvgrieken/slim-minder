import { User, LoginForm, RegisterForm, AccountTier } from '@/types';
import { supabase } from './api';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginForm): Promise<{ success: boolean; data?: AuthResponse; message?: string; errors?: string[] }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Login mislukt',
          errors: [error.message]
        };
      }

      if (data.user) {
        // Get user profile from user_profiles table
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: profile?.full_name?.split(' ')[0] || '',
          lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
          accountTier: profile?.account_tier || 'FREE',
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
          preferences: {
            notifications: {
              pushNotifications: true,
              emailNotifications: true,
              budgetAlerts: true,
              savingsReminders: true,
              weeklyReports: true,
            },
            privacy: {
              shareDataForAnalytics: false,
              allowPersonalizedTips: true,
              dataRetentionPeriod: 12,
            },
            accessibility: {
              largeFonts: false,
              highContrast: false,
              screenReaderSupport: false,
              reducedMotion: false,
            },
            language: 'nl',
          },
          profile: {
            dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined,
            occupation: undefined,
            monthlyIncome: undefined,
            householdSize: undefined,
            financialGoals: profile?.financial_goals ? JSON.parse(profile.financial_goals) : [],
          },
        };

        return {
          success: true,
          data: {
            user: userData,
            token: data.session?.access_token || '',
            refreshToken: data.session?.refresh_token || '',
          },
          message: 'Succesvol ingelogd'
        };
      }

      return {
        success: false,
        message: 'Login mislukt - geen gebruiker gevonden'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Er ging iets mis tijdens het inloggen',
        errors: [error.message]
      };
    }
  }

  async register(data: RegisterForm): Promise<{ success: boolean; data?: AuthResponse; message?: string; errors?: string[] }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            account_tier: 'FREE'
          }
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message || 'Registratie mislukt',
          errors: [error.message]
        };
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            full_name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            date_of_birth: new Date().toISOString().split('T')[0], // Default date
            account_tier: 'FREE',
            onboarding_completed: false,
            financial_goals: [],
            risk_profile: 'CONSERVATIVE',
            notification_preferences: {
              email: true,
              push: true,
              sms: false
            },
            privacy_settings: {
              share_data: false,
              marketing: false
            }
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Create gamification record
        const { error: gamificationError } = await supabase
          .from('gamification')
          .insert({
            user_id: authData.user.id,
            total_points: 0,
            level: 1,
            experience_points: 0,
            streak_days: 0,
            badges_earned: [],
            challenges_completed: [],
            achievements: {}
          });

        if (gamificationError) {
          console.error('Error creating gamification record:', gamificationError);
        }

        const userData: User = {
          id: authData.user.id,
          email: authData.user.email || '',
          firstName: data.firstName,
          lastName: data.lastName,
          accountTier: 'FREE',
          createdAt: new Date(authData.user.created_at),
          updatedAt: new Date(),
          preferences: {
            notifications: {
              pushNotifications: true,
              emailNotifications: true,
              budgetAlerts: true,
              savingsReminders: true,
              weeklyReports: true,
            },
            privacy: {
              shareDataForAnalytics: false,
              allowPersonalizedTips: true,
              dataRetentionPeriod: 12,
            },
            accessibility: {
              largeFonts: false,
              highContrast: false,
              screenReaderSupport: false,
              reducedMotion: false,
            },
            language: 'nl',
          },
          profile: {
            dateOfBirth: undefined,
            occupation: undefined,
            monthlyIncome: undefined,
            householdSize: undefined,
            financialGoals: [],
          },
        };

        return {
          success: true,
          data: {
            user: userData,
            token: authData.session?.access_token || '',
            refreshToken: authData.session?.refresh_token || '',
          },
          message: 'Account succesvol aangemaakt'
        };
      }

      return {
        success: false,
        message: 'Registratie mislukt - geen gebruiker aangemaakt'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Er ging iets mis tijdens de registratie',
        errors: [error.message]
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async verifyToken(): Promise<{ success: boolean; data?: User; message?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          message: 'Token verificatie mislukt'
        };
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      const userData: User = {
        id: user.id,
        email: user.email || '',
        firstName: profile?.full_name?.split(' ')[0] || '',
        lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
        accountTier: profile?.account_tier || 'FREE',
        createdAt: new Date(user.created_at),
        updatedAt: new Date(),
        preferences: {
          notifications: {
            pushNotifications: true,
            emailNotifications: true,
            budgetAlerts: true,
            savingsReminders: true,
            weeklyReports: true,
          },
          privacy: {
            shareDataForAnalytics: false,
            allowPersonalizedTips: true,
            dataRetentionPeriod: 12,
          },
          accessibility: {
            largeFonts: false,
            highContrast: false,
            screenReaderSupport: false,
            reducedMotion: false,
          },
          language: 'nl',
        },
        profile: {
          dateOfBirth: profile?.date_of_birth ? new Date(profile.date_of_birth) : undefined,
          occupation: undefined,
          monthlyIncome: undefined,
          householdSize: undefined,
          financialGoals: profile?.financial_goals ? JSON.parse(profile.financial_goals) : [],
        },
      };

      return {
        success: true,
        data: userData
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Token verificatie mislukt'
      };
    }
  }

  async getCurrentUser(): Promise<{ success: boolean; data?: User; message?: string }> {
    return this.verifyToken();
  }

  async updateAccountTier(tier: AccountTier): Promise<{ success: boolean; data?: User; message?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          message: 'Gebruiker niet gevonden'
        };
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ account_tier: tier })
        .eq('user_id', user.id);

      if (updateError) {
        return {
          success: false,
          message: 'Account upgrade mislukt'
        };
      }

      // Get updated user data
      return this.getCurrentUser();
    } catch (error: any) {
      return {
        success: false,
        message: 'Er ging iets mis tijdens de account upgrade'
      };
    }
  }

  async requestPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Kon reset e-mail niet verzenden'
        };
      }

      return {
        success: true,
        message: 'Reset instructies verzonden naar je e-mail'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Er ging iets mis bij het verzenden van de reset e-mail'
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Wachtwoord reset mislukt'
        };
      }

      return {
        success: true,
        message: 'Wachtwoord succesvol gewijzigd'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Er ging iets mis bij het wijzigen van het wachtwoord'
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; data?: User; message?: string }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return {
          success: false,
          message: 'Gebruiker niet gevonden'
        };
      }

      const profileUpdates: any = {};
      
      if (updates.firstName || updates.lastName) {
        profileUpdates.full_name = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
      }

      if (updates.profile?.dateOfBirth) {
        profileUpdates.date_of_birth = updates.profile.dateOfBirth.toISOString().split('T')[0];
      }

      if (updates.profile?.financialGoals) {
        profileUpdates.financial_goals = updates.profile.financialGoals;
      }

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update(profileUpdates)
        .eq('user_id', user.id);

      if (updateError) {
        return {
          success: false,
          message: 'Profiel update mislukt'
        };
      }

      return this.getCurrentUser();
    } catch (error: any) {
      return {
        success: false,
        message: 'Er ging iets mis bij het bijwerken van het profiel'
      };
    }
  }

  async deleteAccount(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );
      
      if (error) {
        return {
          success: false,
          message: error.message || 'Account verwijdering mislukt'
        };
      }

      return {
        success: true,
        message: 'Account succesvol verwijderd'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Er ging iets mis bij het verwijderen van het account'
      };
    }
  }

  // Two-Factor Authentication methods (placeholder implementations)
  async enableTwoFactor(): Promise<{ success: boolean; data?: { qrCode: string; backupCodes: string[] }; message?: string }> {
    return {
      success: false,
      message: 'Twee-factor authenticatie is nog niet geïmplementeerd'
    };
  }

  async verifyTwoFactor(code: string): Promise<{ success: boolean; message?: string }> {
    return {
      success: false,
      message: 'Twee-factor authenticatie is nog niet geïmplementeerd'
    };
  }

  async disableTwoFactor(code: string): Promise<{ success: boolean; message?: string }> {
    return {
      success: false,
      message: 'Twee-factor authenticatie is nog niet geïmplementeerd'
    };
  }

  // Refresh token handling
  async refreshToken(): Promise<{ success: boolean; data?: AuthResponse; message?: string }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return {
          success: false,
          message: 'Token refresh mislukt'
        };
      }

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: '',
          lastName: '',
          accountTier: 'FREE',
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
          preferences: {
            notifications: {
              pushNotifications: true,
              emailNotifications: true,
              budgetAlerts: true,
              savingsReminders: true,
              weeklyReports: true,
            },
            privacy: {
              shareDataForAnalytics: false,
              allowPersonalizedTips: true,
              dataRetentionPeriod: 12,
            },
            accessibility: {
              largeFonts: false,
              highContrast: false,
              screenReaderSupport: false,
              reducedMotion: false,
            },
            language: 'nl',
          },
          profile: {
            dateOfBirth: undefined,
            occupation: undefined,
            monthlyIncome: undefined,
            householdSize: undefined,
            financialGoals: [],
          },
        };

        return {
          success: true,
          data: {
            user: userData,
            token: data.session?.access_token || '',
            refreshToken: data.session?.refresh_token || '',
          }
        };
      }

      return {
        success: false,
        message: 'Token refresh mislukt'
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Token refresh mislukt'
      };
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!supabase.auth.getSession();
  }

  getToken(): string | null {
    // This will be handled by Supabase client
    return null;
  }

  clearTokens(): void {
    // This will be handled by Supabase client
  }
}

export const authService = new AuthService(); 