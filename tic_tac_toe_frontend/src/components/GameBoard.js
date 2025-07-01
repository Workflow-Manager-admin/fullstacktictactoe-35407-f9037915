import React from "react";

/**
 * Utility: Discover if a status text indicates game over.
 * Returns { isOver: boolean, type: "win"|"draw"|"lose"|null }
 */
function parseGameOverStatus(status) {
  const msg = (status || "").toLowerCase();
  if (msg.includes("win")) return { isOver: true, type: "win" };
  if (msg.includes("draw") || msg.includes("tie")) return { isOver: true, type: "draw" };
  if (msg.includes("lose")) return { isOver: true, type: "lose" };
  if (msg.includes("game over")) return { isOver: true, type: "draw" };
  return { isOver: false, type: null };
}

// PUBLIC_INTERFACE
function GameBoard({ board, onCellClick, currentPlayer, status }) {
  /**
   * Full-featured tic tac toe gameboard with outcome + error highlighting.
   * Props:
   *   - board: 2D array [["", "", ""], ...]
   *   - onCellClick: (rowIdx, colIdx) => void
   *   - currentPlayer: string
   *   - status: message string (may be 'win', 'draw', errors, etc)
   */
  const { isOver, type } = parseGameOverStatus(status);

  // Board rendering helpers:
  const isCellFilled = (val) => val !== "";

  return (
    <div className="game-board">
      <div
        className={
          "status" +
          (type === "win"
            ? " status-win"
            : type === "lose"
            ? " status-lose"
            : type === "draw"
            ? " status-draw"
            : status?.toLowerCase().includes("fail") || status?.toLowerCase().includes("error")
            ? " status-error"
            : "")
        }
        aria-live="polite"
      >
        {status}
      </div>
      <div className="board" style={{ margin: "1em auto" }}>
        {board.map((row, rowIdx) => (
          <div className="board-row" key={rowIdx} style={{ display: "flex" }}>
            {row.map((cell, colIdx) => (
              <button
                key={colIdx}
                className={
                  "cell" +
                  (isOver && cell
                    ? type === "win"
                      ? " cell-win"
                      : type === "draw"
                      ? " cell-draw"
                      : ""
                    : "")
                }
                style={{
                  width: 56,
                  height: 56,
                  fontSize: "2rem",
                  margin: "4px",
                  background: cell
                    ? cell === "X"
                      ? "var(--text-secondary)"
                      : cell === "O"
                      ? "#ffc107"
                      : "var(--bg-secondary)"
                    : "var(--bg-secondary)",
                  color: cell === "X" ? "#1A1A1A" : "#1976d2",
                  border: "2px solid var(--border-color)",
                  borderRadius: 8,
                  cursor:
                    !isCellFilled(cell) && !isOver
                      ? "pointer"
                      : "not-allowed",
                  opacity: isOver && !isCellFilled(cell) ? 0.6 : 1,
                }}
                onClick={() => {
                  if (!isCellFilled(cell) && !isOver) {
                    onCellClick(rowIdx, colIdx);
                  }
                }}
                disabled={isOver || isCellFilled(cell)}
                aria-label={`Cell ${rowIdx},${colIdx}: ${cell || "empty"}`}
                data-testid={`cell-${rowIdx}-${colIdx}`}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="current-player" style={{ margin: "0.5em" }}>
        {isOver ? (
          <b>Game Over</b>
        ) : (
          <>
            Turn:{" "}
            <b style={{ color: "var(--text-secondary)" }}>
              {currentPlayer || "?"}
            </b>
          </>
        )}
      </div>
    </div>
  );
}

export default GameBoard;
