const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { setupSocket } = require('./services/socketService');
const config = require('./config');
const logger = require('./utils/logger');
const errorHandler = require('./utils/errorHandler');

// Inicjalizacja aplikacji
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Konfiguracja Socket.io
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

setupSocket(io);

// Podstawowy endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Connect4 WebSocket Proxy Server' });
});

// Obsługa błędów
app.use(errorHandler);

// Uruchomienie serwera
const PORT = config.PORT || 3000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Obsługa zakończenia
process.on('SIGINT', () => {
    logger.info('Server shutting down');
    server.close(() => {
        process.exit(0);
    });
});