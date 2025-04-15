import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
import ConfirmScreen from './components/screens/ConfirmScreen';
import ApiService, { GameState } from './services/ApiService';
import Loader from './components/Loader';
import ReadyScreen from './components/screens/ReadyScreen';

// Zapobiegaj automatycznemu ukryciu ekranu ładowania
SplashScreen.preventAutoHideAsync();

// Typy ekranów aplikacji (niezależne od playerStatus)
type AppScreen = 'main' | 'playerSetup' | 'join' | 'manual';

export default function HomeScreen() {
  // Stan aplikacji
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [inGame, setInGame] = useState(false);
  const [playerNickname, setPlayerNickname] = useState('');
  const [playerColor, setPlayerColor] = useState('');
  const [opponentColor, setOpponentColor] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);

  // Załadowanie czcionki
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_500Medium,
  });

  // Ukryj ekran ładowania po załadowaniu czcionek
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Pobieranie stanu gry
  const fetchGameState = async () => {
    try {
      const state = await ApiService.getGameState();
      setGameState(state);
      console.log('Pobrano stan gry:', state.playerStatus);
    } catch (error) {
      console.error('Błąd podczas pobierania stanu gry:', error);
      setErrorMessage('Błąd połączenia z serwerem.');
    }
  };

  const isPlayerInGame = () => {
    return gameState && gameState.playerStatus !== 'NONE';
  };

  // Sprawdzanie statusu gry
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (inGame) {
      fetchGameState();
      intervalId = setInterval(fetchGameState, 2000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [inGame]); 

  // Obsługa tworzenia nowej gry
  const handlePlayerSetupComplete = async (nickname: string, playerColor: string, opponentColor: string) => {
    setPlayerNickname(nickname);
    setPlayerColor(playerColor);
    setOpponentColor(opponentColor);

    try {
      setIsLoading(true);
      setErrorMessage('');

      if (isFirstPlayer) {
        // Utworzenie nowej gry
        const response = await ApiService.startNewGame();
        const newGameId = response.unique_game_id;
        console.log('Utworzono nową grę: ', newGameId);

        // Konfiguracja gracza
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
      } else {
        // Dołączanie do gry i konfiguracja drugiego gracza
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
      }

      await fetchGameState(); // Pobierz stan gry po konfiguracji

      setInGame(true);
      // Stan gry będzie aktualizowany przez useEffect
      setCurrentScreen('main'); // Wrócić do głównego widoku, faktyczny ekran zależy od playerStatus
    } catch (error) {
      console.error('Błąd konfiguracji gry:', error);
      setErrorMessage('Nie udało się skonfigurować gry. Spróbuj ponownie.');
      setCurrentScreen('main');
    } finally {
      setIsLoading(false);
    }
  };

  // Obsługa potwierdzenia gotowości
  const handleConfirm = async () => {
    try {
      await ApiService.confirmGame();
      await fetchGameState();
    } catch (error) {
      console.error('Błąd podczas potwierdzania gotowości:', error);
    }
  };

  // Obsługa ruchu na planszy
  const handleMove = async (column: number) => {
    if (!gameState?.isPlayerTurn) return;

    try {
      await ApiService.makeMove(column);
      await fetchGameState();
    } catch (error) {
      console.error('Błąd podczas wykonywania ruchu:', error);
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
    // setGameId(joinGameId);
    setIsFirstPlayer(false);
    setCurrentScreen('playerSetup');
  };

  // Powrót do menu głównego
  const handleBackToMenu = () => {
    setCurrentScreen('main');
    setErrorMessage('');
    setInGame(false);
    setPlayerNickname('');
    setPlayerColor('');
    setOpponentColor('');
    setGameState(null);
  };

  // In your index.tsx file, update the renderGameScreen function:

  // Wybór ekranu na podstawie playerStatus
  const renderGameScreen = () => {
    if (!gameState) {
      return <Loader size={40} />;
    }

    console.log('Renderowanie ekranu gry:', gameState);

    switch (gameState.playerStatus) {
      case 'WAITING':
        return <WaitingScreen gameId={gameState.gameId} />;
      case 'CONFIRMING':
        return (
          <ConfirmScreen
            opponentNickname={gameState.opponentNickname || 'Nemesis'}
            onConfirm={handleConfirm}
          />
        );
      case 'READY':
        return (
          <ReadyScreen
            opponentNickname={gameState.opponentNickname || 'Nemesis'}
          />
        );
      case 'PLAYER_MOVE':
      case 'OPPONENT_MOVE':
      case 'WIN':
      case 'LOSE':
      case 'DRAW':
      case 'REVENGE':
        return (
          <GameScreen
            gameState={gameState}
            onMove={handleMove}
            onBackPress={handleBackToMenu}
          />
        );
      default:
        return null;
    }
  };

  // Czekaj na załadowanie czcionek
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Renderowanie aktualnego ekranu
  const renderCurrentScreen = () => {

    if (isPlayerInGame() || isLoading) {
      return renderGameScreen();
    }

    switch (currentScreen) {
      case 'playerSetup':
        return (
          <PlayerSetupScreen
            onSetupComplete={handlePlayerSetupComplete}
            onBackPress={handleBackToMenu}
          />
        );
      case 'join':
        return (
          <JoinGameScreen
            onBackPress={handleBackToMenu}
            onGameJoined={handleJoinGameIdEntered}
          />
        );
      case 'manual':
        return <ManualScreen onBackPress={handleBackToMenu} />;
      case 'main':
      default:
        return (
          <MainMenuScreen
            onNewGamePress={handleNewGamePress}
            onJoinGamePress={handleJoinGamePress}
            onManualPress={() => setCurrentScreen('manual')}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <ThemedView style={styles.main} onLayout={onLayoutRootView}>
      {renderCurrentScreen()}
      {isLoading && <View style={styles.loadingOverlay}><Loader size={40} /></View>}
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
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
});