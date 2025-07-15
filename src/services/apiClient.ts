import { toast } from 'react-hot-toast';

// API base URL - in production this would come from environment variables
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${url}`, config);
      
      if (!response.ok) {
        // Handle 401 unauthorized errors
        if (response.status === 401) {
          await this.handleAuthError();
        }
        
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || 'Er ging iets mis') as any;
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      const data = await response.json().catch(() => null);
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      this.handleError(error as ApiError);
      throw error;
    }
  }

  private handleError(error: ApiError) {
    const status = error.status;
    const message = error.message || 'Er ging iets mis';

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
  }

  private async handleAuthError() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    
    // Only redirect if we're not already on login page
    if (!window.location.pathname.includes('/login')) {
      toast.error('Je sessie is verlopen. Log opnieuw in.');
      window.location.href = '/login';
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET', ...config });
  }

  async post<T>(url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async put<T>(url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async patch<T>(url: string, data?: any, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config,
    });
  }

  async delete<T>(url: string, config?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE', ...config });
  }

  // File upload method
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = new Error('Upload mislukt') as any;
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  // Download file method
  async downloadFile(url: string, filename?: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Download mislukt');
      }

      const blob = await response.blob();
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
export type { ApiResponse, ApiError }; 