import React, { useState, useEffect } from "react";
import "../styles/UserStats.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing chevron icons

const formatDate = (date) => {
  const options = { month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

const UserStats = ({ stats, mystats }) => {
  const { picks = [] } = stats || {};
  const rank = mystats?.rank || "N/A";
  const score = mystats?.score || "N/A";
  const conversion = mystats?.conversionRate || "N/A";
  const available = mystats?.pointsAvailable || "N/A";

  const [expandedRow, setExpandedRow] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600); // Detect mobile view

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRowClick = (index) => {
    // Enable expand/collapse only on mobile
    if (isMobile) {
      setExpandedRow(expandedRow === index ? null : index);
    }
  };

  const getCellClass = (userPick, winner) => {
    if (userPick === winner) return "green-highlight";
    if (userPick !== winner && winner !== "TBD") return "strikethrough";
    return "";
  };

  const getRowClass = (winner) => {
    if (winner === "TBD") return "gray-italic";
    return "";
  };

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
            <th>Winner</th>
            <th>Points Wagered</th>
            <th>Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((pick, index) => (
            <React.Fragment key={pick._id}>
              {/* Normal row on desktop */}
              {!isMobile && (
                <tr className={`${index % 2 === 0 ? "even-row" : "odd-row"} ${getRowClass(pick.winner)}`}>
                  <td>{pick.gameName}</td>
                  <td>{formatDate(pick.kickoff)}</td>
                  <td>{pick.team1}</td>
                  <td>{pick.team2}</td>
                  <td className={getCellClass(pick.userPick, pick.winner)}>{pick.userPick}</td>
                  <td>{pick.winner}</td>
                  <td className="centered">{pick.pointsWagered}</td>
                  <td className="centered">{pick.pointsEarned}</td>
                </tr>
              )}

              {/* Expandable row on mobile */}
              {isMobile && (
                <>
                  <tr
                    onClick={() => handleRowClick(index)}
                    className={`${index % 2 === 0 ? "even-row" : "odd-row"} ${getRowClass(pick.winner)}`}
                  >
                    <td>
                      <span className="expand-icon">
                        {expandedRow === index ? <FaChevronUp /> : <FaChevronDown />}
                      </span>
                      {pick.gameName}
                    </td>
                    <td>{formatDate(pick.kickoff)}</td>
                    <td>{pick.team1}</td>
                    <td>{pick.team2}</td>
                    <td className={getCellClass(pick.userPick, pick.winner)}>{pick.userPick}</td>
                    <td>{pick.winner}</td>
                    <td className="centered">{pick.pointsWagered}</td>
                    <td className="centered">{pick.pointsEarned}</td>
                  </tr>

                  {/* Expanded content */}
                  {expandedRow === index && (
                    <tr className="expanded-row">
                      <td colSpan="8">
                        <div className="expanded-content">
                          <div className="team-info">{pick.team1} vs {pick.team2}</div>
                          <div className="date-info">{formatDate(pick.kickoff)}</div>
                          <div className="table-divider"></div>
                          <div> <span className="bold-label">Points Wagered: </span>{pick.pointsWagered}</div>
                          <div> <span className="bold-label">Points Earned: </span>{pick.pointsEarned}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </React.Fragment>
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
        <h4 className="picks-heading">My Picks</h4>
        {picks.length > 0 ? renderGameTable() : <p className="no-picks-message">No picks available.</p>}
      </div>
    </div>
  );
};

export default UserStats;
