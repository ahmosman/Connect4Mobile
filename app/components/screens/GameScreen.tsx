import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GameState } from '../../services/ApiService';
import GameBoard from '../game/GameBoard';
import GameHeader from '../game/GameHeader';
import Toast from 'react-native-toast-message';
import { useResponsiveSize } from '@/app/hooks/useResponsiveSize';

interface GameScreenProps {
  gameState: GameState;
  onMove: (column: number) => void;
  onBackPress: () => void;
  onRevengeRequest: () => void;
}

const GameInfoTranslations: Record<string, string> = {
  'Twój ruch': 'Your turn',
  'Ruch przeciwnika': 'Opponent\'s turn',
  'WYGRAŁEŚ': 'YOU WON',
  'PRZEGRAŁEŚ': 'YOU LOST',
  'Oczekiwanie na potwierdzenie rewanżu': 'Waiting for rematch confirmation',
  'Przeciwnik rozłączył się': 'Opponent disconnected',
}

export default function GameScreen({ gameState, onMove, onBackPress, onRevengeRequest }: GameScreenProps) {
  const { fontSize, buttonSize, spacing, isTablet } = useResponsiveSize();
  const isInteractive = gameState.playerStatus === 'PLAYER_MOVE';
  const showRevengeButton = ['WIN', 'LOSE', 'DRAW'].includes(gameState.playerStatus) && gameState.opponentStatus !== 'DISCONNECTED';

  useEffect(() => {
    const messages: Record<string, { type: string; text1: string; visibilityTime: number }> = {
      REVENGE: { type: 'info', text1: 'Opponent wants a rematch!', visibilityTime: 10000 },
      DISCONNECTED: { type: 'error', text1: 'Opponent left the game', visibilityTime: 3000 },
    };

    if (gameState.opponentStatus && messages[gameState.opponentStatus]) {
      Toast.show({ ...messages[gameState.opponentStatus], position: 'top' });
    }
  }, [gameState.opponentStatus]);

  const requestRevenge = () => {
    try {
      onRevengeRequest();
      Toast.show({ type: 'success', text1: 'Rematch request sent', position: 'top', visibilityTime: 2000 });
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send rematch request', position: 'top', visibilityTime: 2000 });
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
        isTablet={isTablet}
      />

      <Text style={[styles.statusText, { fontSize: fontSize.large }]}>
        {GameInfoTranslations[gameState.gameInfo] || gameState.gameInfo}
      </Text>

      <GameBoard
        board={gameState.board}
        onColumnPress={onMove}
        playerColor={gameState.playerColor}
        opponentColor={gameState.opponentColor}
        lastPutBall={gameState.lastPutBall || [-1, -1]}
        winningBalls={gameState.winningBalls || []}
        isInteractive={isInteractive}
      />

      {['WIN', 'LOSE', 'DRAW', 'REVENGE'].includes(gameState.playerStatus) && (
        <View style={[styles.buttonsContainer, {
          maxWidth: gameState.board[0].length * (isTablet ? 65 : 45),
          gap: spacing.normal
        }]}>
          <TouchableOpacity
            style={[styles.button, {
              height: buttonSize.height,
              minWidth: buttonSize.minWidth,
              borderRadius: buttonSize.borderRadius
            }]}
            onPress={onBackPress}
          >
            <Text style={[styles.buttonText, { fontSize: fontSize.large }]}>Main Menu</Text>
          </TouchableOpacity>
          {showRevengeButton && (
            <TouchableOpacity style={[
              styles.button, {
                height: buttonSize.height,
                minWidth: buttonSize.minWidth,
                borderRadius: buttonSize.borderRadius
              },
              styles.revengeButton]}
              onPress={requestRevenge}>
              <Text style={[styles.buttonText, { fontSize: fontSize.large }]}>Rematch</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Toast />
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
    fontFamily: 'Rajdhani_500Medium',
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
    fontFamily: 'Rajdhani_500Medium',
  },
});