import React, { memo, useCallback } from 'react';
import { images } from "@/constants/images";
import MaskedView from '@react-native-masked-view/masked-view';
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { TrendingCardProps } from '@/types';
import { buildImageUrl } from '@/utils';

const TrendingCard: React.FC<TrendingCardProps> = memo(({ movie, index, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.(movie);
  }, [movie, onPress]);

  const posterUrl = buildImageUrl(movie.poster_url, 'w500');
  const rankingNumber = index + 1;

  return (
    <Link href={`/(movie)/${movie.movie_id}`} asChild>
      <TouchableOpacity 
        className='w-32 relative pl-5'
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${movie.title} trending movie, rank ${rankingNumber}`}
      >
        <View className="relative">
          <Image 
            source={{ uri: posterUrl }}
            className="w-32 h-48 rounded-lg"
            resizeMode='cover'
            style={styles.poster}
            accessibilityLabel={`Poster for ${movie.title}`}
          />

          {/* Ranking badge */}
          <View className="absolute bottom-9 -left-3.5 px-2 py-1 rounded-full">
            <MaskedView 
              maskElement={
                <Text className="font-bold text-white text-6xl">
                  {rankingNumber}
                </Text>
              }
            >
              <Image 
                source={images.rankingGradient}
                className='size-14'
                resizeMode='cover'
              />
            </MaskedView> 
          </View>

          {/* Trending indicator */}
          <View className="absolute top-2 left-2 bg-red-500 rounded-full px-2 py-1">
            <Text className="text-xs font-bold text-white">TRENDING</Text>
          </View>
        </View>

        <Text 
          className="text-sm font-bold mt-2 text-light-200" 
          numberOfLines={2}
          style={styles.title}
        >
          {movie.title}
        </Text>

        {/* Search count indicator */}
        <View className="flex-row items-center mt-1">
          <Text className="text-xs text-light-300">
            {movie.count} searches
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
});

TrendingCard.displayName = 'TrendingCard';

const styles = StyleSheet.create({
  poster: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    lineHeight: 18,
  },
});

export default TrendingCard;