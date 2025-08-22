import { AppError } from '@/types';

// Image URL utilities
export const buildImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) {
    return 'https://placehold.co/600x400/1a1a1a/FFFFFF.png?text=No+Image';
  }
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const buildBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) {
    return 'https://placehold.co/1920x1080/1a1a1a/FFFFFF.png?text=No+Backdrop';
  }
  
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Date utilities
export const formatDate = (dateString: string, format: 'year' | 'full' | 'short' = 'year'): string => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  switch (format) {
    case 'year':
      return date.getFullYear().toString();
    case 'short':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'full':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    default:
      return date.getFullYear().toString();
  }
};

export const getRelativeTime = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

// Rating utilities
export const formatRating = (rating: number, maxRating: number = 10): number => {
  if (rating <= 0) return 0;
  if (rating > maxRating) return maxRating;
  return Math.round(rating);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 8) return '#22c55e'; // Green for high ratings
  if (rating >= 6) return '#eab308'; // Yellow for medium ratings
  if (rating >= 4) return '#f97316'; // Orange for low-medium ratings
  return '#ef4444'; // Red for low ratings
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Error handling utilities
export const createError = (message: string, code?: string, details?: unknown): AppError => {
  return {
    message,
    code: code || undefined,
    details,
  };
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('Network request failed') || 
           error.message.includes('fetch') ||
           error.message.includes('timeout');
  }
  return false;
};

// Validation utilities
export const isValidMovieId = (id: string | number): boolean => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
};

export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Performance utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Array utilities
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
