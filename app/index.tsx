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

// Zapobiegaj automatycznemu ukryciu ekranu ładowania
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'waiting' | 'join' | 'manual'>('main');
  const [gameId, setGameId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleNewGame = () => {
    const randomGameId = 'GAME' + Math.floor(Math.random() * 10000);
    setGameId(randomGameId);
    console.log('Nowa gra:', randomGameId);
    setCurrentScreen('waiting');
  };

  const handleJoinGame = () => {
    setCurrentScreen('join');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('main');
  };

  return (
    <ThemedView style={styles.main}>
      {currentScreen === 'main' && (
        <MainMenuScreen
          onNewGamePress={handleNewGame}
          onJoinGamePress={() => setCurrentScreen('join')}
          onManualPress={() => setCurrentScreen('manual')}
        />
      )}
      {currentScreen === 'waiting' && (
        <WaitingScreen gameId={gameId} onBackPress={() => setCurrentScreen('main')} />
      )}
      {currentScreen === 'join' && (
        <JoinGameScreen onBackPress={() => setCurrentScreen('main')} />
      )}
      {currentScreen === 'manual' && (
        <ManualScreen onBackPress={() => setCurrentScreen('main')} />
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
    width: 150,
    textAlign: 'center',
    bottom: 20,
  },
});