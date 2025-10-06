import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [expandedRow, setExpandedRow] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard
        const leaderboardResp = await axios.get(`${API_BASE_URL}/api/userstats/leaderboard`);
        setLeaderboardData(leaderboardResp.data);
        setFilteredData(leaderboardResp.data);

        // Fetch user's leagues
        const token = localStorage.getItem("authToken");
        const leaguesResp = await axios.get(`${API_BASE_URL}/api/leagues/my-leagues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeagues(leaguesResp.data);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch leaderboard or leagues.");
        setLoading(false);
      }
    };

    fetchData();

    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [API_BASE_URL]);

  const handleRowClick = (index) => {
    if (isMobile) setExpandedRow(expandedRow === index ? null : index);
  };

  // ----------------------
  // League filtering
  // ----------------------
  const handleLeagueSelect = (league) => {
  setSelectedLeague(league);

  if (!league) {
    setFilteredData(leaderboardData);
    return;
  }

  // Get all userIds in the selected league
  const leagueMemberIds = league.members.map((m) => m._id.toString());

  // Filter the full leaderboard to only members in this league
  const filtered = leaderboardData
    .filter((user) => leagueMemberIds.includes(user.userId))
    .map((user, index) => ({
      ...user,
      leagueRank: index + 1, // dynamic league rank
    }));

  setFilteredData(filtered);
};


  if (loading) return <div className="leaderboard-loading">Loading...</div>;
  if (error) return <div className="leaderboard-error">{error}</div>;

  return (
    <div className="leaderboard-container">
      {/* League Filter Buttons */}
      {/* League Filter Buttons */}
      <div className="league-buttons">
        <button
          className={`league-btn ${!selectedLeague ? "active" : ""}`}
          onClick={() => handleLeagueSelect(null)}
        >
          Overall
        </button>

        {leagues.map((league) => (
          <button
            key={league._id}
            className={`league-btn ${selectedLeague?._id === league._id ? "active" : ""}`}
            onClick={() => handleLeagueSelect(league)}
          >
            {league.name}
          </button>
        ))}
      </div>


      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            {!isMobile && <th>Points Wagered</th>}
            {!isMobile && <th>Conversion Rate</th>}
            {!isMobile && <th>Points Available</th>}
            {selectedLeague && <th>League Rank</th>}
            <th>Potential Score</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user, index) => (
            <React.Fragment key={user.userId}>
              <tr
                className={`leaderboard-row ${expandedRow === index ? "expanded" : ""}`}
                onClick={() => handleRowClick(index)}
              >
                <td>
                  <span className="expand-icon">
                    {isMobile && (expandedRow === index ? <FaChevronUp /> : <FaChevronDown />)}
                  </span>
                  {user.rank ?? "-"}
                </td>
                <td>{user.username}</td>
                <td>{user.score}</td>
                {!isMobile && <td>{user.pointsWagered}</td>}
                {!isMobile && <td>{user.conversionRate}</td>}
                {!isMobile && <td>{user.pointsAvailable}</td>}
                {selectedLeague && <td>{user.leagueRank}</td>}
                <td>{user.score + user.pointsAvailable}</td>
              </tr>

              {isMobile && expandedRow === index && (
                <tr className="expanded-row">
                  <td colSpan={selectedLeague ? 7 : 6}>
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
                      {selectedLeague && (
                        <p>
                          <span className="bold-label">League Rank: </span>
                          {user.leagueRank}
                        </p>
                      )}
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

