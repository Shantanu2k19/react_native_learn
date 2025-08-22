# Movie App - React Native

A production-ready, scalable React Native movie application built with Expo and TypeScript, following senior development best practices.

## Features

- **Modern Architecture**: Built with React Native, Expo, and TypeScript
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Error Handling**: Robust error boundaries and error handling patterns
- **Performance**: Optimized components with React.memo and useCallback
- **Accessibility**: Full accessibility support with proper labels and roles
- **Responsive Design**: Beautiful UI with Tailwind CSS (NativeWind)
- **API Integration**: TMDB API integration with proper error handling
- **Custom Hooks**: Reusable hooks for data fetching and state management

## Tech Stack

- **Framework**: React Native 0.79.5
- **Expo**: ~53.0.20
- **Language**: TypeScript 5.8.3
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **State Management**: React Hooks
- **API**: TMDB Movie Database API
- **Development**: ESLint, Prettier

## Screenshots

[Add your app screenshots here]

## Project Structure

```
react_native_learn/
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with error boundary
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   ├── save.tsx       # Saved movies
│   │   └── profile.tsx    # User profile
│   └── (movie)/           # Movie detail screens
│       └── [id].tsx       # Dynamic movie detail
├── components/             # Reusable components
│   ├── MovieCard.tsx      # Movie card component
│   ├── TrendingCard.tsx   # Trending movie card
│   ├── SearchBar.tsx      # Search input component
│   └── ErrorBoundary.tsx  # Error boundary component
├── constants/              # App constants
│   ├── icons.ts           # Icon assets
│   ├── images.ts          # Image assets
│   └── config.ts          # App configuration
├── hooks/                  # Custom React hooks
│   └── useFetch.ts        # Data fetching hooks
├── services/               # API services
│   ├── api.ts             # TMDB API client
│   └── appwrite.ts        # Appwrite service
├── types/                  # TypeScript type definitions
│   └── index.ts           # Main types file
├── utils/                  # Utility functions
│   └── index.ts           # Helper functions
├── assets/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── icons/             # Icon images
│   └── images/            # App images
└── [config files]          # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd react_native_learn
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your TMDB API key:
   ```env
   EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key_here
   ```

4. **Get TMDB API Key**
   - Visit [TMDB](https://www.themoviedb.org/settings/api)
   - Create an account and request an API key
   - Add the key to your `.env` file

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project (if available)

### Code Quality

This project follows strict coding standards:

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Code linting with Expo configuration
- **Component Structure**: Functional components with proper prop types
- **Error Handling**: Comprehensive error boundaries and error states
- **Performance**: Memoized components and optimized re-renders
- **Accessibility**: Full accessibility support

### Adding New Features

1. **Create new components** in the `components/` directory
2. **Add types** to `types/index.ts`
3. **Create custom hooks** in `hooks/` directory
4. **Add API endpoints** to `services/api.ts`
5. **Update constants** in `constants/config.ts`

### Component Guidelines

- Use TypeScript interfaces for props
- Implement proper error handling
- Add accessibility labels and roles
- Use React.memo for performance optimization
- Follow the established naming conventions

## Testing

[Add testing setup and instructions here]

## Building for Production

### Android

```bash
# Build APK
expo build:android -t apk

# Build AAB (Google Play Store)
expo build:android -t app-bundle
```

### iOS

```bash
# Build for iOS
expo build:ios
```

## Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS**
   ```bash
   eas build:configure
   ```

4. **Build and submit**
   ```bash
   eas build --platform all
   eas submit --platform all
   ```

## Security

- API keys are stored in environment variables
- No sensitive data in source code
- Proper error handling without exposing internal details
- Input validation on all user inputs

## Performance

- Lazy loading of images
- Memoized components to prevent unnecessary re-renders
- Efficient list rendering with FlatList
- Optimized image sizes based on device capabilities
- Debounced search functionality

## API Integration

### TMDB API

The app integrates with The Movie Database (TMDB) API:

- **Base URL**: `https://api.themoviedb.org/3`
- **Authentication**: API key in Authorization header
- **Rate Limiting**: Respects API rate limits
- **Error Handling**: Comprehensive error handling for all API responses

### Available Endpoints

- `GET /discover/movie` - Get popular movies
- `GET /search/movie` - Search movies
- `GET /movie/{id}` - Get movie details
- `GET /trending/movie/{time_window}` - Get trending movies

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Add proper error handling
- Include accessibility features
- Write meaningful commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [TMDB](https://www.themoviedb.org/) for the movie database API
- [React Native](https://reactnative.dev/) community
- [NativeWind](https://www.nativewind.dev/) for Tailwind CSS support

## Support

If you have any questions or need help:

- Create an issue in the repository
- Check the [Expo documentation](https://docs.expo.dev/)
- Review the [React Native documentation](https://reactnative.dev/docs/getting-started)

## Changelog

### Version 1.0.0
- Initial production-ready release
- Complete TypeScript implementation
- Error boundary implementation
- Custom hooks for data fetching
- Comprehensive error handling
- Accessibility improvements
- Performance optimizations

---

**Happy coding!**
