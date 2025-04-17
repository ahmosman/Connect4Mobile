import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';

interface ManualScreenProps {
  onBackPress: () => void;
}

export default function ManualScreen({ onBackPress }: ManualScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Jak grać</Text>

      <Text style={styles.subHeading}>Stwórz nową grę</Text>
      <Text style={styles.listItem}>1. Kliknij przycisk "Nowa gra"</Text>
      <Text style={styles.listItem}>
        2. Wpisz swój nick, wybierz kolor twoich piłek oraz kolor piłek przeciwnika
      </Text>
      <Text style={styles.listItem}>
        3. Podaj wygenerowane ID gry swojemu przeciwnikowi i zaczekaj aż dołączy!
      </Text>

      <Text style={styles.subHeading}>Dołącz do istniejącej gry</Text>
      <Text style={styles.listItem}>1. Kliknij przycisk "Dołącz do gry"</Text>
      <Text style={styles.listItem}>2. Wprowadź otrzymane ID gry od przeciwnika</Text>
      <Text style={styles.listItem}>
        3. Wpisz swój nick, wybierz kolor twoich piłek oraz kolor piłek przeciwnika
      </Text>
      <Text style={styles.listItem}>4. Zatwierdź wprowadzone dane i rozpocznij grę!</Text>

      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Text style={styles.backButtonText}>Powrót</Text>
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