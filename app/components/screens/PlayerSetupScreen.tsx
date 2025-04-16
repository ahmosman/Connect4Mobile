import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface PlayerSetupScreenProps {
  onSetupComplete: (nickname: string, playerColor: string, opponentColor: string) => void;
  onBackPress: () => void;
}

const COLORS = {
  blue: '#2196f3',
  orange: '#ff9800',
  cyan: '#00bcd4',
  magenta: '#e91e63',
  green: '#4caf50',
};

export default function PlayerSetupScreen({ onSetupComplete, onBackPress }: PlayerSetupScreenProps) {
  const [nickname, setNickname] = useState('');
  const [playerColor, setPlayerColor] = useState(COLORS.blue);
  const [opponentColor, setOpponentColor] = useState(COLORS.orange);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleColorChange = (color: string, isPlayer: boolean) => {
    if (isPlayer && color !== opponentColor) setPlayerColor(color);
    if (!isPlayer && color !== playerColor) setOpponentColor(color);
  };

  const handleSubmit = () => {
    if (!nickname.trim()) return setErrorMessage('Proszę podać nick');
    if (nickname.length > 7) return setErrorMessage('Nick może mieć maksymalnie 7 znaków');
    onSetupComplete(nickname, playerColor, opponentColor);
  };

  const renderColorOptions = (isPlayer: boolean) =>
    Object.values(COLORS).map((color) => (
      <TouchableOpacity
        key={color}
        style={[
          styles.color,
          { backgroundColor: color },
          (isPlayer ? color === playerColor : color === opponentColor) && styles.selectedColor,
        ]}
        onPress={() => handleColorChange(color, isPlayer)}
      />
    ));

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.setupTitle}>Wybierz swój kolor i nick</Text>

        <Text style={styles.heading}>Podaj swój nick</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Max. 7 znaków"
          maxLength={7}
          editable={!isLoading}
        />

        <Text style={styles.heading}>Wybierz swój kolor</Text>
        <View style={styles.colorPickerContainer}>{renderColorOptions(true)}</View>

        <Text style={styles.heading}>Wybierz kolor przeciwnika</Text>
        <View style={styles.colorPickerContainer}>{renderColorOptions(false)}</View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onBackPress} disabled={isLoading}>
            <Text style={styles.buttonText}>Powrót</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Zatwierdź</Text>}
          </TouchableOpacity>
        </View>

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
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
  formContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#a610a6',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: 'white',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: 'black',
    transform: [{ scale: 1.1 }],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});