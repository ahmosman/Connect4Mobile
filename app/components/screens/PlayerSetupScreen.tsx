import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import ApiService from '../../services/ApiService';

interface PlayerSetupScreenProps {
  gameId: string;
  isFirstPlayer: boolean; // Czy to pierwszy gracz
  onSetupComplete: (nickname: string, playerColor: string, opponentColor: string) => void;
  onBackPress: () => void;
}

// Dostępne kolory dla graczy
const COLORS = {
  blue: '#2196f3',
  orange: '#ff9800',
  cyan: '#00bcd4',
  magenta: '#e91e63',
  green: '#4caf50'
};

export default function PlayerSetupScreen({ 
  gameId, 
  isFirstPlayer, 
  onSetupComplete, 
  onBackPress 
}: PlayerSetupScreenProps) {
  // Stan dla formularza
  const [nickname, setNickname] = useState('');
  const [playerColor, setPlayerColor] = useState(COLORS.blue);
  const [opponentColor, setOpponentColor] = useState(COLORS.orange);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Obsługa zmiany koloru gracza
  const handlePlayerColorChange = (color: string) => {
    if (color === opponentColor) {
      // Zapobiegaj wybraniu tego samego koloru
      return;
    }
    setPlayerColor(color);
  };

  // Obsługa zmiany koloru przeciwnika
  const handleOpponentColorChange = (color: string) => {
    if (color === playerColor) {
      // Zapobiegaj wybraniu tego samego koloru
      return;
    }
    setOpponentColor(color);
  };

  // Wysyłanie formularza
  const handleSubmit = () => {
    if (!nickname || nickname.trim().length === 0) {
      setErrorMessage('Proszę podać nick');
      return;
    }

    if (nickname.length > 7) {
      setErrorMessage('Nick może mieć maksymalnie 7 znaków');
      return;
    }

    // Przekaż dane do rodzica
    onSetupComplete(nickname, playerColor, opponentColor);
  };

  // Renderowanie pojedynczego koloru
  const renderColorOption = (color: string, isPlayerColor: boolean) => {
    const isSelected = isPlayerColor 
      ? color === playerColor 
      : color === opponentColor;
    
    const handlePress = isPlayerColor
      ? () => handlePlayerColorChange(color)
      : () => handleOpponentColorChange(color);
    
    return (
      <TouchableOpacity
        key={`${color}-${isPlayerColor ? 'player' : 'opponent'}`}
        style={[styles.color, { backgroundColor: color }, isSelected && styles.selectedColor]}
        onPress={handlePress}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.setupTitle}>
          {isFirstPlayer ? 'Konfiguracja nowej gry' : 'Dołączanie do gry ' + gameId}
        </Text>

        <Text style={styles.heading}>Podaj swój nick</Text>
        <TextInput
          style={styles.input}
          value={nickname}
          onChangeText={setNickname}
          placeholder="Max. 7 znaków"
          placeholderTextColor="#999"
          maxLength={7}
          editable={!isLoading}
        />

        <Text style={styles.heading}>Wybierz swój kolor</Text>
        <View style={styles.colorPickerContainer}>
          {renderColorOption(COLORS.blue, true)}
          {renderColorOption(COLORS.orange, true)}
          {renderColorOption(COLORS.cyan, true)}
          {renderColorOption(COLORS.magenta, true)}
          {renderColorOption(COLORS.green, true)}
        </View>

        <Text style={styles.heading}>Wybierz kolor przeciwnika</Text>
        <View style={styles.colorPickerContainer}>
          {renderColorOption(COLORS.blue, false)}
          {renderColorOption(COLORS.orange, false)}
          {renderColorOption(COLORS.cyan, false)}
          {renderColorOption(COLORS.magenta, false)}
          {renderColorOption(COLORS.green, false)}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={onBackPress}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Powrót</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isFirstPlayer ? 'Utwórz grę' : 'Dołącz do gry'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
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