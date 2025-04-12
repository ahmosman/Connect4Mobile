import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GameState } from '../../services/ApiService';
import GameBoard from '../game/GameBoard';
import GameHeader from '../game/GameHeader';

interface GameScreenProps {
  gameState: GameState;
  onMove: (column: number) => void;
  onBackPress: () => void;
}

export default function GameScreen({ gameState, onMove, onBackPress }: GameScreenProps) {
  const isInteractive = gameState.playerStatus === 'PLAYER_MOVE';

  // Status gry
  const getGameStatusText = () => {
    switch (gameState.playerStatus) {
      case 'PLAYER_MOVE':
        return 'Twój ruch';
      case 'OPPONENT_MOVE':
        return `${gameState.opponentNickname || 'Przeciwnik'} wykonuje ruch...`;
      case 'WIN':
        return 'Wygrałeś!';
      case 'LOSE':
        return 'Przegrałeś!';
      case 'DRAW':
        return 'Remis!';
      default:
        return '';
    }
  };

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

      <Text style={styles.statusText}>{getGameStatusText()}</Text>

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
        <TouchableOpacity style={styles.button} onPress={onBackPress}>
          <Text style={styles.buttonText}>Menu główne</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

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
  button: {
    backgroundColor: '#a610a6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});