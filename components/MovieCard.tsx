import React, { memo, useCallback } from 'react';
import { Link } from 'expo-router';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { MovieCardProps } from '@/types';
import { icons } from '@/constants/icons';
import { buildImageUrl, formatDate, formatRating, getRatingColor } from '@/utils';

const MovieCard: React.FC<MovieCardProps> = memo(({ movie, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.(movie);
  }, [movie, onPress]);

  const posterUrl = buildImageUrl(movie.poster_path, 'w500');
  const releaseYear = formatDate(movie.release_date, 'year');
  const rating = formatRating(movie.vote_average);
  const ratingColor = getRatingColor(movie.vote_average);

  return (
    <Link href={`/(movie)/${movie.id}`} asChild>
      <TouchableOpacity 
        className="w-[30%]" 
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${movie.title} movie poster`}
      >
        <View className="relative">
          <Image
            source={{ uri: posterUrl }}
            className="w-full h-52 rounded-lg"
            resizeMode="cover"
            style={styles.poster}
            accessibilityLabel={`Poster for ${movie.title}`}
          />
          
          {/* Rating badge */}
          <View 
            className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 flex-row items-center"
            style={{ backgroundColor: `${ratingColor}20` }}
          >
            <Image source={icons.star} className="size-3" />
            <Text 
              className="text-xs font-bold ml-1"
              style={{ color: ratingColor }}
            >
              {rating}
            </Text>
          </View>
        </View>

        <View className="mt-2">
          <Text 
            className="text-sm font-bold text-white" 
            numberOfLines={2}
            style={styles.title}
          >
            {movie.title}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-light-300 font-medium">
              {releaseYear}
            </Text>
            <Text className="text-xs font-medium text-light-300 uppercase">
              Movie
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
});

MovieCard.displayName = 'MovieCard';

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

export default MovieCard;