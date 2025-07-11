# Connect4 Mobile
![Alt text](https://img.shields.io/badge/release%20date-may%202025-e84de5)

This is a mobile application for the classic game Connect4, built using [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/). The app allows users to play Connect4 against each other.

---

## 📸 Screenshots

<p align="center">
  <img src="screens/Screenshot_Connect4Mobile_1.jpg" alt="Connect4Mobile Screenshot 1" width="150"/>
  <img src="screens/Screenshot_Connect4Mobile_2.jpg" alt="Connect4Mobile Screenshot 2" width="200"/>
  <img src="screens/Screenshot_Connect4Mobile_3.jpg" alt="Connect4Mobile Screenshot 3" width="200"/>
</p>
<p align="center">
  <img src="screens/Screenshot_Connect4Mobile_4.jpg" alt="Connect4Mobile Screenshot 4" width="150"/>
  <img src="screens/Screenshot_Connect4Mobile_5.jpg" alt="Connect4Mobile Screenshot 5" width="200"/>
  <img src="screens/Screenshot_Connect4Mobile_6.jpg" alt="Connect4Mobile Screenshot 6" width="200"/>
</p>
<p align="center">
  <img src="screens/Screenshot_Connect4Mobile_7.jpg" alt="Connect4Mobile Screenshot 7" width="150"/>
</p>

---

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


---

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

---

## Development build
To create a development build of the app, you can use the following command:

```bash
npx expo prebuild

# For android
npx expo run:android

# or for specific device
npx expo run:android --device


# For ios
npx expo run:ios
```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
