import React from "react";

// PUBLIC_INTERFACE
function Controls({ onStartGame, onReset, isGameStarted }) {
  /**
   * Renders control buttons for the game.
   * Props:
   *   - onStartGame: function
   *   - onReset: function
   *   - isGameStarted: boolean
   */
  return (
    <div className="controls">
      <button onClick={onStartGame} className="btn btn-large" disabled={isGameStarted}>
        New Game
      </button>
      <button onClick={onReset} className="btn" disabled={!isGameStarted}>
        Reset Board
      </button>
    </div>
  );
}

export default Controls;
