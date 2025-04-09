/**
 * Serwis obsługujący komunikację z API
 */

const API_BASE_URL = 'http://localhost:8083/connect4/php/GameEvents';

export class ApiService {
  /**
   * Wysyła żądanie POST do API
   * @param endpoint Endpoint API
   * @param body Treść żądania
   * @returns Promise z odpowiedzią API
   */
  private static async post<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        console.error(`Błąd API: ${data.errorMessage}`);
        throw new Error(data.errorMessage || 'Nieznany błąd API');
      }

      const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;

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
  public static startNewGame(): Promise<{ unique_game_id: string }> {
    return this.post<{ unique_game_id: string }>('game-start.php');
  }

  /**
   * Dołącza do istniejącej gry
   * @param gameId ID gry do dołączenia
   * @returns Promise z odpowiedzią API
   */
  public static joinGame(gameId: string): Promise<any> {
    return this.post('join-game.php', { gameId });
  }
}

export default ApiService;