import { Alert } from 'react-native';

export interface ErrorConfig {
  title?: string;
  fallbackMessage?: string;
  showAlert?: boolean;
  logError?: boolean;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (
  error: unknown, 
  config: ErrorConfig = {}
): string => {
  const {
    title = 'Fout',
    fallbackMessage = 'Er is een fout opgetreden',
    showAlert = true,
    logError = true
  } = config;

  // Log error voor debugging
  if (logError) {
    console.error('App Error:', error);
  }

  // Bepaal gebruikersvriendelijke bericht
  let userMessage = fallbackMessage;
  
  if (error instanceof AppError) {
    userMessage = error.userMessage || error.message;
  } else if (error instanceof Error) {
    // Alleen veilige error messages tonen
    const safeMessages = [
      'Invalid credentials',
      'User not found',
      'Network request failed',
      'Invalid email format',
      'Password too short'
    ];
    
    if (safeMessages.some(safe => error.message.includes(safe))) {
      userMessage = error.message;
    }
  }

  // Toon alert indien gewenst
  if (showAlert) {
    Alert.alert(title, userMessage);
  }

  return userMessage;
};

export const createAppError = (
  message: string,
  code?: string,
  userMessage?: string
): AppError => {
  return new AppError(message, code, userMessage);
};

// Specifieke error handlers
export const handleAuthError = (error: unknown): void => {
  handleError(error, {
    title: 'Authenticatie Fout',
    fallbackMessage: 'Er is een fout opgetreden bij het inloggen',
    showAlert: true
  });
};

export const handleApiError = (error: unknown): void => {
  handleError(error, {
    title: 'Netwerk Fout',
    fallbackMessage: 'Kon geen verbinding maken met de server',
    showAlert: true
  });
};

export const handleValidationError = (error: unknown): void => {
  handleError(error, {
    title: 'Validatie Fout',
    fallbackMessage: 'Controleer je invoer en probeer opnieuw',
    showAlert: true
  });
};
