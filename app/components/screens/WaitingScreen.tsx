import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Loader from '../Loader';

interface WaitingScreenProps {
  gameId: string;
  onBackPress: () => void;
}

export default function WaitingScreen({ gameId, onBackPress }: WaitingScreenProps) {
  return (
    <View style={styles.gameIdDiv}>
      <ThemedText style={styles.gameHeading}>
        Twoja gra: <ThemedText style={styles.gameIdSpan}>{gameId}</ThemedText>
      </ThemedText>
      <ThemedText style={styles.waitingHeading}>Oczekiwanie na przeciwnika</ThemedText>
      <Loader />
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ThemedText style={styles.backButtonText}>Powrót</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gameIdDiv: {
    width: 250,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameHeading: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
  },
  gameIdSpan: {
    fontFamily: 'Rajdhani_500Medium',
    fontWeight: 'bold',
    color: 'black',
  },
  waitingHeading: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#a610a6',
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});