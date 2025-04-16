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
import { io, Socket } from 'socket.io-client';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Application screen types (independent of playerStatus)
type AppScreen = 'main' | 'playerSetup' | 'join' | 'manual';

export default function HomeScreen() {
  // Application state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [gameId, setGameId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_500Medium,
  });

  // Hide the splash screen after fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Fetch the game state from the backend
  const fetchGameState = async () => {
    try {
      const state = await ApiService.getGameState();
      setGameState(state);
      console.log('Game state fetched:', state);
    } catch (error) {
      console.error('Error fetching game state:', error);
      setErrorMessage('Connection to the server failed.');
    }
  };

  const isPlayerInGame = () => {
    return gameState && gameState.playerStatus !== 'NONE';
  };

  const [socket, setSocket] = useState<Socket | null>(null);

  // Establish WebSocket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000'); // WebSocket server address
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket:', newSocket.id);
    });

    // Listen for game updates
    newSocket.on('gameUpdate', (update) => {
      console.log('Game update received:', update);
      fetchGameState(); // Fetch the latest game state
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Handle player setup completion
  const handlePlayerSetupComplete = async (nickname: string, playerColor: string, opponentColor: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      if (isFirstPlayer) {
        // Create a new game
        const response = await ApiService.startNewGame();
        const newGameId = response.unique_game_id;
        console.log('New game created:', newGameId);
        setGameId(newGameId);
        socket?.emit('joinGame', newGameId); // Join the game via WebSocket

        // Configure the player
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
      } else {
        // Join an existing game and configure the second player
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
        socket?.emit('joinGame', gameId); // Join the game via WebSocket
      }

      // The game state will be updated via useEffect
      setCurrentScreen('main'); // Return to the main view
    } catch (error) {
      console.error('Error during game setup:', error);
      setErrorMessage('Failed to set up the game. Please try again.');
      setCurrentScreen('main');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle game confirmation
  const handleConfirm = async () => {
    try {
      await ApiService.confirmGame(); // Send a request to the backend

      // Emit an event only after the response is fully processed
      if (gameState?.gameId) {
        socket?.emit('confirmGame', gameState.gameId);
      }
    } catch (error) {
      console.error('Error during game confirmation:', error);
    }
  };

  // Handle revenge request
  const handleRevengeRequest = async () => {
    try {
      await ApiService.requestRevenge(); // Send a request to the backend

      // Emit an event only after the response is fully processed
      if (gameState?.gameId) {
        socket?.emit('revengeRequest', gameState.gameId);
      }
    } catch (error) {
      console.error('Error during revenge request:', error);
    }
  };

  // Handle player move
  const handleMove = async (column: number) => {
    if (!gameState?.isPlayerTurn || !socket) return;

    try {
      await ApiService.makeMove(column); // Make a move on the backend
      console.log('Move made:', column);

      // Emit an event only after the response is fully processed
      if (gameState?.gameId) {
        socket.emit('playerMove', { gameId: gameState.gameId, column });
      }
    } catch (error) {
      console.error('Error during move:', error);
    }
  };

  // Handle "New Game" button click in the main menu
  const handleNewGamePress = () => {
    setIsFirstPlayer(true);
    setCurrentScreen('playerSetup');
  };

  // Handle "Join Game" button click in the main menu
  const handleJoinGamePress = () => {
    setCurrentScreen('join');
  };

  // Handle game ID entered by the second player
  const handleJoinGameIdEntered = (uniqueGameId: string) => {
    setGameId(uniqueGameId);
    console.log('Game ID entered by the second player:', uniqueGameId);
    setIsFirstPlayer(false);
    setCurrentScreen('playerSetup');
  };

  // Return to the main menu
  const handleBackToMenu = async () => {
    if (gameState) {
      await ApiService.disconnectFromGame();
      socket?.emit('leaveGame', gameState.gameId); // Notify the server about leaving the game
      socket?.disconnect(); // Close the WebSocket connection
    }

    setCurrentScreen('main');
    setErrorMessage('');
    setGameState(null);
    setGameId(null);
  };

  // Select the screen based on playerStatus
  const renderGameScreen = () => {
    if (!gameState) {
      return <Loader size={40} />;
    }

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
            onRevengeRequest={handleRevengeRequest}
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

  // Render the current screen
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