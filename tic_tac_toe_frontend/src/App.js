import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import GameBoard from "./components/GameBoard";
import Controls from "./components/Controls";
import Leaderboard from "./components/Leaderboard";
import { Api } from "./services/api";

// For a very lightweight modal
function NicknameModal({ visible, nickname, onChange, onSubmit }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.28)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 24px 0 rgba(27, 40, 60, 0.11)",
          minWidth: 280,
          minHeight: 120,
        }}
      >
        <h2 style={{ marginTop: 0, color: "var(--primary)" }}>Enter your nickname</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            autoFocus
            style={{
              width: "80%",
              fontSize: 18,
              padding: "9px 15px",
              borderRadius: 9,
              border: "1.4px solid var(--primary)",
              margin: "12px 0 20px 0",
              outline: "none",
            }}
            maxLength={20}
            placeholder="Nickname (e.g. Player123)"
            value={nickname}
            onChange={e => onChange(e.target.value)}
            required
          />
          <div style={{ textAlign: "right" }}>
            <button
              type="submit"
              className="btn"
              style={{
                minWidth: 92,
                background: "var(--button-bg)",
                color: "var(--button-text)",
              }}
            >
              Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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

  // Nickname session logic
  const [nickname, setNickname] = useState(""); // value entered by user
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // On mount: load nickname from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem("nickname");
    if (stored && typeof stored === "string" && stored.trim()) {
      setNickname(stored.trim());
    } else {
      setShowNicknameModal(true);
    }
  }, []);

  // Show modal if cleared out
  useEffect(() => {
    if (!nickname) setShowNicknameModal(true);
  }, [nickname]);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch leaderboard on mount or after game ends, supplies nickname
  useEffect(() => {
    fetchLeaderboardWithNick();
    // eslint-disable-next-line
  }, [nickname]);

  const fetchLeaderboardWithNick = async () => {
    try {
      const data = await Api.getLeaderboard({ nickname });
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      setLeaderboard([]);
    }
  };

  // Helpers
  // (old fetchLeaderboard is now integrated in above and not called directly)

  // Start new game
  const handleStartGame = useCallback(async () => {
    setStatus("Starting game...");
    try {
      const resp = await Api.startGame({ nickname });
      setBoard(resp.board || emptyBoard);
      setGameStarted(true);
      setCurrentPlayer(resp.current_player || "");
      setGameId(resp.game_id || null);
      setStatus("Game started! Your turn.");
    } catch (err) {
      setStatus("Failed to start game.");
    }
  }, [nickname, emptyBoard]);

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
        nickname,
      });
      setBoard(resp.board || board);
      setCurrentPlayer(resp.current_player || "");
      if (resp.status && resp.is_game_over) {
        setStatus(resp.status);
        setGameStarted(false);
        fetchLeaderboardWithNick();
      } else if (resp.status) {
        setStatus(resp.status);
      }
    } catch (err) {
      setStatus("Move failed. Try again.");
    }
  };

  // Nickname modal submit logic
  const handleModalSubmit = () => {
    const trimmed = (nickname || "").trim();
    if (!trimmed) return;
    setNickname(trimmed);
    window.localStorage.setItem("nickname", trimmed);
    setShowNicknameModal(false);
  };

  // Allow user to edit nickname (click to change)
  const handleEditNickname = () => {
    setShowNicknameModal(true);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <NicknameModal
        visible={showNicknameModal}
        nickname={nickname}
        onChange={setNickname}
        onSubmit={handleModalSubmit}
      />
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1>Tic Tac Toe</h1>

        {/* Display nickname w/ edit option */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "6px 0 0 0",
            justifyContent: "center",
          }}
        >
          {nickname && (
            <span
              aria-label="Player nickname"
              style={{
                color: "var(--accent)",
                fontWeight: 700,
                fontSize: "1.1em",
                background: "#fff3e1",
                borderRadius: 10,
                padding: "5px 16px",
                border: "1.2px solid var(--accent)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🧑 Player: <span style={{marginRight:5}}>{nickname}</span>
              <button
                style={{
                  border: "none",
                  background: "none",
                  color: "var(--primary)",
                  marginLeft: 2,
                  fontSize: 17,
                  cursor: "pointer",
                  outline: "none"
                }}
                aria-label="Edit nickname"
                title="Edit nickname"
                onClick={handleEditNickname}
              >
                ✎
              </button>
            </span>
          )}
        </div>

        <Controls onStartGame={handleStartGame} onReset={handleResetBoard} isGameStarted={gameStarted} />

        <div
          className="main-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "48px",
            margin: "2em 0",
          }}
        >
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            currentPlayer={currentPlayer}
            status={status}
          />
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
