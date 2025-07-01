//
// API service layer for HTTP calls to backend
//

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

// Helper to handle JSON and errors
async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (err) {
    // Optionally, catch/log errors globally here
    throw err;
  }
}

// PUBLIC_INTERFACE
export const Api = {
  // Start a new game session
  async startGame(payload) {
    /** Starts a new game session. */
    return request("/start_game", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Make a player move
  async makeMove(payload) {
    /** Makes a move. */
    return request("/make_move", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Get the current state of the game
  async getGameState(params = "") {
    /** Gets the current game state. */
    // params can be a query string
    return request(`/game_state${params ? `?${params}` : ""}`);
  },

  // Get the leaderboard data
  async getLeaderboard() {
    /** Gets the leaderboard. */
    return request("/leaderboard");
  },
};
