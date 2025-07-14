import { ApiResponse, User, LoginForm, RegisterForm, AccountTier } from '@/types';
import { apiClient } from './apiClient';

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  private readonly baseUrl = '/auth';

  async login(credentials: LoginForm): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
      return {
        success: true,
        data: response.data,
        message: 'Succesvol ingelogd'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login mislukt',
        errors: error.response?.data?.errors
      };
    }
  }

  async register(data: RegisterForm): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, data);
      return {
        success: true,
        data: response.data,
        message: 'Account succesvol aangemaakt'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registratie mislukt',
        errors: error.response?.data?.errors
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/logout`);
    } catch (error) {
      // Even if logout fails on server, we still clear local storage
      console.error('Logout error:', error);
    }
  }

  async verifyToken(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/verify`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Token verificatie mislukt'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<User>(`${this.baseUrl}/me`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Kon gebruikersgegevens niet ophalen'
      };
    }
  }

  async updateAccountTier(tier: AccountTier): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<User>(`${this.baseUrl}/upgrade`, { accountTier: tier });
      return {
        success: true,
        data: response.data,
        message: `Account geüpgraded naar ${tier}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Account upgrade mislukt'
      };
    }
  }

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(`${this.baseUrl}/forgot-password`, { email });
      return {
        success: true,
        message: 'Reset instructies verzonden naar je e-mail'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Kon reset e-mail niet verzenden'
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(`${this.baseUrl}/reset-password`, { token, password: newPassword });
      return {
        success: true,
        message: 'Wachtwoord succesvol gewijzigd'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Wachtwoord reset mislukt'
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.patch<User>(`${this.baseUrl}/profile`, updates);
      return {
        success: true,
        data: response.data,
        message: 'Profiel succesvol bijgewerkt'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profiel update mislukt'
      };
    }
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    try {
      await apiClient.delete(`${this.baseUrl}/account`);
      return {
        success: true,
        message: 'Account succesvol verwijderd'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Account verwijdering mislukt'
      };
    }
  }

  // Two-Factor Authentication methods
  async enableTwoFactor(): Promise<ApiResponse<{ qrCode: string; backupCodes: string[] }>> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/2fa/enable`);
      return {
        success: true,
        data: response.data,
        message: 'Twee-factor authenticatie ingeschakeld'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Kon 2FA niet inschakelen'
      };
    }
  }

  async verifyTwoFactor(code: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(`${this.baseUrl}/2fa/verify`, { code });
      return {
        success: true,
        message: '2FA verificatie succesvol'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || '2FA verificatie mislukt'
      };
    }
  }

  async disableTwoFactor(code: string): Promise<ApiResponse<void>> {
    try {
      await apiClient.post(`${this.baseUrl}/2fa/disable`, { code });
      return {
        success: true,
        message: 'Twee-factor authenticatie uitgeschakeld'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Kon 2FA niet uitschakelen'
      };
    }
  }

  // Refresh token handling
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/refresh`, {
        refreshToken
      });
      return {
        success: true,
        data: response.data
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
    return !!localStorage.getItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setTokens(authToken: string, refreshToken?: string): void {
    localStorage.setItem('auth_token', authToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

export const authService = new AuthService(); 