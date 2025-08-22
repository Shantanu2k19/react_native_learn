import { ApiConfig, Movie, MovieDetails, PaginatedResponse } from '@/types';
import { createError, isValidMovieId } from '@/utils';

// API Configuration
export const TMDB_CONFIG: ApiConfig = {
  baseUrl: "https://api.themoviedb.org/3",
  apiKey: process.env.EXPO_PUBLIC_MOVIE_API_KEY || '',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

// Validate API configuration
if (!TMDB_CONFIG.apiKey) {
  console.error('❌ TMDB API key is not configured! Please set EXPO_PUBLIC_MOVIE_API_KEY in your .env file');
  console.error('🔑 Get your API key from: https://www.themoviedb.org/settings/api');
}

// API Response types
interface SearchResponse extends PaginatedResponse<Movie> {}
interface DiscoverResponse extends PaginatedResponse<Movie> {}

// Error types for API responses
interface TMDBErrorResponse {
  status_code: number;
  status_message: string;
  success: boolean;
}

// Base API client
class ApiClient {
  private config: ApiConfig;
  private retryCount: Map<string, number> = new Map();
  private readonly MAX_RETRIES = 2;
  private readonly RETRY_DELAY = 2000; // 2 seconds

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Check if API key is configured
    if (!this.config.apiKey) {
      throw createError(
        'TMDB API key is not configured. Please add EXPO_PUBLIC_MOVIE_API_KEY to your .env file.',
        'CONFIGURATION_ERROR',
        { endpoint }
      );
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const requestKey = `${endpoint}_${Date.now()}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData: TMDBErrorResponse | string;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = errorText;
        }

        // Handle specific TMDB errors
        if (typeof errorData === 'object' && 'status_code' in errorData) {
          const tmdbError = errorData as TMDBErrorResponse;
          
          if (tmdbError.status_code === 7) {
            throw createError(
              'Invalid API key. Please check your TMDB API key configuration.',
              'INVALID_API_KEY',
              { statusCode: tmdbError.status_code, message: tmdbError.status_message }
            );
          }
          
          if (tmdbError.status_code === 429) {
            throw createError(
              'API rate limit exceeded. Please try again later.',
              'RATE_LIMIT_EXCEEDED',
              { statusCode: tmdbError.status_code, message: tmdbError.status_message }
            );
          }
        }

        throw createError(
          `API request failed: ${response.status} ${response.statusText}`,
          `HTTP_${response.status}`,
          { status: response.status, statusText: response.statusText, response: errorData }
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // Don't retry for configuration errors
      if (error instanceof Error && error.message.includes('API key')) {
        throw error;
      }

      // Check retry count
      const currentRetries = this.retryCount.get(requestKey) || 0;
      if (currentRetries < this.MAX_RETRIES) {
        this.retryCount.set(requestKey, currentRetries + 1);
        
        console.warn(`⚠️ API request failed, retrying... (${currentRetries + 1}/${this.MAX_RETRIES})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * (currentRetries + 1)));
        
        // Recursive retry
        return this.request(endpoint, options);
      }

      // Max retries reached
      this.retryCount.delete(requestKey);
      
      if (error instanceof Error) {
        throw error;
      }
      throw createError('Network request failed after maximum retries', 'MAX_RETRIES_EXCEEDED', error);
    }
  }

  // Search movies
  async searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
    if (!query.trim()) {
      throw createError('Search query cannot be empty', 'VALIDATION_ERROR');
    }

    const endpoint = `/search/movie?query=${encodeURIComponent(query.trim())}&page=${page}&api_key=${this.config.apiKey}`;
    return this.request<SearchResponse>(endpoint);
  }

  // Get popular movies
  async getPopularMovies(page: number = 1): Promise<DiscoverResponse> {
    const endpoint = `/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${this.config.apiKey}`;
    return this.request<DiscoverResponse>(endpoint);
  }

  // Get movie details
  async getMovieDetails(movieId: string | number): Promise<MovieDetails> {
    if (!isValidMovieId(movieId)) {
      throw createError('Invalid movie ID provided', 'VALIDATION_ERROR');
    }

    const endpoint = `/movie/${movieId}?api_key=${this.config.apiKey}`;
    return this.request<MovieDetails>(endpoint);
  }

  // Get trending movies (this would typically come from a different endpoint)
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<DiscoverResponse> {
    const endpoint = `/trending/movie/${timeWindow}?api_key=${this.config.apiKey}`;
    return this.request<DiscoverResponse>(endpoint);
  }

  // Get movies by genre
  async getMoviesByGenre(genreId: number, page: number = 1): Promise<DiscoverResponse> {
    if (genreId <= 0) {
      throw createError('Invalid genre ID provided', 'VALIDATION_ERROR');
    }

    const endpoint = `/discover/movie?with_genres=${genreId}&page=${page}&api_key=${this.config.apiKey}`;
    return this.request<DiscoverResponse>(endpoint);
  }

  // Get upcoming movies
  async getUpcomingMovies(page: number = 1): Promise<DiscoverResponse> {
    const endpoint = `/movie/upcoming?page=${page}&api_key=${this.config.apiKey}`;
    return this.request<DiscoverResponse>(endpoint);
  }

  // Get top rated movies
  async getTopRatedMovies(page: number = 1): Promise<DiscoverResponse> {
    const endpoint = `/movie/top_rated?page=${page}&api_key=${this.config.apiKey}`;
    return this.request<DiscoverResponse>(endpoint);
  }

  // Check if API is properly configured
  isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey.trim());
  }

  // Get configuration status
  getConfigStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this.isConfigured(),
      hasApiKey: Boolean(this.config.apiKey && this.config.apiKey.trim())
    };
  }
}

// Create API client instance
export const apiClient = new ApiClient(TMDB_CONFIG);

// Legacy functions for backward compatibility (deprecated)
/**
 * @deprecated Use apiClient.searchMovies() instead
 */
export const fetchPopularMovies = async ({ query }: { query: string }): Promise<Movie[]> => {
  try {
    if (query.trim()) {
      const response = await apiClient.searchMovies(query);
      return response.results;
    } else {
      const response = await apiClient.getPopularMovies();
      return response.results;
    }
  } catch (error) {
    console.error('Error in fetchPopularMovies:', error);
    throw error;
  }
};

/**
 * @deprecated Use apiClient.getMovieDetails() instead
 */
export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    return await apiClient.getMovieDetails(movieId);
  } catch (error) {
    console.error('Error in fetchMovieDetails:', error);
    throw error;
  }
};

// Export the client for direct use
export default apiClient;