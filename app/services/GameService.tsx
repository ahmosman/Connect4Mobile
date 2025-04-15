import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://192.168.1.10:8083/connect4/php/GameEvents';
const SOCKET_URL = 'http://192.168.1.10:8083'; // Adjust this to your WebSocket server URL

export class GameService {
  private static sessionCookie: string | null = null;
  private static xdebugCookie: string | null = null;
  private static socket: Socket | null = null;
  private static gameStateListeners: Array<(gameState: GameState) => void> = [];

  // Initialize WebSocket connection
  public static initializeSocket() {
    if (this.socket) {
      console.log('Socket already initialized');
      return;
    }

    console.log('Initializing socket connection...');
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for game state updates
    this.socket.on('gameStateUpdate', (data) => {
      console.log('Received game state update:', data);
      const gameState: GameState = typeof data.content === 'string'
        ? JSON.parse(data.content)
        : data.content;

      // Notify all listeners
      this.gameStateListeners.forEach(listener => listener(gameState));
    });
  }

  // Subscribe to game state updates
  public static subscribeToGameState(listener: (gameState: GameState) => void): () => void {
    this.gameStateListeners.push(listener);

    // Return unsubscribe function
    return () => {
      this.gameStateListeners = this.gameStateListeners.filter(l => l !== listener);
    };
  }

  // Clean up WebSocket connection
  public static cleanUp() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.gameStateListeners = [];
  }

  // HTTP Requests for actions that require immediate server response
  private static async request<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    body?: Record<string, any>
  ): Promise<T> {
    const headers: HeadersInit = {};
    const cookies: string[] = [];

    // Add session and XDEBUG cookies
    if (this.sessionCookie) cookies.push(this.sessionCookie);
    if (this.xdebugCookie) {
      cookies.push(this.xdebugCookie);
      const xdebugValue = this.xdebugCookie.split('=')[1];
      endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}XDEBUG_SESSION=${xdebugValue}`;
    }

    if (cookies.length > 0) headers['Cookie'] = cookies.join('; ');

    let url = `${API_BASE_URL}/${endpoint}`;
    const requestOptions: RequestInit = { method, headers, credentials: 'include' };

    // Handle GET parameters
    if (method === 'GET' && body) {
      const params = new URLSearchParams();
      Object.entries(body).forEach(([key, value]) =>
        params.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
      );
      url += `${url.includes('?') ? '&' : '?'}${params.toString()}`;
    }

    // Handle POST body
    if (method === 'POST' && body) {
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) =>
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
      );
      requestOptions.body = formData;
    }

    console.log(`Sending ${method} request to ${url}`, body);

    const response = await fetch(url, requestOptions);

    // Handle session cookie
    const setCookie = response.headers.get('Set-Cookie');
    if (setCookie) this.sessionCookie = setCookie;

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    if (!data.success) throw new Error(data.errorMessage || 'Unknown API error');

    if (!data.content) {
      throw new Error('API response does not contain content');
    }

    return typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
  }

  private static post<T>(endpoint: string, body?: Record<string, any>): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  private static get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', endpoint, params);
  }

  // Action methods - now emit events via socket when appropriate
  public static setXdebugCookie(value: string = 'PHPSTORM') {
    this.xdebugCookie = `XDEBUG_SESSION=${value}`;
  }

  public static clearXdebugCookie() {
    this.xdebugCookie = null;
  }

  public static async startNewGame(): Promise<{ unique_game_id: string }> {
    this.sessionCookie = null; // Reset session

    // Initialize socket if not already done
    if (!this.socket) {
      this.initializeSocket();
    }

    // Make HTTP request to start game, server will emit updates via socket
    const result = await this.post<{ unique_game_id: string }>('game-start.php');

    // Join socket room for this game
    this.socket?.emit('joinGame', { gameId: result.unique_game_id });

    return result;
  }

  public static async joinGame(gameId: string): Promise<any> {
    // Initialize socket if not already done
    if (!this.socket) {
      this.initializeSocket();
    }

    const result = await this.post('game-join.php', { unique_game_id: gameId });

    // Join socket room for this game
    this.socket?.emit('joinGame', { gameId });

    return result;
  }

  public static getGameState(): Promise<GameState> {
    // We'll keep this method for initial state loading
    return this.get('game-state.php');
  }

  public static makeMove(column: number): Promise<GameState> {
    // Emit event and make API call
    this.socket?.emit('makeMove', { column });
    return this.post('game-put-ball.php', { column });
  }

  public static confirmGame(): Promise<any> {
    this.socket?.emit('confirmGame');
    return this.post('game-confirm.php');
  }

  public static requestRevenge(): Promise<any> {
    this.socket?.emit('requestRevenge');
    return this.post('game-revenge.php');
  }

  public static disconnectFromGame(): Promise<any> {
    this.socket?.emit('leaveGame');
    return this.post('game-disconnect.php');
  }

  public static setupPlayer(
    nickname: string,
    playerColor: string,
    opponentColor: string
  ): Promise<any> {
    return this.post('game-player-setup.php', {
      nickname,
      player_color: playerColor,
      opponent_color: opponentColor,
    });
  }
}

export default GameService;

// Interfaces for game data
export interface GameState {
  board: number[][];
  width: number;
  height: number;
  isPlayerTurn: boolean;
  playerStatus: PlayerStatus;
  opponentStatus: PlayerStatus;
  gameInfo: string;
  playerNickname: string;
  playerWins: number;
  playerColor: string;
  opponentNickname: string;
  opponentWins: number;
  opponentColor: string;
  lastPutBall: [number, number] | null;
  winningBalls: Array<[number, number]>;
  gameId: string;
}

export type PlayerStatus =
  | 'NONE'
  | 'WAITING'
  | 'CONFIRMING'
  | 'READY'
  | 'PLAYER_MOVE'
  | 'OPPONENT_MOVE'
  | 'WIN'
  | 'LOSE'
  | 'DRAW'
  | 'REVENGE'
  | 'DISCONNECTED';