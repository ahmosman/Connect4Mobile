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
        if (!gameId) return setError('Proszę wprowadzić ID gry.');

        setIsLoading(true);
        setError('');

        try {
            await ApiService.joinGame(gameId);
            console.log(`Znaleziono grę: ${gameId}`);
            onGameJoined(gameId);
        } catch {
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
                onChangeText={(text) => setGameId(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
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
            <TouchableOpacity style={styles.button} onPress={onBackPress} disabled={isLoading}>
                <Text style={styles.buttonText}>Powrót</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
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
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Rajdhani_500Medium',
        marginBottom: 20,
    },
    input: {
        width: 200,
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        fontFamily: 'Rajdhani_500Medium',
        fontSize: 16,
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
        fontFamily: 'Rajdhani_500Medium',
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        textAlign: 'center',
    },
});