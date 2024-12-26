import React from "react";
import "../styles/UserStats.css";

const formatDate = (date) => {
  const options = { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const UserStats = ({ stats, mystats }) => {
  // Handle cases where mystats or stats might be undefined/null
  const { picks = [] } = stats || {};
  const rank = mystats?.rank || "N/A";
  const score = mystats?.score || "N/A";
  const conversion = mystats?.conversionRate || "N/A";
  const available = mystats?.pointsAvailable || "N/A";

  const renderGameTable = () => {
    return (
      <table className="user-stats-table">
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Kickoff</th>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Your Pick</th>
            <th>Points Wagered</th>
            <th>Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((pick, index) => (
            <tr key={pick._id} className={index % 2 === 0 ? "even-row" : "odd-row"}>
              <td>{pick.gameName}</td>
              <td>{formatDate(pick.kickoff)}</td>
              <td>{pick.team1}</td>
              <td>{pick.team2}</td>
              <td>{pick.userPick}</td>
              <td className="centered">{pick.pointsWagered}</td>
              <td className="centered">{pick.pointsEarned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="user-stats-component">
      <div className="user-stats-header">
        <div className="stats-box rank-box">
          <h3>{rank}</h3>
          <span>Rank</span>
        </div>
        <div className="stats-box score-box">
          <h3>{score}</h3>
          <span>Score</span>
        </div>
        <div className="stats-box conversion-box">
          <h3>{conversion}</h3>
          <span>Conversion Rate</span>
        </div>
        <div className="stats-box available-box">
          <h3>{available}</h3>
          <span>Available</span>
        </div>
      </div>
      <div className="user-picks-section">
        <h4 className="picks-heading">Your Picks</h4>
        {picks.length > 0 ? renderGameTable() : <p className="no-picks-message">No picks available.</p>}
      </div>
    </div>
  );
};

export default UserStats;
