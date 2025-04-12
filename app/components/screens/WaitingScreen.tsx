import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Loader from '../Loader';

interface WaitingScreenProps {
  gameId: string;
}

export default function WaitingScreen({ gameId }: WaitingScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Twoja gra: {gameId}</Text>
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
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
});