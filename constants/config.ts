// App Configuration
export const APP_CONFIG = {
  name: process.env.EXPO_PUBLIC_APP_NAME || 'Movie App',
  version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  defaultTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

// Image Sizes
export const IMAGE_SIZES = {
  poster: {
    small: 'w92',
    medium: 'w154',
    large: 'w185',
    xlarge: 'w342',
    xxlarge: 'w500',
    xxxlarge: 'w780',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
} as const;

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
  defaultPage: 1,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  movieDetails: 5 * 60 * 1000, // 5 minutes
  movieList: 2 * 60 * 1000, // 2 minutes
  trendingMovies: 10 * 60 * 1000, // 10 minutes
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: {
    noConnection: 'No internet connection. Please check your network settings.',
    timeout: 'Request timed out. Please try again.',
    serverError: 'Server error. Please try again later.',
    unknown: 'An unknown error occurred. Please try again.',
  },
  validation: {
    invalidMovieId: 'Invalid movie ID provided.',
    emptySearchQuery: 'Search query cannot be empty.',
    invalidGenreId: 'Invalid genre ID provided.',
  },
  general: {
    somethingWentWrong: 'Something went wrong. Please try again.',
    tryAgain: 'Please try again.',
    notFound: 'The requested resource was not found.',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  movieLoaded: 'Movie loaded successfully.',
  searchCompleted: 'Search completed successfully.',
  refreshCompleted: 'Content refreshed successfully.',
} as const;

// Loading States
export const LOADING_STATES = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  userPreferences: 'user_preferences',
  searchHistory: 'search_history',
  favoriteMovies: 'favorite_movies',
  recentlyViewed: 'recently_viewed',
  appSettings: 'app_settings',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableSearchHistory: true,
  enableFavorites: true,
  enableOfflineMode: false,
  enablePushNotifications: false,
  enableAnalytics: true,
} as const;

// Accessibility
export const ACCESSIBILITY = {
  minimumTouchTargetSize: 44,
  minimumTextSize: 16,
  highContrastMode: false,
} as const;
