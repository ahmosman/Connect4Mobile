import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useResponsiveSize } from '@/app/hooks/useResponsiveSize';

interface ManualScreenProps {
  onBackPress: () => void;
}

export default function ManualScreen({ onBackPress }: ManualScreenProps) {
  const { fontSize, buttonSize, spacing, isTablet } = useResponsiveSize();

  return (
    <ScrollView contentContainerStyle={[styles.container, { padding: spacing.large }]}>
      <Text style={[styles.heading, { fontSize: fontSize.xlarge }]}>How to Play</Text>

      <Text style={[styles.subHeading, { fontSize: fontSize.large, marginTop: spacing.large }]}>Create a New Game</Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>1. Click the "New Game" button</Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>
        2. Enter your nickname, choose your ball color and opponent's ball color
      </Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>
        3. Share the generated game ID with your opponent and wait for them to join!
      </Text>

      <Text style={[styles.subHeading, { fontSize: fontSize.large, marginTop: spacing.large }]}>Join an Existing Game</Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>1. Click the "Join Game" button</Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>2. Enter the game ID received from your opponent</Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>
        3. Enter your nickname, choose your ball color and opponent's ball color
      </Text>
      <Text style={[styles.listItem, { fontSize: fontSize.normal }]}>4. Confirm your information and start the game!</Text>

      <TouchableOpacity
        style={[
          styles.backButton,
          {
            marginTop: spacing.large,
            padding: spacing.normal,
            borderRadius: buttonSize.borderRadius,
            height: buttonSize.height,
            justifyContent: 'center'
          }
        ]}
        onPress={onBackPress}
      >
        <Text style={[
          styles.backButtonText,
          { fontSize: fontSize.large }
        ]}>
          Back
        </Text>
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
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  subHeading: {
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    marginBottom: 10,
    color: 'black',
  },
  listItem: {
    marginBottom: 5,
    color: 'black',
  },
  backButton: {
    backgroundColor: '#a610a6',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
  },
});