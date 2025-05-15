import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';

interface ManualScreenProps {
  onBackPress: () => void;
}

export default function ManualScreen({ onBackPress }: ManualScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>How to Play</Text>

      <Text style={styles.subHeading}>Create a New Game</Text>
      <Text style={styles.listItem}>1. Click the "New Game" button</Text>
      <Text style={styles.listItem}>
        2. Enter your nickname, choose your ball color and opponent's ball color
      </Text>
      <Text style={styles.listItem}>
        3. Share the generated game ID with your opponent and wait for them to join!
      </Text>

      <Text style={styles.subHeading}>Join an Existing Game</Text>
      <Text style={styles.listItem}>1. Click the "Join Game" button</Text>
      <Text style={styles.listItem}>2. Enter the game ID received from your opponent</Text>
      <Text style={styles.listItem}>
        3. Enter your nickname, choose your ball color and opponent's ball color
      </Text>
      <Text style={styles.listItem}>4. Confirm your information and start the game!</Text>

      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'violet',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginTop: 20,
    marginBottom: 10,
    color: 'black',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#a610a6',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 16,
  },
});