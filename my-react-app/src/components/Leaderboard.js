import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/userstats/leaderboard"); // Replace with your backend route
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

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
            <th>Points Wagered</th>
            <th>Conversion Rate</th>
            <th>Points Available</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user, index) => (
            <tr key={index}>
              <td>{user.rank}</td>
              <td>{user.username}</td>
              <td>{user.score}</td>
              <td>{user.pointsWagered}</td>
              <td>{user.conversionRate}</td>
              <td>{user.pointsAvailable}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default Leaderboard;