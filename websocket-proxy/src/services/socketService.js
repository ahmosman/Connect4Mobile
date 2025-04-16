const { Server } = require('socket.io');
const phpApiService = require('./phpApiService');
const logger = require('../utils/logger');

let io = null;
const gameRooms = new Map(); // Przechowuje informacje o pokojach gier

// Funkcja aktualizująca stan gry i wysyłająca do klientów
async function updateAndBroadcastGameState(gameId) {
  try {
    // Pobierz aktualny stan gry z PHP
    const gameState = await phpApiService.getGameState(gameId);
    
    // Wyślij do wszystkich klientów w pokoju gry
    io.to(gameId).emit('gameStateUpdate', { content: gameState });
    
    return gameState;
  } catch (error) {
    logger.error(`Error updating game state for game ${gameId}:`, error);
  }
}

function setupSocket(wss) {
  io = new Server();
  io.attach(wss.server || wss);

  io.on('connection', (socket) => {
    logger.info('New WebSocket connection:', socket.id);

    socket.on('joinGame', async ({ gameId }) => {
      try {
        // Opuść wszystkie inne pokoje
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Dołącz do pokoju gry
        socket.join(gameId);
        logger.info(`Socket ${socket.id} joined game ${gameId}`);

        // Dodaj grę do śledzonych gier jeśli jej jeszcze nie ma
        if (!gameRooms.has(gameId)) {
          gameRooms.set(gameId, {
            players: new Set(),
            lastUpdate: Date.now()
          });
        }

        // Dodaj gracza do pokoju
        const gameRoom = gameRooms.get(gameId);
        gameRoom.players.add(socket.id);
        
        // Aktualizuj stan gry dla wszystkich
        await updateAndBroadcastGameState(gameId);
      } catch (error) {
        logger.error(`Error joining game ${gameId}:`, error);
        socket.emit('error', { message: 'Could not join game' });
      }
    });

    socket.on('makeMove', async ({ gameId, column }) => {
      try {
        logger.info(`Player made a move in game ${gameId} at column ${column}`);
        
        // Wywołaj ruch w API PHP
        await phpApiService.makeMove(gameId, column);
        
        // Aktualizuj stan gry dla wszystkich
        await updateAndBroadcastGameState(gameId);
      } catch (error) {
        logger.error(`Error making move in game ${gameId}:`, error);
        socket.emit('error', { message: 'Could not make move' });
      }
    });

    socket.on('confirmGame', async ({ gameId }) => {
      try {
        await phpApiService.confirmGame(gameId);
        await updateAndBroadcastGameState(gameId);
      } catch (error) {
        logger.error(`Error confirming game ${gameId}:`, error);
      }
    });

    socket.on('requestRevenge', async ({ gameId }) => {
      try {
        await phpApiService.requestRevenge(gameId);
        await updateAndBroadcastGameState(gameId);
      } catch (error) {
        logger.error(`Error requesting revenge for game ${gameId}:`, error);
      }
    });

    socket.on('leaveGame', async ({ gameId }) => {
      try {
        await phpApiService.disconnectFromGame(gameId);
        await updateAndBroadcastGameState(gameId);
        
        socket.leave(gameId);
        
        // Usuń gracza z pokoju
        const gameRoom = gameRooms.get(gameId);
        if (gameRoom) {
          gameRoom.players.delete(socket.id);
          // Usuń pokój jeśli jest pusty
          if (gameRoom.players.size === 0) {
            gameRooms.delete(gameId);
          }
        }
      } catch (error) {
        logger.error(`Error leaving game ${gameId}:`, error);
      }
    });

    socket.on('disconnect', () => {
      logger.info('WebSocket disconnected:', socket.id);
      
      // Usuń gracza ze wszystkich pokojów
      gameRooms.forEach((room, gameId) => {
        if (room.players.has(socket.id)) {
          room.players.delete(socket.id);
          // Powiadom pozostałych graczy o rozłączeniu
          try {
            phpApiService.disconnectFromGame(gameId).then(() => {
              updateAndBroadcastGameState(gameId);
            });
          } catch (error) {
            logger.error(`Error handling disconnect for game ${gameId}:`, error);
          }
          
          // Usuń pokój jeśli jest pusty
          if (room.players.size === 0) {
            gameRooms.delete(gameId);
          }
        }
      });
    });
  });
  
  // Polling co 3 sekundy aby sprawdzić aktualizacje stanu gry
  setInterval(() => {
    gameRooms.forEach(async (room, gameId) => {
      try {
        await updateAndBroadcastGameState(gameId);
      } catch (error) {
        logger.error(`Error in game state polling for game ${gameId}:`, error);
      }
    });
  }, 3000);
}

module.exports = {
  setupSocket,
  updateAndBroadcastGameState
};