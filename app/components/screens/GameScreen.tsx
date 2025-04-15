import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GameState } from '../../services/GameService';
import GameBoard from '../game/GameBoard';
import GameHeader from '../game/GameHeader';
import Toast from 'react-native-toast-message';
import GameService from '../../services/GameService';

interface GameScreenProps {
  gameState: GameState;
  onMove: (column: number) => void;
  onBackPress: () => void;
}

export default function GameScreen({ gameState, onMove, onBackPress }: GameScreenProps) {
  const isInteractive = gameState.playerStatus === 'PLAYER_MOVE';

  useEffect(() => {
    if (gameState.opponentStatus === 'REVENGE') {
      Toast.show({
        type: 'info',
        text1: 'Przeciwnik chce rewanżu!',
        position: 'top',
        visibilityTime: 10000,
      });
    } else if (gameState.opponentStatus === 'DISCONNECTED') {
      Toast.show({
        type: 'error',
        text1: 'Przeciwnik opuścił grę',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [gameState.opponentStatus]);

  const handleRevengeRequest = async () => {
    try {
      await GameService.requestRevenge();
      Toast.show({
        type: 'success',
        text1: 'Wysłano propozycję rewanżu',
        position: 'top',
        visibilityTime: 2000,
      });
    } catch (error) {
      console.error('Błąd podczas żądania rewanżu:', error);
      Toast.show({
        type: 'error',
        text1: 'Nie udało się wysłać propozycji rewanżu',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const handleBackToMenu = async () => {
    try {
      await GameService.disconnectFromGame();
      onBackPress();
    } catch (error) {
      console.error('Błąd podczas rozłączania:', error);
      onBackPress();
    }
  };

  const showRevengeButton = (gameState.playerStatus === 'WIN' ||
    gameState.playerStatus === 'LOSE' ||
    gameState.playerStatus === 'DRAW') &&
    gameState.opponentStatus !== 'DISCONNECTED';

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

      <Text style={styles.statusText}>{gameState.gameInfo}</Text>

      <GameBoard
        board={gameState.board}
        onColumnPress={onMove}
        playerColor={gameState.playerColor}
        opponentColor={gameState.opponentColor}
        lastPutBall={gameState.lastPutBall || [-1, -1]}
        winningBalls={gameState.winningBalls || []}
        isInteractive={isInteractive}
      />

      {(gameState.playerStatus === 'WIN' || gameState.playerStatus === 'LOSE' || gameState.playerStatus === 'DRAW') && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleBackToMenu}>
            <Text style={styles.buttonText}>Menu główne</Text>
          </TouchableOpacity>

          {showRevengeButton && (
            <TouchableOpacity
              style={[styles.button, styles.revengeButton]}
              onPress={handleRevengeRequest}
            >
              <Text style={styles.buttonText}>Rewanż</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Toast />
    </View>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
  button: {
    backgroundColor: '#a610a6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 120,
    alignItems: 'center',
  },
  revengeButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});