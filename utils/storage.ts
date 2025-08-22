import { STORAGE_KEYS } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage utility class
class StorageManager {
  private prefix: string = 'movie_app_';

  /**
   * Set a value in storage
   */
  async set(key: string, value: any): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const serializedValue = JSON.stringify(value);
      await AsyncStorage.setItem(prefixedKey, serializedValue);
    } catch (error) {
      console.error('Error setting storage value:', error);
      throw new Error('Failed to save data to storage');
    }
  }

  /**
   * Get a value from storage
   */
  async get<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      
      if (value === null) {
        return defaultValue || null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error getting storage value:', error);
      return defaultValue || null;
    }
  }

  /**
   * Remove a value from storage
   */
  async remove(key: string): Promise<void> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      await AsyncStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Error removing storage value:', error);
      throw new Error('Failed to remove data from storage');
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''));
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const prefixedKey = this.getPrefixedKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      return value !== null;
    } catch (error) {
      console.error('Error checking storage key:', error);
      return false;
    }
  }

  /**
   * Get multiple values at once
   */
  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const prefixedKeys = keys.map(key => this.getPrefixedKey(key));
      const values = await AsyncStorage.multiGet(prefixedKeys);
      
      const result: Record<string, any> = {};
      values.forEach(([key, value]) => {
        if (key && value) {
          const originalKey = key.replace(this.prefix, '');
          try {
            result[originalKey] = JSON.parse(value);
          } catch {
            result[originalKey] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting multiple storage values:', error);
      return {};
    }
  }

  /**
   * Set multiple values at once
   */
  async multiSet(keyValuePairs: Record<string, any>): Promise<void> {
    try {
      const pairs: [string, string][] = Object.entries(keyValuePairs).map(([key, value]) => [
        this.getPrefixedKey(key),
        JSON.stringify(value)
      ]);
      
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('Error setting multiple storage values:', error);
      throw new Error('Failed to save multiple values to storage');
    }
  }

  private getPrefixedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Create global instance
export const storage = new StorageManager();

// Convenience functions for common storage operations
export const storageUtils = {
  // User preferences
  async setUserPreferences(preferences: any): Promise<void> {
    await storage.set(STORAGE_KEYS.userPreferences, preferences);
  },

  async getUserPreferences(): Promise<any> {
    return await storage.get(STORAGE_KEYS.userPreferences, {});
  },

  // Search history
  async addToSearchHistory(query: string): Promise<void> {
    const history = await storage.get<string[]>(STORAGE_KEYS.searchHistory, []);
    const safeHistory = history || [];
    const newHistory = [query, ...safeHistory.filter(item => item !== query)].slice(0, 10);
    await storage.set(STORAGE_KEYS.searchHistory, newHistory);
  },

  async getSearchHistory(): Promise<string[]> {
    const history = await storage.get<string[]>(STORAGE_KEYS.searchHistory, []);
    return history || [];
  },

  async clearSearchHistory(): Promise<void> {
    await storage.remove(STORAGE_KEYS.searchHistory);
  },

  // Favorite movies
  async addFavoriteMovie(movieId: number): Promise<void> {
    const favorites = await storage.get<number[]>(STORAGE_KEYS.favoriteMovies, []);
    const safeFavorites = favorites || [];
    if (!safeFavorites.includes(movieId)) {
      safeFavorites.push(movieId);
      await storage.set(STORAGE_KEYS.favoriteMovies, safeFavorites);
    }
  },

  async removeFavoriteMovie(movieId: number): Promise<void> {
    const favorites = await storage.get<number[]>(STORAGE_KEYS.favoriteMovies, []);
    const safeFavorites = favorites || [];
    const newFavorites = safeFavorites.filter(id => id !== movieId);
    await storage.set(STORAGE_KEYS.favoriteMovies, newFavorites);
  },

  async getFavoriteMovies(): Promise<number[]> {
    const favorites = await storage.get<number[]>(STORAGE_KEYS.favoriteMovies, []);
    return favorites || [];
  },

  async isFavoriteMovie(movieId: number): Promise<boolean> {
    const favorites = await storage.get<number[]>(STORAGE_KEYS.favoriteMovies, []);
    const safeFavorites = favorites || [];
    return safeFavorites.includes(movieId);
  },

  // Recently viewed movies
  async addRecentlyViewed(movieId: number): Promise<void> {
    const recent = await storage.get<number[]>(STORAGE_KEYS.recentlyViewed, []);
    const safeRecent = recent || [];
    const newRecent = [movieId, ...safeRecent.filter(id => id !== movieId)].slice(0, 20);
    await storage.set(STORAGE_KEYS.recentlyViewed, newRecent);
  },

  async getRecentlyViewed(): Promise<number[]> {
    const recent = await storage.get<number[]>(STORAGE_KEYS.recentlyViewed, []);
    return recent || [];
  },

  // App settings
  async setAppSetting(key: string, value: any): Promise<void> {
    const settings = await storage.get<Record<string, any>>(STORAGE_KEYS.appSettings, {});
    const safeSettings = settings || {};
    safeSettings[key] = value;
    await storage.set(STORAGE_KEYS.appSettings, safeSettings);
  },

  async getAppSetting(key: string, defaultValue?: any): Promise<any> {
    const settings = await storage.get<Record<string, any>>(STORAGE_KEYS.appSettings, {});
    const safeSettings = settings || {};
    return safeSettings[key] !== undefined ? safeSettings[key] : defaultValue;
  },

  // Cache management
  async clearCache(): Promise<void> {
    const keys = await storage.getAllKeys();
    const cacheKeys = keys.filter(key => 
      key.includes('cache') || 
      key.includes('temp') || 
      key.includes('search')
    );
    
    for (const key of cacheKeys) {
      await storage.remove(key);
    }
  },
};

export default storage;
