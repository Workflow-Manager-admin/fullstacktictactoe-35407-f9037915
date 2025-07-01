import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Controls from "./components/Controls";
import Leaderboard from "./components/Leaderboard";
import { Api } from "./services/api";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Game and UI state
  const emptyBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const [board, setBoard] = useState(emptyBoard);
  const [gameId, setGameId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [status, setStatus] = useState("Welcome to Tic Tac Toe!");
  const [gameStarted, setGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch leaderboard on mount or after game ends
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Helpers
  const fetchLeaderboard = async () => {
    try {
      const data = await Api.getLeaderboard();
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      setLeaderboard([]);
    }
  };

  // Start new game
  const handleStartGame = useCallback(async () => {
    setStatus("Starting game...");
    try {
      const resp = await Api.startGame({});
      setBoard(resp.board || emptyBoard);
      setGameStarted(true);
      setCurrentPlayer(resp.current_player || "");
      setGameId(resp.game_id || null);
      setStatus("Game started! Your turn.");
    } catch (err) {
      setStatus("Failed to start game.");
    }
  }, []);

  // Reset current game (locally)
  const handleResetBoard = () => {
    setBoard(emptyBoard);
    setStatus("Board reset. Start a new game!");
    setCurrentPlayer("");
    setGameStarted(false);
    setGameId(null);
  };

  // Make move
  const handleCellClick = async (row, col) => {
    if (!gameStarted || !gameId) return;
    setStatus("Making move...");
    try {
      const resp = await Api.makeMove({
        game_id: gameId,
        row,
        col,
      });
      setBoard(resp.board || board);
      setCurrentPlayer(resp.current_player || "");
      if (resp.status && resp.is_game_over) {
        setStatus(resp.status);
        setGameStarted(false);
        fetchLeaderboard();
      } else if (resp.status) {
        setStatus(resp.status);
      }
    } catch (err) {
      setStatus("Move failed. Try again.");
    }
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1>Tic Tac Toe</h1>
        <Controls onStartGame={handleStartGame} onReset={handleResetBoard} isGameStarted={gameStarted} />
        <div className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "48px", margin: "2em 0" }}>
          <GameBoard board={board} onCellClick={handleCellClick} currentPlayer={currentPlayer} status={status} />
          <Leaderboard data={leaderboard} />
        </div>
        <footer style={{ marginTop: "2em", fontSize: "0.9em", color: "var(--text-secondary)" }}>
          <span>Current theme: <strong>{theme}</strong></span>
        </footer>
      </header>
    </div>
  );
}

export default App;
