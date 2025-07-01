import React from "react";

// PUBLIC_INTERFACE
function Leaderboard({ data }) {
  /**
   * Renders the leaderboard.
   * Props:
   *   - data: array of { name, wins, games }
   */
  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Wins</th>
            <th>Games</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>
                <td>{row.wins}</td>
                <td>{row.games}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
