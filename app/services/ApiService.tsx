const API_BASE_URL = 'http://localhost:8083/connect4/php/GameEvents';

export class ApiService {
  private static sessionCookie: string | null = null;
  private static xdebugCookie: string | null = null;

  /**
   * Wysyła żądanie POST do API
   */
  private static async post<T>(endpoint: string, body?: Record<string, any>): Promise<T> {
    try {
      // Konwersja danych do formatu FormData
      const formData = new FormData();
      if (body) {
        Object.keys(body).forEach(key => {
          if (typeof body[key] === 'object' && body[key] !== null) {
            formData.append(key, JSON.stringify(body[key]));
          } else {
            formData.append(key, body[key]);
          }
        });
      }

      console.log(`Wysyłanie do API (${endpoint}):`, body);

      // Dodajemy nagłówki
      const headers: HeadersInit = {};
      const cookies: string[] = [];

      // Dodanie ciasteczka sesji i XDEBUG
      if (this.sessionCookie) cookies.push(this.sessionCookie);
      if (this.xdebugCookie) {
        cookies.push(this.xdebugCookie);
        // Dodanie XDEBUG jako parametr URL
        const xdebugValue = this.xdebugCookie.split('=')[1];
        endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}XDEBUG_SESSION=${xdebugValue}`;
      }

      if (cookies.length > 0) {
        headers['Cookie'] = cookies.join('; ');
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      });

      // Obsługa ciasteczka sesji
      const setCookie = response.headers.get('Set-Cookie');
      if (setCookie) {
        this.sessionCookie = setCookie;
        console.log('Otrzymano ciasteczko sesji:', setCookie);
      }

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.errorMessage || 'Nieznany błąd API');
      }

      return typeof data.content === 'string' && data.content
        ? JSON.parse(data.content)
        : data.content || {};
    } catch (error) {
      console.error(`Błąd API (${endpoint}):`, error);
      throw error;
    }
  }

  // Metody publiczne
  public static setXdebugCookie(value: string = 'PHPSTORM') {
    this.xdebugCookie = `XDEBUG_SESSION=${value}`;
  }

  public static clearXdebugCookie() {
    this.xdebugCookie = null;
  }

  public static async startNewGame(): Promise<{ unique_game_id: string }> {
    this.sessionCookie = null; // Reset sesji
    return this.post<{ unique_game_id: string }>('game-start.php');
  }

  public static joinGame(gameId: string): Promise<any> {
    return this.post('game-join.php', { unique_game_id: gameId });
  }

  public static getGameState(): Promise<GameState> {
    return this.post<GameState>('game-state.php');
  }

  public static makeMove(column: number): Promise<GameState> {
    return this.post<GameState>('game-put-ball.php', { column });
  }

  public static confirmGame(): Promise<any> {
    return this.post('game-confirm.php');
  }

  public static setupPlayer(
    nickname: string,
    playerColor: string,
    opponentColor: string
  ): Promise<any> {
    return this.post('game-player-setup.php', {
      nickname,
      player_color: playerColor,
      opponent_color: opponentColor
    });
  }
}

export default ApiService;

// Interfejsy dla danych gry
export interface GameState {
  board: number[][];
  width: number;
  height: number;
  isPlayerTurn: boolean;
  playerStatus: PlayerStatus;
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

export type PlayerStatus = 'NONE' | 'WAITING' | 'CONFIRMING' | 'READY' | 'PLAYER_MOVE' | 'OPPONENT_MOVE' | 'WIN' | 'LOSE' | 'DRAW' | 'REVENGE';