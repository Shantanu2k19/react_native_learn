import { AppError, UseFetchReturn } from '@/types';
import { createError, isNetworkError } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseFetchOptions {
  immediate?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  preventInfiniteRetry?: boolean;
}

export function useFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const {
    immediate = true,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    preventInfiniteRetry = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasConfigurationError = useRef(false);

  const execute = useCallback(async () => {
    // Don't retry if we have a configuration error
    if (hasConfigurationError.current && preventInfiniteRetry) {
      console.warn('Warning: Skipping API call due to configuration error');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setLoading(false);
      retryCountRef.current = 0;
      hasConfigurationError.current = false;
      onSuccess?.(result);
    } catch (err) {
      const appError = createError(
        err instanceof Error ? err.message : 'An unknown error occurred',
        isNetworkError(err) ? 'NETWORK_ERROR' : 'API_ERROR',
        err
      );

      // Check if this is a configuration error
      if (err instanceof Error && (
        err.message.includes('API key') || 
        err.message.includes('not configured') ||
        err.message.includes('CONFIGURATION_ERROR')
      )) {
        hasConfigurationError.current = true;
        setError(appError.message);
        setLoading(false);
        onError?.(appError);
        console.error('Blocked: Configuration error detected, preventing further retries');
        return;
      }

      setError(appError.message);
      setLoading(false);
      onError?.(appError);

      // Retry logic for network errors only (not configuration errors)
      if (isNetworkError(err) && retryCountRef.current < retryCount && !hasConfigurationError.current) {
        retryCountRef.current++;
        console.warn(`Retrying... (${retryCountRef.current}/${retryCount})`);
        
        setTimeout(() => {
          execute();
        }, retryDelay * retryCountRef.current);
      } else if (retryCountRef.current >= retryCount) {
        console.error('Error: Max retries reached, stopping');
      }
    }
  }, [fetcher, retryCount, retryDelay, onSuccess, onError, preventInfiniteRetry]);

  const refetch = useCallback(async () => {
    // Reset configuration error flag on manual refetch
    hasConfigurationError.current = false;
    retryCountRef.current = 0;
    await execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Specialized hook for movie data
export function useMovieFetch<T>(
  fetcher: () => Promise<T>,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  return useFetch(fetcher, {
    retryCount: 2,
    retryDelay: 2000,
    preventInfiniteRetry: true,
    ...options,
  });
}

// Hook for paginated data
export function usePaginatedFetch<T>(
  fetcher: (page: number) => Promise<{ results: T[]; total_pages: number }>,
  options: UseFetchOptions & { initialPage?: number } = {}
): UseFetchReturn<{ results: T[]; total_pages: number }> & {
  page: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
} {
  const { initialPage = 1, ...fetchOptions } = options;
  const [page, setPage] = useState(initialPage);
  const [allResults, setAllResults] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { loading, error, refetch } = useFetch(
    () => fetcher(page),
    {
      ...fetchOptions,
      onSuccess: (data) => {
        if (page === 1) {
          setAllResults(data.results);
        } else {
          setAllResults(prev => [...prev, ...data.results]);
        }
        setTotalPages(data.total_pages);
        fetchOptions.onSuccess?.(data);
      },
    }
  );

  const hasMore = page < totalPages;

  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllResults([]);
    refetch();
  }, [refetch]);

  return {
    data: { results: allResults, total_pages: totalPages },
    loading,
    error,
    refetch,
    page,
    hasMore,
    loadMore,
    refresh,
  };
}
