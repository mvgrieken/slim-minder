import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AccountTier, LoginForm, RegisterForm, ApiResponse } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  updateAccountTier: (tier: AccountTier) => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const response = await authService.verifyToken();
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      } else {
        localStorage.removeItem('auth_token');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials: LoginForm) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Login mislukt' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Er ging iets mis tijdens het inloggen' });
    }
  };

  const register = async (data: RegisterForm) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        localStorage.setItem('auth_token', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Registratie mislukt' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Er ging iets mis tijdens de registratie' });
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateAccountTier = async (tier: AccountTier) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authService.updateAccountTier(tier);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Account upgrade mislukt' });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Er ging iets mis tijdens de account upgrade' });
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateAccountTier,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes based on account tier
export function withAccountTier(Component: React.ComponentType, requiredTier: AccountTier) {
  return function ProtectedComponent(props: any) {
    const { user, isAuthenticated } = useAuth();
    
    if (!isAuthenticated || !user) {
      return <div>Please log in to access this feature</div>;
    }

    const tierLevel = {
      FREE: 1,
      CORE: 2,
      PREMIUM: 3,
    };

    if (tierLevel[user.accountTier] < tierLevel[requiredTier]) {
      return (
        <div className="upgrade-prompt">
          <h3>Upgrade Required</h3>
          <p>This feature requires a {requiredTier} account.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
} 