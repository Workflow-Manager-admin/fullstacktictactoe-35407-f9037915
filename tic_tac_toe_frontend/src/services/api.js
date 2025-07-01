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
  async startGame(payload = {}) {
    /** Starts a new game session, expects and always sends nickname. */
    let nickname = payload.nickname;
    if (!nickname) {
      nickname = window.localStorage.getItem("nickname") || "Anonymous";
    }
    return request("/start_game", {
      method: "POST",
      body: JSON.stringify({ ...payload, nickname }),
    });
  },

  // Make a player move
  async makeMove(payload = {}) {
    /** Makes a move, always includes nickname. */
    let nickname = payload.nickname;
    if (!nickname) {
      nickname = window.localStorage.getItem("nickname") || "Anonymous";
    }
    return request("/make_move", {
      method: "POST",
      body: JSON.stringify({ ...payload, nickname }),
    });
  },

  // Get the current state of the game
  async getGameState(params = "", nicknameArg = null) {
    /** Gets the current game state. Optionally includes nickname. */
    let nickname = nicknameArg || window.localStorage.getItem("nickname");
    let query = params ? `?${params}` : "";
    if (nickname) {
      query += (query ? "&" : "?") + `nickname=${encodeURIComponent(nickname)}`;
    }
    return request(`/game_state${query}`);
  },

  // Get the leaderboard data
  async getLeaderboard({ nickname } = {}) {
    /** Gets the leaderboard, optionally filtered by nickname. */
    // Usually leaderboard is global, but for player-centric, can provide a filter param
    nickname = nickname || window.localStorage.getItem("nickname") || undefined;
    let query = "";
    if (nickname) {
      query = `?nickname=${encodeURIComponent(nickname)}`;
    }
    return request(`/leaderboard${query}`);
  },
};
