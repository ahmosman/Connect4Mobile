import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

interface ConfirmScreenProps {
  opponentNickname: string;
  onConfirm: () => void;
}

export default function ConfirmScreen({ opponentNickname, onConfirm }: ConfirmScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{opponentNickname} czeka na Ciebie!</Text>
      <Text style={styles.heading}>Gotowy?</Text>
      <TouchableOpacity style={styles.button} onPress={onConfirm}>
        <Text style={styles.buttonText}>Gotowy</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#a610a6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});