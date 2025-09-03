import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  onLimitReached?: () => void;
}

export const useRateLimit = (config: RateLimitConfig) => {
  const { maxAttempts, windowMs, onLimitReached } = config;
  
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const lastAttemptRef = useRef<number>(0);
  const blockUntilRef = useRef<number>(0);

  const isRateLimited = useCallback(() => {
    const now = Date.now();
    
    // Check if still blocked
    if (isBlocked && now < blockUntilRef.current) {
      return true;
    }
    
    // Reset block if time has passed
    if (isBlocked && now >= blockUntilRef.current) {
      setIsBlocked(false);
      setAttempts(0);
      return false;
    }
    
    // Check if window has passed
    if (now - lastAttemptRef.current > windowMs) {
      setAttempts(0);
      return false;
    }
    
    return attempts >= maxAttempts;
  }, [attempts, maxAttempts, windowMs, isBlocked]);

  const incrementAttempts = useCallback(() => {
    const now = Date.now();
    lastAttemptRef.current = now;
    
    setAttempts(prev => {
      const newAttempts = prev + 1;
      
      if (newAttempts >= maxAttempts) {
        // Block for the remaining window time
        const remainingTime = windowMs - (now - lastAttemptRef.current);
        blockUntilRef.current = now + remainingTime;
        setIsBlocked(true);
        
        if (onLimitReached) {
          onLimitReached();
        }
      }
      
      return newAttempts;
    });
  }, [maxAttempts, windowMs, onLimitReached]);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setIsBlocked(false);
    blockUntilRef.current = 0;
  }, []);

  const getRemainingBlockTime = useCallback(() => {
    if (!isBlocked) return 0;
    return Math.max(0, blockUntilRef.current - Date.now());
  }, [isBlocked]);

  const getRemainingAttempts = useCallback(() => {
    return Math.max(0, maxAttempts - attempts);
  }, [maxAttempts, attempts]);

  return {
    isRateLimited,
    incrementAttempts,
    resetAttempts,
    getRemainingBlockTime,
    getRemainingAttempts,
    attempts,
    isBlocked
  };
};

// Pre-configured rate limiters
export const useAuthRateLimit = () => 
  useRateLimit({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    onLimitReached: () => {
      console.warn('Rate limit reached for authentication');
    }
  });

export const useApiRateLimit = () => 
  useRateLimit({
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
    onLimitReached: () => {
      console.warn('Rate limit reached for API calls');
    }
  });
