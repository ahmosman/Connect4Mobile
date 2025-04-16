const config = {
    PORT: process.env.PORT || 3000,
    PHP_API_URL: process.env.PHP_API_URL || 'http://localhost:8083/connect4/php/GameEvents',
    SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:8083',
};

module.exports = config;