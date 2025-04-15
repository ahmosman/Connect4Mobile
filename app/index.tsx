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
import GameService, { GameState } from './services/GameService';
import Loader from './components/Loader';
import ReadyScreen from './components/screens/ReadyScreen';

// Prevent automatic hiding of splash screen
SplashScreen.preventAutoHideAsync();

// App screen types (independent of playerStatus)
type AppScreen = 'main' | 'playerSetup' | 'join' | 'manual';

export default function HomeScreen() {
  // App state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [inGame, setInGame] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);

  // Load font
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_500Medium,
  });

  // Hide splash screen after fonts load
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Initialize socket connection and handle game state updates
  useEffect(() => {
    // Initialize socket connection when app starts
    GameService.initializeSocket();

    // Set up subscription to game state updates
    const unsubscribe = GameService.subscribeToGameState((newState) => {
      setGameState(newState);
      console.log('Game state updated:', newState.playerStatus);
    });

    // Fetch initial game state if in a game
    if (inGame) {
      fetchGameState();
    }

    // Clean up when component unmounts
    return () => {
      unsubscribe();
    };
  }, [inGame]);

  // Clean up WebSocket connection when app closes
  useEffect(() => {
    return () => {
      GameService.cleanUp();
    };
  }, []);

  const fetchGameState = async () => {
    try {
      const state = await GameService.getGameState();
      setGameState(state);
      console.log('Initial game state loaded:', state.playerStatus);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setErrorMessage('Server connection error.');
    }
  };

  const isPlayerInGame = () => {
    return gameState && gameState.playerStatus !== 'NONE';
  };

  // Handle player setup completion
  const handlePlayerSetupComplete = async (nickname: string, playerColor: string, opponentColor: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      if (isFirstPlayer) {
        // Create new game
        const response = await GameService.startNewGame();
        const newGameId = response.unique_game_id;
        console.log('Created new game: ', newGameId);

        // Player setup
        await GameService.setupPlayer(nickname, playerColor, opponentColor);
      } else {
        // Join game and set up second player
        await GameService.setupPlayer(nickname, playerColor, opponentColor);
      }

      await fetchGameState(); // Get initial game state after setup

      setInGame(true);
      setCurrentScreen('main'); // Return to main view, actual screen depends on playerStatus
    } catch (error) {
      console.error('Game setup error:', error);
      setErrorMessage('Failed to set up game. Please try again.');
      setCurrentScreen('main');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirmation
  const handleConfirm = async () => {
    try {
      await GameService.confirmGame();
    } catch (error) {
      console.error('Error confirming readiness:', error);
    }
  };

  // Handle move on board
  const handleMove = async (column: number) => {
    if (!gameState?.isPlayerTurn) return;

    try {
      await GameService.makeMove(column);
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  // Handle "New Game" click in main menu
  const handleNewGamePress = () => {
    setIsFirstPlayer(true);
    setCurrentScreen('playerSetup');
  };

  // Handle "Join Game" click in main menu
  const handleJoinGamePress = () => {
    setCurrentScreen('join');
  };

  // Handle game ID entered by second player
  const handleJoinGameIdEntered = async (joinGameId: string) => {
    try {
      setIsLoading(true);
      await GameService.joinGame(joinGameId);
      setIsFirstPlayer(false);
      setCurrentScreen('playerSetup');
    } catch (error) {
      console.error('Error joining game:', error);
      setErrorMessage('Failed to join game. Please check the game ID and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Return to main menu
  const handleBackToMenu = async () => {
    try {
      if (inGame) {
        await GameService.disconnectFromGame();
      }
    } catch (error) {
      console.error('Error disconnecting from game:', error);
    } finally {
      setCurrentScreen('main');
      setErrorMessage('');
      setInGame(false);
      setGameState(null);
    }
  };

  // Render game screen based on playerStatus
  const renderGameScreen = () => {
    if (!gameState) {
      return <Loader size={40} />;
    }

    console.log('Rendering game screen:', gameState);

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

  // Wait for fonts to load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Render current screen
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