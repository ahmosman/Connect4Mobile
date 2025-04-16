# WebSocket Proxy Server

This project is a WebSocket proxy server that connects WebSocket clients to a PHP backend. It facilitates real-time communication between clients and the server, allowing for efficient data exchange.

## Project Structure

```
websocket-proxy
├── src
│   ├── app.js               # Entry point of the application
│   ├── config
│   │   └── index.js         # Configuration settings
│   ├── services
│   │   ├── socketService.js  # WebSocket connection handling
│   │   └── phpApiService.js  # PHP API interaction
│   ├── utils
│   │   ├── logger.js         # Logging utility
│   │   └── errorHandler.js    # Error handling middleware
│   └── middleware
│       └── authentication.js  # Authentication middleware
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── .gitignore                # Git ignore file
├── package.json              # NPM configuration
├── README.md                 # Project documentation
└── nodemon.json              # Nodemon configuration
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd websocket-proxy
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on the `.env.example` file and fill in the required environment variables.

## Usage

To start the server, run:
```
npm start
```

For development, you can use Nodemon to automatically restart the server on file changes:
```
npm run dev
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.