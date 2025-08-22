import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ApiKeyWarningProps {
  onRetry?: () => void;
}

const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({ onRetry }) => {
  const handleGetApiKey = () => {
    Linking.openURL('https://www.themoviedb.org/settings/api');
  };

  const handleRetry = () => {
    onRetry?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔑 API Key Required</Text>
        <Text style={styles.message}>
          To use this app, you need to configure your TMDB API key. This app cannot function without it.
        </Text>
        
        <View style={styles.steps}>
          <Text style={styles.stepTitle}>Follow these steps:</Text>
          <Text style={styles.step}>1. Visit TMDB website and create an account</Text>
          <Text style={styles.step}>2. Go to Settings → API</Text>
          <Text style={styles.step}>3. Request an API key</Text>
          <Text style={styles.step}>4. Add it to your .env file</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGetApiKey}>
            <Text style={styles.primaryButtonText}>Get API Key</Text>
          </TouchableOpacity>
          
          {onRetry && (
            <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
              <Text style={styles.secondaryButtonText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.note}>
          After adding the API key, restart your development server.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0D23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 350,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#A8B5DB',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  steps: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 12,
  },
  step: {
    fontSize: 14,
    color: '#A8B5DB',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#A8B5DB',
  },
  secondaryButtonText: {
    color: '#A8B5DB',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#A8B5DB',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ApiKeyWarning;
