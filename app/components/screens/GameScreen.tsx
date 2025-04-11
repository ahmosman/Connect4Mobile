import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import GameHeader from '../game/GameHeader';
import GameBoard from '../game/GameBoard';
import ApiService, { GameState, PlayerStatus } from '../../services/ApiService';

interface GameScreenProps {
  gameId: string;
  onBackPress: () => void;
}

export default function GameScreen({ gameId, onBackPress }: GameScreenProps) {
  // Stan gry
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stan blokady interfejsu podczas wykonywania ruchu
  const [makingMove, setMakingMove] = useState<boolean>(false);
  
  // Pobieranie stanu gry z serwera
  const fetchGameState = useCallback(async () => {
    try {
      setError(null);
      const state = await ApiService.getGameState(gameId);
      setGameState(state);
    } catch (err) {
      console.error('Błąd podczas pobierania stanu gry:', err);
      setError('Nie udało się pobrać stanu gry.');
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  // Inicjalne pobranie stanu gry
  useEffect(() => {
    fetchGameState();
  }, [fetchGameState]);
  
  // Polling stanu gry co 2 sekundy
  useEffect(() => {
    if (!gameState) return;
    
    let intervalId: NodeJS.Timeout | null = null;
    
    // Jeśli nie jest kolej gracza, sprawdzaj stan co 2 sekundy
    if (gameState.playerStatus === 'OPPONENT_MOVE') {
      intervalId = setInterval(() => {
        fetchGameState();
      }, 2000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState, fetchGameState]);

  // Obsługa wykonania ruchu
  const handleMove = async (column: number) => {
    if (!gameState || gameState.playerStatus !== 'PLAYER_MOVE' || makingMove) {
      return;
    }
    
    try {
      setMakingMove(true);
      const updatedState = await ApiService.makeMove(gameId, column);
      setGameState(updatedState);
    } catch (err) {
      console.error('Błąd podczas wykonywania ruchu:', err);
      setError('Nie udało się wykonać ruchu.');
    } finally {
      setMakingMove(false);
    }
  };

  // Generowanie statusu gry
  const getGameStatus = (): string => {
    if (!gameState) return '';
    
    switch (gameState.playerStatus) {
      case 'PLAYER_MOVE':
        return 'Twój ruch';
      case 'OPPONENT_MOVE':
        return 'Ruch przeciwnika';
      case 'WIN':
        return 'Wygrałeś!';
      case 'LOSE':
        return 'Przegrałeś!';
      case 'DRAW':
        return 'Remis!';
      case 'WAITING':
        return 'Oczekiwanie...';
      default:
        return '';
    }
  };
  
  // Tryb interaktywny tylko gdy jest ruch gracza i nie wykonujemy aktualnie ruchu
  const isInteractive = gameState?.playerStatus === 'PLAYER_MOVE' && !makingMove;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a610a6" />
        <Text style={styles.loadingText}>Wczytywanie gry...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={fetchGameState}>
          <Text style={styles.buttonText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Text style={styles.buttonText}>Powrót do menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!gameState) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nie znaleziono gry.</Text>
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Text style={styles.buttonText}>Powrót do menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GameHeader 
        playerNickname={gameState.playerNickname}
        playerWins={gameState.playerWins}
        playerColor={gameState.playerColor}
        opponentNickname={gameState.opponentNickname}
        opponentWins={gameState.opponentWins}
        opponentColor={gameState.opponentColor}
      />
      
      <Text style={styles.gameStatus}>
        {getGameStatus()}
        {makingMove && ' (wykonywanie ruchu...)'}
      </Text>
      
      <GameBoard 
        board={gameState.board}
        onColumnPress={handleMove}
        playerColor={gameState.playerColor}
        opponentColor={gameState.opponentColor}
        lastPutBall={gameState.lastPutBall || [-1, -1]}
        winningBalls={gameState.winningBalls || []}
        isInteractive={isInteractive}
      />
      
      {(gameState.playerStatus === 'WIN' || gameState.playerStatus === 'LOSE' || gameState.playerStatus === 'DRAW') && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={onBackPress}
        >
          <Text style={styles.buttonText}>Powrót do menu</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'darkred',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  gameStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a610a6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});