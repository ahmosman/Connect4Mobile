import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Loader from '../Loader';

interface ReadyScreenProps {
  opponentNickname: string;
}

export default function ReadyScreen({ opponentNickname }: ReadyScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Waiting for {opponentNickname}...</Text>
      <Text style={styles.subText}>Opponent is getting ready</Text>
      <Loader size={40} />
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
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  subText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Rajdhani_500Medium',
  }
});