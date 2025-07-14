import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// API base URL - in production this would come from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', {
                refreshToken,
              });

              const { token, refreshToken: newRefreshToken } = response.data;
              localStorage.setItem('auth_token', token);
              if (newRefreshToken) {
                localStorage.setItem('refresh_token', newRefreshToken);
              }

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle other errors
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'Er ging iets mis';

      switch (status) {
        case 400:
          toast.error(`Ongeldige aanvraag: ${message}`);
          break;
        case 401:
          this.handleAuthError();
          break;
        case 403:
          toast.error('Je hebt geen toegang tot deze functionaliteit');
          break;
        case 404:
          toast.error('De gevraagde resource werd niet gevonden');
          break;
        case 429:
          toast.error('Te veel aanvragen. Probeer het later opnieuw.');
          break;
        case 500:
          toast.error('Server fout. Probeer het later opnieuw.');
          break;
        default:
          toast.error(message);
      }
    } else if (error.request) {
      // Network error
      toast.error('Netwerkfout. Controleer je internetverbinding.');
    } else {
      // Other error
      toast.error('Er ging iets mis. Probeer het opnieuw.');
    }
  }

  private handleAuthError() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // Only redirect if we're not already on login page
    if (!window.location.pathname.includes('/login')) {
      toast.error('Je sessie is verlopen. Log opnieuw in.');
      window.location.href = '/login';
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });
  }

  // Download file method
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Download mislukt');
      throw error;
    }
  }

  // Set auth token manually (useful for testing)
  setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Clear auth token
  clearAuthToken() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiClient = new ApiClient();

// Export types for use in other services
export type { AxiosResponse, AxiosError }; 