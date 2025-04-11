const API_BASE_URL = 'http://localhost:8083/connect4/php/GameEvents';

export class ApiService {
  // Dodajemy pole do przechowywania ciasteczka sesji
  private static sessionCookie: string | null = null;

  /**
   * Wysyła żądanie POST do API
   * @param endpoint Endpoint API
   * @param body Treść żądania
   * @returns Promise z odpowiedzią API
   */
  private static async post<T>(endpoint: string, body?: Record<string, any>): Promise<T> {
    try {
      // Konwersja danych do formatu FormData
      const formData = new FormData();
      if (body) {
        Object.keys(body).forEach(key => {
          // Obsługa zagnieżdżonych obiektów i tablic
          if (typeof body[key] === 'object' && body[key] !== null) {
            formData.append(key, JSON.stringify(body[key]));
          } else {
            formData.append(key, body[key]);
          }
        });
      }

      console.log(`Wysyłanie do API (${endpoint}):`, body);

      // Dodajemy nagłówek z ciasteczkiem sesji, jeśli istnieje
      const headers: HeadersInit = {};
      if (this.sessionCookie) {
        headers['Cookie'] = this.sessionCookie;
      }

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include' // Ważne: pozwala na przesyłanie i odbieranie ciasteczek
      });

      // Zapisujemy ciasteczko sesji z odpowiedzi
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
        console.error(`Błąd API: ${data.errorMessage}`);
        throw new Error(data.errorMessage || 'Nieznany błąd API');
      }

      const content = typeof data.content === 'string' && data.content 
        ? JSON.parse(data.content) 
        : data.content || {};

      return content;
    } catch (error) {
      console.error(`Błąd podczas komunikacji z API (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Rozpoczyna nową grę
   * @returns Promise z odpowiedzią zawierającą unique_game_id
   */
  public static async startNewGame(): Promise<{ unique_game_id: string }> {
    // Upewnij się, że zaczynasz z nową sesją
    this.sessionCookie = null;
    return this.post<{ unique_game_id: string }>('game-start.php');
  }

  /**
   * Dołącza do istniejącej gry
   * @param gameId ID gry do dołączenia
   * @returns Promise z odpowiedzią API
   */
  public static joinGame(gameId: string): Promise<any> {
    return this.post('game-join.php', { gameId });
  }

  /**
   * Pobiera aktualny stan gry
   * @param gameId ID gry
   * @returns Promise z odpowiedzią zawierającą stan gry
   */
  public static getGameState(gameId: string): Promise<GameState> {
    return this.post<GameState>('game-state.php', { gameId });
  }

  /**
   * Wykonuje ruch (wstawia żeton do wybranej kolumny)
   * @param gameId ID gry
   * @param column Indeks kolumny (0-6)
   * @returns Promise z odpowiedzią API
   */
  public static makeMove(gameId: string, column: number): Promise<GameState> {
    return this.post<GameState>('make-move.php', { gameId, column });
  }

 /**
 * Konfiguruje ustawienia gracza
 * @param gameId ID gry
 * @param nickname Nick gracza
 * @param playerColor Kolor gracza
 * @param opponentColor Kolor przeciwnika
 * @returns Promise z odpowiedzią API
 */
  public static setupPlayer(
    gameId: string,
    nickname: string,
    playerColor: string,
    opponentColor: string
  ): Promise<any> {
    return this.post('game-player-setup.php', {
      gameId,
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
  playerNickname: string;
  playerWins: number;
  playerColor: string;
  opponentNickname: string;
  opponentWins: number;
  opponentColor: string;
  lastPutBall: [number, number] | null;
  winningBalls: Array<[number, number]>;
}

export type PlayerStatus = 'PLAYER_MOVE' | 'OPPONENT_MOVE' | 'WIN' | 'LOSE' | 'DRAW' | 'WAITING';