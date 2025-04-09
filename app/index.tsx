import { StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFonts, Rajdhani_500Medium } from '@expo-google-fonts/rajdhani';
import * as SplashScreen from 'expo-splash-screen';
import MainMenuScreen from './components/screens/MainMenuScreen';
import WaitingScreen from './components/screens/WaitingScreen';
import JoinGameScreen from './components/screens/JoinGameScreen';
import ManualScreen from './components/screens/ManualScreen';
import { ApiService as API } from './services/ApiService';

// Zapobiegaj automatycznemu ukryciu ekranu ładowania
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'waiting' | 'join' | 'manual'>('main');
  const [gameId, setGameId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Załadowanie czcionki Rajdhani z Google Fonts
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_500Medium,
  });

  // Ukryj ekran ładowania po załadowaniu czcionek
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleNewGame = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await API.startNewGame();

      setGameId(response.unique_game_id);
      console.log('Nowa gra utworzona:', response.unique_game_id);

      setCurrentScreen('waiting');
    } catch (error) {
      console.error('Błąd podczas tworzenia gry:', error);
      setErrorMessage('Nie udało się utworzyć gry. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = () => {
    setCurrentScreen('join');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('main');
    setErrorMessage('');
  };

  return (
    <ThemedView style={styles.main} onLayout={onLayoutRootView}>
      {currentScreen === 'main' && (
        <MainMenuScreen
          onNewGamePress={handleNewGame}
          onJoinGamePress={handleJoinGame}
          onManualPress={() => setCurrentScreen('manual')}
          isLoading={isLoading}
        />
      )}
      {currentScreen === 'waiting' && (
        <WaitingScreen gameId={gameId} onBackPress={handleBackToMenu} />
      )}
      {currentScreen === 'join' && (
        <JoinGameScreen onBackPress={handleBackToMenu} />
      )}
      {currentScreen === 'manual' && (
        <ManualScreen onBackPress={handleBackToMenu} />
      )}

      {errorMessage && (
        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'violet',
  },
  errorMessage: {
    position: 'absolute',
    color: 'darkred',
    width: 200,
    textAlign: 'center',
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    borderRadius: 5,
  },
});