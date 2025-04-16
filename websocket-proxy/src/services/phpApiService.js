const axios = require('axios');
const config = require('../config');

// Przechowuje obiekty sesji dla każdej gry
const sessionCookies = {};

async function request(method, endpoint, body = null, gameId = null) {
    try {
        const url = `${config.PHP_API_URL}/${endpoint}`;
        
        const headers = {};
        if (gameId && sessionCookies[gameId]) {
            headers.Cookie = sessionCookies[gameId];
        }

        const requestConfig = { 
            method, 
            url,
            headers,
            withCredentials: true
        };

        if (method.toUpperCase() === 'POST' && body) {
            const formData = new FormData();
            Object.entries(body).forEach(([key, value]) => {
                formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
            });
            requestConfig.data = formData;
        } else if (method.toUpperCase() === 'GET' && body) {
            requestConfig.params = body;
        }
        
        const response = await axios(requestConfig);

        // Zapisz ciasteczko sesji, jeśli jest
        const setCookie = response.headers['set-cookie'];
        if (setCookie && gameId) {
            sessionCookies[gameId] = setCookie;
        }

        return response.data;
    } catch (error) {
        console.error(`PHP API error: ${error.message}`);
        throw error;
    }
}

// Metody API
const getGameState = async (gameId) => {
    const response = await request('GET', 'game-state.php', { gameId }, gameId);
    return response.content;
};

const joinGame = async (gameId) => {
    const response = await request('POST', 'game-join.php', { unique_game_id: gameId }, gameId);
    return response;
};

const startNewGame = async () => {
    const response = await request('POST', 'game-start.php');
    return response.content;
};

const setupPlayer = async (gameId, nickname, playerColor, opponentColor) => {
    const response = await request('POST', 'game-player-setup.php', {
        nickname,
        player_color: playerColor,
        opponent_color: opponentColor,
    }, gameId);
    return response;
};

const makeMove = async (gameId, column) => {
    const response = await request('POST', 'game-put-ball.php', { column }, gameId);
    return response.content;
};

const confirmGame = async (gameId) => {
    const response = await request('POST', 'game-confirm.php', {}, gameId);
    return response;
};

const requestRevenge = async (gameId) => {
    const response = await request('POST', 'game-revenge.php', {}, gameId);
    return response;
};

const disconnectFromGame = async (gameId) => {
    const response = await request('POST', 'game-disconnect.php', {}, gameId);
    return response;
};

module.exports = {
    getGameState,
    joinGame,
    startNewGame,
    setupPlayer,
    makeMove,
    confirmGame,
    requestRevenge,
    disconnectFromGame
};