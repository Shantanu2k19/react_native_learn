import ApiKeyWarning from '@/components/ApiKeyWarning';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import TrendingCard from '@/components/TrendingCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useMovieFetch } from '@/hooks/useFetch';
import { apiClient } from '@/services/api';
import { Movie, TrendingMovie } from '@/types';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  // Check API configuration first
  const isConfigured = apiClient.isConfigured();

  // Fetch trending movies
  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending
  } = useMovieFetch<TrendingMovie[]>(() => 
    // Note: This is a placeholder since the original appwrite service isn't fully implemented
    // In a real app, you'd use: apiClient.getTrendingMovies()
    Promise.resolve([])
  );

  // Fetch popular movies
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies
  } = useMovieFetch<Movie[]>(() => 
    apiClient.getPopularMovies().then(response => response.results)
  );

  // Handle movie press
  const handleMoviePress = useCallback((movie: Movie) => {
    // Analytics tracking could go here
    console.log('Movie pressed:', movie.title);
  }, []);

  // Handle trending movie press
  const handleTrendingPress = useCallback((movie: TrendingMovie) => {
    // Analytics tracking could go here
    console.log('Trending movie pressed:', movie.title);
  }, []);

  // Handle search press
  const handleSearchPress = useCallback(() => {
    router.push('/search');
  }, [router]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      refetchTrending(),
      refetchMovies()
    ]);
  }, [refetchTrending, refetchMovies]);

  // Loading state
  const isLoading = trendingLoading || moviesLoading;
  
  // Error state
  const hasError = trendingError || moviesError;

  // Error message
  const errorMessage = useMemo(() => {
    if (trendingError && moviesError) {
      return 'Failed to load both trending and popular movies';
    }
    if (trendingError) {
      return 'Failed to load trending movies';
    }
    if (moviesError) {
      return 'Failed to load popular movies';
    }
    return null;
  }, [trendingError, moviesError]);

  // Show API key warning if not configured
  if (!isConfigured) {
    return <ApiKeyWarning />;
  }

  // Render error state
  const renderError = () => (
    <View className="flex-1 justify-center items-center px-5">
      <Text className="text-red-400 text-center text-lg mb-4">
        {errorMessage}
      </Text>
      <TouchableOpacity 
        className="bg-blue-500 px-6 py-3 rounded-full"
        onPress={handleRefresh}
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Render loading state
  const renderLoading = () => (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#AB8BFF" />
      <Text className="text-white mt-4 text-lg">Loading movies...</Text>
    </View>
  );

  // Render content
  const renderContent = () => (
    <View className="flex-1 mt-5">
      <SearchBar 
        onPress={handleSearchPress}
        placeholder="Search for movies"
      />

      {/* Trending Movies Section */}
      {trendingMovies && trendingMovies.length > 0 && (
        <View className="mt-10">
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Trending Movies
          </Text>
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="w-4" />}
            className="mb-4 mt-3"
            data={trendingMovies}
            renderItem={({ item, index }) => (
              <TrendingCard 
                movie={item} 
                index={index}
                onPress={handleTrendingPress}
              />
            )}
            keyExtractor={(item) => `trending-${item.movie_id}`}
          />
        </View>
      )}

      {/* Latest Movies Section */}
      {movies && movies.length > 0 && (
        <View className="mt-8">
          <Text className="text-lg text-white font-bold mt-5 mb-3">
            Latest Movies
          </Text>
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieCard 
                movie={item}
                onPress={handleMoviePress}
              />
            )}
            keyExtractor={(item) => `latest-${item.id}`} 
            numColumns={3}
            columnWrapperStyle={{ 
              justifyContent: "flex-start",
              gap: 20, 
              paddingRight: 5,
              marginBottom: 10
            }}
            className="mt-2 pb-32"
            scrollEnabled={false}
          />
        </View>
      )}

      {/* Empty state */}
      {!isLoading && !hasError && (!movies || movies.length === 0) && (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-light-300 text-center text-lg">
            No movies found. Try refreshing the page.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-primary">
      <Image 
        source={images.bg} 
        className="absolute w-full z-0"
        accessibilityLabel="Background image"
      />
      
      <ScrollView 
        className="flex-1 px-5" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#AB8BFF"
            colors={["#AB8BFF"]}
          />
        }
      >
        <Image 
          source={icons.logo} 
          className="w-12 h-10 mt-20 mb-5 mx-auto"
          accessibilityLabel="App logo"
        />

        {isLoading && !movies && !trendingMovies ? (
          renderLoading()
        ) : hasError ? (
          renderError()
        ) : (
          renderContent()
        )}
      </ScrollView>
    </View>
  );
}
