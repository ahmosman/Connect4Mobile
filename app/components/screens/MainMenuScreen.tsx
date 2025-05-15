import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, ActivityIndicator, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Logo from '@/assets/images/logo.svg';

const { width, height } = Dimensions.get('window');

interface MainMenuScreenProps {
  onNewGamePress: () => void;
  onJoinGamePress: () => void;
  onManualPress: () => void;
  isLoading?: boolean;
}

export default function MainMenuScreen({
  onNewGamePress,
  onJoinGamePress,
  onManualPress,
  isLoading = false,
}: MainMenuScreenProps) {
  const logoSize = useMemo(() => {
    if (width < 360) return 480;
    if (width < 768) return 500;
    if (width < 1024) return 550;
    return 600;
  }, [width]);

  const buttons = [
    { label: isLoading ? 'Creating...' : 'New Game', onPress: onNewGamePress, showLoader: isLoading },
    { label: 'Join Game', onPress: onJoinGamePress },
    { label: 'About', onPress: onManualPress },
  ];

  return (
    <View style={styles.mainSection}>
      <View style={styles.logoContainer}>
        <Logo width={logoSize} height={logoSize} style={styles.logoBackground} />
      </View>

      <ThemedText style={styles.heading}>Connect4</ThemedText>
      {buttons.map((button, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.btnMain, isLoading && index !== 0 && styles.btnDisabled]}
          onPress={button.onPress}
          disabled={isLoading && index !== 0}
        >
          {button.showLoader ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <ThemedText style={styles.buttonText}>{button.label}</ThemedText>
          )}
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
  logoContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logoBackground: {
    opacity: 0.3,
  },
  heading: {
    fontFamily: 'Rajdhani_500Medium',
    fontSize: 38,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    zIndex: 2,
    includeFontPadding: false,
    textAlignVertical: 'center',
    height: 60,
  },
  btnMain: {
    borderRadius: 10,
    backgroundColor: '#a610a6',
    width: 150,
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 2,
  },
  btnDisabled: {
    backgroundColor: '#c77ac7',
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: 'bold',
    fontFamily: 'Rajdhani_500Medium',
    color: 'white',
  },
});