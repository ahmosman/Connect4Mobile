import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

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
  return (
    <View style={styles.header}>
      {/* Nazwy graczy */}
      <View style={styles.row}>
        <Text style={[styles.nickname, { color: playerColor }]}>
          {playerNickname || 'Gracz'}
        </Text>
        <Text style={styles.vs}>vs</Text>
        <Text style={[styles.nickname, { color: opponentColor }]}>
          {opponentNickname || 'Przeciwnik'}
        </Text>
      </View>

      {/* Wygrane */}
      <View style={styles.row}>
        <Text style={[styles.wins, { color: playerColor }]}>
          Wygrane: {playerWins}
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.wins, { color: opponentColor }]}>
          Wygrane: {opponentWins}
        </Text>
      </View>

      {/* Kolorowe wskaźniki */}
      <View style={styles.indicatorRow}>
        <View style={[styles.colorIndicator, { backgroundColor: playerColor }]} />
        <View style={styles.spacer} />
        <View style={[styles.colorIndicator, { backgroundColor: opponentColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 14,
    marginHorizontal: 8,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    color: '#444',
  },
  wins: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Rajdhani_500Medium',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
    marginHorizontal: 10,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  colorIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  spacer: {
    flex: 1,
  }
});