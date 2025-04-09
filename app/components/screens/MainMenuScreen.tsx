import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface MainMenuScreenProps {
  onNewGamePress: () => void;
  onJoinGamePress: () => void;
  onManualPress: () => void;
}

export default function MainMenuScreen({
  onNewGamePress,
  onJoinGamePress,
  onManualPress,
}: MainMenuScreenProps) {
  const buttons = [
    { label: 'Nowa gra', onPress: onNewGamePress },
    { label: 'Dołącz do gry', onPress: onJoinGamePress },
    { label: 'O grze', onPress: onManualPress },
  ];

  return (
    <View style={styles.mainSection}>
      <ThemedText style={styles.heading}>Connect4</ThemedText>
      {buttons.map((button, index) => (
        <TouchableOpacity key={index} style={styles.btnMain} onPress={button.onPress}>
          <ThemedText style={styles.buttonText}>{button.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mainSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 700,
  },
  heading: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 38,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  btnMain: {
    borderRadius: 10,
    backgroundColor: '#a610a6',
    marginVertical: 10,
    height: 40,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Rajdhani_500Medium',
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
});