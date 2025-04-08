import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useFonts, Rajdhani_500Medium } from '@expo-google-fonts/rajdhani';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

// Zapobiegaj automatycznemu ukryciu ekranu ładowania
SplashScreen.preventAutoHideAsync();

export default function HomeScreen() {
  const [errorMessage, setErrorMessage] = useState('');

  // Załadowanie czcionki Rajdhani z Google Fonts
  const [fontsLoaded, fontError] = useFonts({
    Rajdhani_500Medium,
  });

  // Ukryj ekran ładowania po załadowaniu czcionek
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleNewGame = () => {
    console.log('Nowa gra');
  };

  const handleJoinGame = () => {
    console.log('Dołącz do gry');
  };

  const handleManual = () => {
    console.log('O grze');
  };

  return (
    <ThemedView style={styles.main} onLayout={onLayoutRootView}>
      <View style={styles.mainSection}>
        <ThemedText style={styles.heading}>Connect4</ThemedText>

        <TouchableOpacity
          style={styles.btnMain}
          onPress={handleNewGame}
        >
          <ThemedText style={styles.buttonText}>Nowa gra</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnMain}
          onPress={handleJoinGame}
        >
          <ThemedText style={styles.buttonText}>Dołącz do gry</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnMain}
          onPress={handleManual}
        >
          <ThemedText style={styles.buttonText}>O grze</ThemedText>
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'violet',
  },
  mainSection: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 700,
    fontStyle: 'italic',
  },
  heading: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 38,
    maxWidth: '60%',
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
  errorMessage: {
    position: 'absolute',
    color: 'darkred',
    width: 150,
    textAlign: 'center',
    bottom: 20,
  }
});