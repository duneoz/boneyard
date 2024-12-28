import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing chevron icons
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get("https://bowl-bash-148f8ac7cdb4.herokuapp.com/api/userstats/leaderboard"); // Replace with your backend route
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
        setLoading(false);
      }
    };

    fetchLeaderboardData();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRowClick = (index) => {
    if (isMobile) {
      setExpandedRow(expandedRow === index ? null : index);
    }
  };

  if (loading) return <div className="leaderboard-loading">Loading...</div>;
  if (error) return <div className="leaderboard-error">{error}</div>;

  return (
    <div className="leaderboard-container">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            {!isMobile && <th>Points Wagered</th>}
            {!isMobile && <th>Conversion Rate</th>}
            {!isMobile && <th>Points Available</th>}
            <th>Potential Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <React.Fragment key={index}>
              <tr
                className={`leaderboard-row ${expandedRow === index ? "expanded" : ""}`}
                onClick={() => handleRowClick(index)}
              >
                <td>
                  <span className="expand-icon">
                    {isMobile && (expandedRow === index ? <FaChevronUp /> : <FaChevronDown />)}
                  </span>
                  {user.rank}
                </td>
                <td>{user.username}</td>
                <td>{user.score}</td>
                {!isMobile && <td>{user.pointsWagered}</td>}
                {!isMobile && <td>{user.conversionRate}</td>}
                {!isMobile && <td>{user.pointsAvailable}</td>}
                <td>{user.score + user.pointsAvailable}</td>
              </tr>
              {isMobile && expandedRow === index && (
                <tr className="expanded-row">
                  <td colSpan="6">
                    <div className="expanded-content">
                      <p>
                        <span className="bold-label">Points Wagered: </span>
                        {user.pointsWagered}
                      </p>
                      <p>
                        <span className="bold-label">Conversion Rate: </span>
                        {user.conversionRate}
                      </p>
                      <p>
                        <span className="bold-label">Points Available: </span>
                        {user.pointsAvailable}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
