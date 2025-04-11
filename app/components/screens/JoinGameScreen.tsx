import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import ApiService from '../../services/ApiService';

interface JoinGameScreenProps {
    onBackPress: () => void;
    onGameJoined: (gameId: string) => void;
}

export default function JoinGameScreen({ onBackPress, onGameJoined }: JoinGameScreenProps) {
    const [gameId, setGameId] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoinGame = async () => {
        if (!gameId) {
            setError('Proszę wprowadzić ID gry.');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            // Sprawdzamy czy gra istnieje
            try {
                await ApiService.getGameState(gameId);
            } catch (error) {
                throw new Error("Podana gra nie istnieje lub jest już zakończona.");
            }

            console.log(`Znaleziono grę: ${gameId}`);
            onGameJoined(gameId);
        } catch (error) {
            console.error('Błąd podczas szukania gry:', error);
            setError('Nie znaleziono gry. Sprawdź ID gry i spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Wprowadź ID gry</Text>
            <TextInput
                style={styles.input}
                placeholder="ID gry"
                value={gameId}
                onChangeText={setGameId}
                editable={!isLoading}
            />
            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleJoinGame}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.buttonText}>Dalej</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={onBackPress}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>Powrót</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

// Style pozostają bez zmian
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    button: {
        backgroundColor: '#a610a6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 10,
        width: 200,
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    }
});