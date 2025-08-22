import { icons } from '@/constants/icons';
import { SearchBarProps } from '@/types';
import { forwardRef, memo } from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const SearchBar = memo(forwardRef<TextInput, SearchBarProps>(({ 
  placeholder, 
  value, 
  onChangeText, 
  onPress 
}, ref) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (ref && 'current' in ref && ref.current) {
      ref.current.focus();
    }
  };

  const isButtonMode = Boolean(onPress);

  return (
    <TouchableOpacity 
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-4"
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Search bar"
    >
      <Image
        source={icons.search}
        className="w-5 h-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
        accessibilityLabel="Search icon"
      />
      
      <TextInput
        ref={ref}
        onPressIn={isButtonMode ? undefined : handlePress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 ml-2 text-white"
        placeholderTextColor="#A8B5DB"
        style={styles.textInput}
        editable={!isButtonMode}
        pointerEvents={isButtonMode ? 'none' : 'auto'}
        accessibilityRole={isButtonMode ? 'none' : 'text'}
        accessibilityLabel={isButtonMode ? undefined : 'Search input field'}
      />
      
      {isButtonMode && (
        <View className="ml-2">
          <Image
            source={icons.arrow}
            className="w-4 h-4"
            resizeMode="contain"
            tintColor="#A8B5DB"
            accessibilityLabel="Navigate to search"
          />
        </View>
      )}
    </TouchableOpacity>
  );
}));

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  textInput: {
    fontSize: 16,
    lineHeight: 20,
  },
});

export default SearchBar;