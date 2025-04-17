import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Loader from '../Loader';

interface WaitingScreenProps {
  gameId: string;
}

export default function WaitingScreen({ gameId }: WaitingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Twoja gra:</Text>
      <Text style={styles.gameId}>{gameId}</Text>
      <Text style={styles.text}>Oczekiwanie na przeciwnika...</Text>
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
  gameId: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    color: '#a610a6',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Rajdhani_500Medium',
  },
});