# Connect4 Mobile
This is a mobile application for the classic game Connect4, built using [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/). The app allows users to play Connect4 against each other.

## How to play

### Create a new game
1. Click the "New game" button
2. Enter your nickname, choose your ball color and opponent's ball color
3. Share the generated game ID with your opponent and wait for them to join!

### Join an existing game
1. Click the "Join game" button
2. Enter the game ID received from your opponent
3. Enter your nickname, choose your ball color and opponent's ball color
4. Confirm your information and start playing!


## Get started
1. Setup API server: [Connect4 API Server](https://github.com/ahmosman/connect4/tree/api-websocket)

1. In .env file, set SOCKET_URL and API_BASE_URL as in .env.example

1. Install dependencies

   ```bash
   npm install
   ```

1. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.