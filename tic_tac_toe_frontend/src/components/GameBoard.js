import React from "react";

// PUBLIC_INTERFACE
function GameBoard({ board, onCellClick, currentPlayer, status }) {
  /** 
   * Renders the tic tac toe board. 
   * Props:
   *   - board: 2D array with cell values
   *   - onCellClick: function(rowIdx, colIdx)
   *   - currentPlayer: string (who's turn)
   *   - status: string (game status message)
   */
  return (
    <div className="game-board">
      <div className="status">{status}</div>
      <div className="board">
        {board.map((row, rowIdx) => (
          <div className="board-row" key={rowIdx}>
            {row.map((cell, colIdx) => (
              <button
                key={colIdx}
                className="cell"
                onClick={() => onCellClick(rowIdx, colIdx)}
                aria-label={`Cell ${rowIdx},${colIdx}`}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="current-player">
        Turn: <b>{currentPlayer || "?"}</b>
      </div>
    </div>
  );
}

export default GameBoard;
