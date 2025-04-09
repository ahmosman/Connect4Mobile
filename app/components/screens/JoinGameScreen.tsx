import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';

interface JoinGameScreenProps {
    onBackPress: () => void;
}

export default function JoinGameScreen({ onBackPress }: JoinGameScreenProps) {
    const [gameId, setGameId] = useState('');
    const [error, setError] = useState('');

    const handleJoinGame = () => {
        if (!gameId) {
            setError('Proszę wprowadzić ID gry.');
        } else {
            setError('');
            console.log(`Dołączono do gry: ${gameId}`);
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
            />
            <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
                <Text style={styles.buttonText}>Dołącz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onBackPress}>
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
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    errorText: {
        color: 'darkred',
        marginTop: 10,
    },
});