import { toast } from 'react-hot-toast';
import { API_CONFIG, logger, performance } from '../utils/environment';

// API base URL - in production this would come from environment variables
const API_BASE_URL = API_CONFIG.baseUrl;

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
    const requestId = Math.random().toString(36).substr(2, 9);
    const startTime = Date.now();
    
    // Performance monitoring
    performance.mark(`api-request-start-${requestId}`);
    
    logger.debug(`API Request [${requestId}]:`, {
      method: options.method || 'GET',
      url: `${this.baseURL}${url}`,
      options: { ...options, headers: options.headers ? Object.keys(options.headers) : [] }
    });

    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    let retryCount = 0;
    const maxRetries = API_CONFIG.retries;

    while (retryCount <= maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
        
        const response = await fetch(`${this.baseURL}${url}`, {
          ...config,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        const duration = Date.now() - startTime;
        performance.mark(`api-request-end-${requestId}`);
        performance.measure(`api-request-${requestId}`, `api-request-start-${requestId}`, `api-request-end-${requestId}`);
        
        logger.debug(`API Response [${requestId}]:`, {
          status: response.status,
          duration: `${duration}ms`,
          retry: retryCount > 0 ? retryCount : undefined
        });
        
        if (!response.ok) {
          // Handle 401 unauthorized errors
          if (response.status === 401) {
            await this.handleAuthError();
          }
          
          // Handle specific retry scenarios
          if (this.shouldRetry(response.status) && retryCount < maxRetries) {
            retryCount++;
            logger.warn(`Retrying request [${requestId}] (${retryCount}/${maxRetries})...`);
            await this.delay(1000 * retryCount); // Exponential backoff
            continue;
          }
          
          const errorData = await response.json().catch(() => ({}));
          const error = new Error(errorData.message || 'Er ging iets mis') as any;
          error.status = response.status;
          error.data = errorData;
          error.requestId = requestId;
          throw error;
        }

        const data = await response.json().catch(() => null);
        
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      } catch (error: any) {
        if (error.name === 'AbortError') {
          error.message = 'Request timeout';
          error.status = 408;
        }
        
        if (retryCount < maxRetries && this.shouldRetryError(error)) {
          retryCount++;
          logger.warn(`Retrying request [${requestId}] after error (${retryCount}/${maxRetries}):`, error.message);
          await this.delay(1000 * retryCount);
          continue;
        }
        
        logger.error(`API Error [${requestId}]:`, {
          message: error.message,
          status: error.status,
          duration: `${Date.now() - startTime}ms`,
          retries: retryCount
        });
        
        this.handleError(error as ApiError);
        throw error;
      }
    }
    
    // This should never be reached, but TypeScript requires it
    throw new Error('Maximum retries exceeded');
  }

  private shouldRetry(status: number): boolean {
    // Retry on server errors and rate limiting
    return status >= 500 || status === 429;
  }

  private shouldRetryError(error: any): boolean {
    // Retry on network errors and timeouts
    return error.name === 'AbortError' || 
           error.message.includes('fetch') || 
           error.message.includes('network');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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