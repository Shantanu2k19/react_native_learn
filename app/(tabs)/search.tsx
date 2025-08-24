import ApiKeyWarning from '@/components/ApiKeyWarning';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useFetch } from '@/hooks/useFetch';
import { apiClient, fetchPopularMovies } from '@/services/api';
import { Movie } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, View } from 'react-native';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Check API configuration first
  const isConfigured = apiClient.isConfigured();

  const fetcher = useCallback(() => {
    console.log("Calling fetchPopularMovies");
    return fetchPopularMovies({ query: searchQuery });
  }, [searchQuery]);

  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
  } = useFetch(fetcher);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // Debounce search effect 
  useEffect(() => {    
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        // Reset data when search query is empty
        setSearchQuery('');
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, loadMovies]);

  const updateSearchCount = useCallback(async (query: string, movie: Movie) => {
    // This function would typically update search analytics
    console.log(`Search count updated for query: ${query}, movie: ${movie.title}`);
  }, []);

  useEffect(() => {
    if (movies && movies.length > 0 && movies[0]) {
      updateSearchCount(searchQuery, movies[0]);
    }
  }, [movies, searchQuery, updateSearchCount]);

  // Show API key warning if not configured
  if (!isConfigured) {
    return <ApiKeyWarning />;
  }

  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'/>

      <FlatList 
        className="px-5"
        data={movies as Movie[]} 
        renderItem={({item}) => <MovieCard movie={item} />}
        keyExtractor={(item) => item.id.toString()} 
        numColumns={3}
        columnWrapperStyle = {{
          justifyContent: 'flex-start', 
          gap: 16, 
          marginVertical: 16
        }} 
        contentContainerStyle={{paddingBottom:100}}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {!loading &&
              !error &&
              searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                  Search Results for{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )
            }

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;