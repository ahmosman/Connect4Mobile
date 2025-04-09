import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { ApiService as API } from '../../services/ApiService';


interface JoinGameScreenProps {
    onBackPress: () => void;
}

export default function JoinGameScreen({ onBackPress }: JoinGameScreenProps) {
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
            
            const response = await API.joinGame(gameId);
            console.log(`Dołączono do gry: ${gameId}`, response);
            
            
        } catch (error) {
            console.error('Błąd podczas dołączania do gry:', error);
            setError('Nie udało się dołączyć do gry. Sprawdź ID gry i spróbuj ponownie.');
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
                    <Text style={styles.buttonText}>Dołącz</Text>
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
        height: 40,
        width: 150,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#c006c0',
        paddingHorizontal: 15,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        borderRadius: 10,
        backgroundColor: '#a610a6',
        marginVertical: 10,
        height: 40,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#c77ac7',
        opacity: 0.7,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    errorText: {
        color: 'darkred',
        marginTop: 10,
        textAlign: 'center',
    },
});