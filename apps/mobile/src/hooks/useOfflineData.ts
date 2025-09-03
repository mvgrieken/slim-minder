import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { apiService } from '../services/api';

interface CacheConfig {
  key: string;
  ttl?: number; // Time to live in milliseconds
}

interface OfflineDataState<T> {
  data: T | null;
  isLoading: boolean;
  isOnline: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

export const useOfflineData = <T>(
  endpoint: string,
  config: CacheConfig
) => {
  const [state, setState] = useState<OfflineDataState<T>>({
    data: null,
    isLoading: false,
    isOnline: true,
    lastUpdated: null,
    error: null
  });

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(networkState => {
      const isOnline = networkState.isConnected ?? false;
      setState(prevState => {
        // Auto-refresh when coming back online
        if (isOnline && prevState.data && prevState.lastUpdated) {
          const timeSinceUpdate = Date.now() - prevState.lastUpdated.getTime();
          const ttl = config.ttl || 5 * 60 * 1000; // Default 5 minutes
          
          if (timeSinceUpdate > ttl) {
            // Schedule refresh for next tick to avoid state update during render
            setTimeout(() => fetchData(), 0);
          }
        }
        
        return { ...prevState, isOnline };
      });
    });

    return unsubscribe;
  }, [endpoint]);

  // Load cached data on mount
  useEffect(() => {
    loadCachedData();
  }, []);

  const loadCachedData = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem(config.key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const ttl = config.ttl || 5 * 60 * 1000; // Default 5 minutes
        
        // Check if cache is still valid
        if (Date.now() - timestamp < ttl) {
          setState(prev => ({
            ...prev,
            data,
            lastUpdated: new Date(timestamp)
          }));
        }
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  }, [config.key, config.ttl]);

  const cacheData = useCallback(async (data: T) => {
    try {
      const cacheEntry = {
        data,
        timestamp: Date.now()
      };
      await AsyncStorage.setItem(config.key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }, [config.key]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (!state.isOnline && !forceRefresh) {
      return; // Don't fetch if offline unless forced
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      let response: any;
      
      switch (endpoint) {
        case 'transactions':
          response = await apiService.getTransactions();
          break;
        case 'budgets':
          response = await apiService.getBudgets();
          break;
        case 'goals':
          response = await apiService.getGoals();
          break;
        case 'accounts':
          response = await apiService.getBankAccounts();
          break;
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }

      if (response.success && response.data) {
        await cacheData(response.data as T);
        setState(prevState => ({
          ...prevState,
          data: response.data as T,
          lastUpdated: new Date(),
          isLoading: false,
          error: null
        }));
      } else {
        throw new Error(response.error || 'Failed to fetch data');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }, [endpoint, state.isOnline, cacheData]);

  const refreshData = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(config.key);
      setState(prev => ({
        ...prev,
        data: null,
        lastUpdated: null
      }));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [config.key]);

  return {
    ...state,
    fetchData,
    refreshData,
    clearCache,
    loadCachedData
  };
};

// Convenience hooks for specific data types
export const useTransactions = () => 
  useOfflineData('transactions', { key: 'transactions_cache', ttl: 2 * 60 * 1000 });

export const useBudgets = () => 
  useOfflineData('budgets', { key: 'budgets_cache', ttl: 5 * 60 * 1000 });

export const useGoals = () => 
  useOfflineData('goals', { key: 'goals_cache', ttl: 10 * 60 * 1000 });

export const useBankAccounts = () => 
  useOfflineData('accounts', { key: 'accounts_cache', ttl: 15 * 60 * 1000 });
