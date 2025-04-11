import { StyleSheet } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFonts, Rajdhani_500Medium } from '@expo-google-fonts/rajdhani';
import * as SplashScreen from 'expo-splash-screen';
import MainMenuScreen from './components/screens/MainMenuScreen';
import WaitingScreen from './components/screens/WaitingScreen';
import JoinGameScreen from './components/screens/JoinGameScreen';
import PlayerSetupScreen from './components/screens/PlayerSetupScreen';
import GameScreen from './components/screens/GameScreen';
import ManualScreen from './components/screens/ManualScreen';
import ApiService from './services/ApiService';

// Zapobiegaj automatycznemu ukryciu ekranu ładowania
SplashScreen.preventAutoHideAsync();

// Możliwe statusy gry
type GameStatus = 'NOT_STARTED' | 'WAITING_FOR_PLAYER' | 'PLAYER_MOVE' | 'OPPONENT_MOVE' | 'WIN' | 'LOSE' | 'DRAW';

// Typ ekranu aplikacji
type AppScreen = 'main' | 'playerSetup' | 'waiting' | 'join' | 'game' | 'manual';

export default function HomeScreen() {
  // Stan aplikacji
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [gameId, setGameId] = useState('');
  const [playerNickname, setPlayerNickname] = useState('');
  const [playerColor, setPlayerColor] = useState('');
  const [opponentColor, setOpponentColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstPlayer, setIsFirstPlayer] = useState(true); // Czy to pierwszy gracz

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

  // Periodyczne sprawdzanie statusu podczas oczekiwania
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (currentScreen === 'waiting' && gameId) {
      intervalId = setInterval(async () => {
        try {
          const gameState = await ApiService.getGameState(gameId);
          // Jeśli status wskazuje, że drugi gracz dołączył
          if (gameState.playerStatus !== 'WAITING') {
            setCurrentScreen('game');
          }
        } catch (error) {
          console.error('Błąd podczas sprawdzania statusu gry:', error);
        }
      }, 3000); // Sprawdzaj co 3 sekundy
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentScreen, gameId]);

  // Obsługa tworzenia nowej gry przez pierwszego gracza (po setupie)
  const handlePlayerSetupComplete = async (nickname: string, playerColor: string, opponentColor: string) => {
    // Zapisz dane gracza
    setPlayerNickname(nickname);
    setPlayerColor(playerColor);
    setOpponentColor(opponentColor);

    if (isFirstPlayer) {
      // Tworzenie nowej gry
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Utwórz nową grę
        const response = await ApiService.startNewGame();
        const newGameId = response.unique_game_id;
        setGameId(newGameId);
        console.log('Nowa gra utworzona:', newGameId);

        // Skonfiguruj dane gracza
        await ApiService.setupPlayer(newGameId, nickname, playerColor, opponentColor);
        console.log('Konfiguracja gracza zapisana');

        // Przejście do ekranu oczekiwania na drugiego gracza
        setCurrentScreen('waiting');
      } catch (error) {
        console.error('Błąd podczas tworzenia gry:', error);
        setErrorMessage('Nie udało się utworzyć gry. Spróbuj ponownie.');
        setCurrentScreen('main');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Konfigurowanie drugiego gracza
      try {
        setIsLoading(true);
        setErrorMessage('');

        // Skonfiguruj dane gracza i dołącz do gry
        await ApiService.setupPlayer(gameId, nickname, playerColor, opponentColor);
        await ApiService.joinGame(gameId);
        console.log('Dołączono do gry i skonfigurowano gracza');

        // Przejście do ekranu gry
        setCurrentScreen('game');
      } catch (error) {
        console.error('Błąd podczas dołączania do gry:', error);
        setErrorMessage('Nie udało się dołączyć do gry. Spróbuj ponownie.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Obsługa kliknięcia "Nowa Gra" w menu głównym
  const handleNewGamePress = () => {
    setIsFirstPlayer(true);
    setCurrentScreen('playerSetup');
  };

  // Obsługa kliknięcia "Dołącz do gry" w menu głównym
  const handleJoinGamePress = () => {
    setCurrentScreen('join');
  };

  // Obsługa ID gry wprowadzonego przez drugiego gracza
  const handleJoinGameIdEntered = (joinGameId: string) => {
    setGameId(joinGameId);
    setIsFirstPlayer(false);
    setCurrentScreen('playerSetup');
  };

  // Rozpoczęcie gry (gdy drugi gracz dołączy)
  const handleGameStart = () => {
    setCurrentScreen('game');
  };

  // Powrót do menu głównego
  const handleBackToMenu = () => {
    setCurrentScreen('main');
    setErrorMessage('');
    setGameId('');
    setPlayerNickname('');
    setPlayerColor('');
    setOpponentColor('');
  };

  // Czekaj na załadowanie czcionek przed renderowaniem
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemedView style={styles.main} onLayout={onLayoutRootView}>
      {currentScreen === 'main' && (
        <MainMenuScreen
          onNewGamePress={handleNewGamePress}
          onJoinGamePress={handleJoinGamePress}
          onManualPress={() => setCurrentScreen('manual')}
          isLoading={isLoading}
        />
      )}

      {currentScreen === 'playerSetup' && (
        <PlayerSetupScreen
          gameId={gameId}
          isFirstPlayer={isFirstPlayer}
          onSetupComplete={handlePlayerSetupComplete}
          onBackPress={handleBackToMenu}
        />
      )}

      {currentScreen === 'waiting' && (
        <WaitingScreen
          gameId={gameId}
          onBackPress={handleBackToMenu}
          // Tylko do testów - w produkcji powinno być usunięte
          // onStartGame={handleGameStart}
        />
      )}

      {currentScreen === 'join' && (
        <JoinGameScreen
          onBackPress={handleBackToMenu}
          onGameJoined={handleJoinGameIdEntered}
        />
      )}

      {currentScreen === 'game' && (
        <GameScreen
          gameId={gameId}
          onBackPress={handleBackToMenu}
        />
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