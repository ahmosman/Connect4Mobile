import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 360;

interface GameHeaderProps {
  playerNickname: string;
  playerWins: number;
  playerColor: string;
  opponentNickname: string;
  opponentWins: number;
  opponentColor: string;
}

export default function GameHeader({
  playerNickname,
  playerWins,
  playerColor,
  opponentNickname,
  opponentWins,
  opponentColor
}: GameHeaderProps) {
  const fontSize = isSmallScreen ? 16 : 18;
  const indicatorSize = isSmallScreen ? 24 : 30;

  const renderPlayerInfo = (
    nickname: string,
    color: string,
    wins: number,
    alignRight: boolean = false
  ) => (
    <View style={styles.playerInfo}>
      <Text
        style={[styles.nickname, { color, fontSize }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {nickname || (alignRight ? 'Opponent' : 'Player')}
      </Text>
      <Text style={[styles.wins, { color, fontSize: Math.max(fontSize - 4, 12) }]}>
        Wins: {wins}
      </Text>
      <View
        style={[
          styles.colorIndicator,
          {
            backgroundColor: color,
            width: indicatorSize,
            height: indicatorSize,
            borderRadius: indicatorSize / 2
          }
        ]}
      />
    </View>
  );

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {renderPlayerInfo(playerNickname, playerColor, playerWins)}

        <View style={styles.vsContainer}>
          <Text style={[styles.vs, { fontSize: Math.max(fontSize - 4, 12) }]}>vs</Text>
          <View style={styles.divider} />
        </View>

        {renderPlayerInfo(opponentNickname, opponentColor, opponentWins, true)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: screenWidth * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: isSmallScreen ? 8 : 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  playerInfo: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  nickname: {
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    textAlign: 'center',
    paddingHorizontal: 4,
    marginBottom: 5,
  },
  vsContainer: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  vs: {
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    color: '#444',
    marginBottom: 5,
  },
  wins: {
    textAlign: 'center',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 5,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#ddd',
    marginTop: 5,
  },
  colorIndicator: {
    borderWidth: 1,
    borderColor: '#999',
    marginTop: 5,
  }
});