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
    if (!nickname.trim()) return setErrorMessage('Please enter a nickname');
    if (nickname.length > 7) return setErrorMessage('Nickname can be max 7 characters');
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
        <Text style={styles.setupTitle}>Choose your nickname and color</Text>

        <Text style={styles.heading}>Enter your nickname</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Max. 7 characters"
          maxLength={7}
          editable={!isLoading}
        />

        <Text style={styles.heading}>Choose your color</Text>
        <View style={styles.colorPickerContainer}>{renderColorOptions(true)}</View>

        <Text style={styles.heading}>Choose opponent's color</Text>
        <View style={styles.colorPickerContainer}>{renderColorOptions(false)}</View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onBackPress} disabled={isLoading}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Confirm</Text>}
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
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    alignSelf: 'center',
  },
  setupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 20,
    textAlign: 'center',
    color: '#a610a6',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    minWidth: 150,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
    backgroundColor: 'white',
    alignSelf: 'center',
    textAlign: 'center',
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
    fontFamily: 'Rajdhani_500Medium',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});