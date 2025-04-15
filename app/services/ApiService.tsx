const API_BASE_URL = 'http://192.168.1.10:8083/connect4/php/GameEvents';

export class ApiService {
  private static sessionCookie: string | null = null;
  private static xdebugCookie: string | null = null;

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

  public static setXdebugCookie(value: string = 'PHPSTORM') {
    this.xdebugCookie = `XDEBUG_SESSION=${value}`;
  }

  public static clearXdebugCookie() {
    this.xdebugCookie = null;
  }

  public static startNewGame(): Promise<{ unique_game_id: string }> {
    this.sessionCookie = null; // Reset session
    return this.post('game-start.php');
  }

  public static joinGame(gameId: string): Promise<any> {
    return this.post('game-join.php', { unique_game_id: gameId });
  }

  public static getGameState(): Promise<GameState> {
    return this.get('game-state.php');
  }

  public static makeMove(column: number): Promise<GameState> {
    return this.post('game-put-ball.php', { column });
  }

  public static confirmGame(): Promise<any> {
    return this.post('game-confirm.php');
  }

  public static requestRevenge(): Promise<any> {
    return this.post('game-revenge.php');
  }

  public static disconnectFromGame(): Promise<any> {
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

export default ApiService;

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