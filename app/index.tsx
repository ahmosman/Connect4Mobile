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
import { io, Socket } from 'socket.io-client';
import ReadyScreen from './components/screens/ReadyScreen';
import { SOCKET_URL } from '@env';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

type AppScreen = 'main' | 'playerSetup' | 'join' | 'manual';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('main');
  const [gameId, setGameId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstPlayer, setIsFirstPlayer] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  const [fontsLoaded, fontError] = useFonts({ Rajdhani_500Medium });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) await SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

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


  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => console.log('Connected to WebSocket:', newSocket.id));
    newSocket.on('gameUpdate', fetchGameState);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handlePlayerSetupComplete = async (nickname: string, playerColor: string, opponentColor: string) => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      if (isFirstPlayer) {
        const response = await ApiService.startNewGame();
        const newGameId = response.unique_game_id;
        setGameId(newGameId);
        socket?.emit('joinGame', newGameId);
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
      } else {
        await ApiService.setupPlayer(nickname, playerColor, opponentColor);
        socket?.emit('joinGame', gameId);
      }

      setCurrentScreen('main');
    } catch (error) {
      console.error('Error during game setup:', error);
      setErrorMessage('Failed to set up the game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await ApiService.confirmGame();
      if (gameState?.gameId) socket?.emit('confirmGame', gameState.gameId);
    } catch (error) {
      console.error('Error during game confirmation:', error);
    }
  };

  const handleRevengeRequest = async () => {
    try {
      await ApiService.requestRevenge();
      if (gameState?.gameId) socket?.emit('revengeRequest', gameState.gameId);
    } catch (error) {
      console.error('Error during revenge request:', error);
    }
  };

  const handleMove = async (column: number) => {
    if (!gameState?.isPlayerTurn || !socket) return;

    try {
      await ApiService.makeMove(column);
      if (gameState?.gameId) socket.emit('playerMove', { gameId: gameState.gameId, column });
    } catch (error) {
      console.error('Error during move:', error);
    }
  };

  const handleNewGamePress = () => {
    setIsFirstPlayer(true);
    setCurrentScreen('playerSetup');
  };

  const handleJoinGamePress = () => {
    setCurrentScreen('join');
  };

  const handleJoinGameIdEntered = (uniqueGameId: string) => {
    setGameId(uniqueGameId);
    setIsFirstPlayer(false);
    setCurrentScreen('playerSetup');
  };

  const handleBackToMenu = async () => {
    if (gameState) {
      await ApiService.disconnectFromGame();
      socket?.emit('leaveGame', gameState.gameId);
      // socket?.disconnect();
    }

    setCurrentScreen('main');
    setErrorMessage('');
    setGameState(null);
    setGameId(null);
  };

  const renderGameScreen = () => {
    if (!gameState) return <Loader size={40} />;

    switch (gameState.playerStatus) {
      case 'WAITING':
        return <WaitingScreen gameId={gameState.gameId} />;
      case 'CONFIRMING':
        return <ConfirmScreen opponentNickname={gameState.opponentNickname || 'Nemesis'} onConfirm={handleConfirm} />;
      case 'READY':
        return <ReadyScreen opponentNickname={gameState.opponentNickname || 'Nemesis'} />;
      default:
        return (
          <GameScreen
            gameState={gameState}
            onMove={handleMove}
            onBackPress={handleBackToMenu}
            onRevengeRequest={handleRevengeRequest}
          />
        );
    }
  };
  const isPlayerInGame = () => {
    return gameState && gameState.playerStatus !== 'NONE';
  };
  const renderCurrentScreen = () => {
    if (isLoading || isPlayerInGame()) return renderGameScreen();

    switch (currentScreen) {
      case 'playerSetup':
        return <PlayerSetupScreen onSetupComplete={handlePlayerSetupComplete} onBackPress={handleBackToMenu} />;
      case 'join':
        return <JoinGameScreen onBackPress={handleBackToMenu} onGameJoined={handleJoinGameIdEntered} />;
      case 'manual':
        return <ManualScreen onBackPress={handleBackToMenu} />;
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

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemedView style={styles.main} onLayout={onLayoutRootView}>
      {renderCurrentScreen()}
      {isLoading && <View style={styles.loadingOverlay}><Loader size={40} /></View>}
      {errorMessage && <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>}
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
  },
});