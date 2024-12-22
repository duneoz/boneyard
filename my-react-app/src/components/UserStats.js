import React, { useState, useEffect } from "react";
import axios from "axios";

const UserStats = ({ currentUserId }) => {
  const [rank, setRank] = useState("Loading...");
  const [score, setScore] = useState("Loading...");
  const [userPicks, setUserPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStats = async () => {
        try {
          setLoading(true);
          const response = await axios.get(
            `http://localhost:5000/api/picks/user/${currentUserId}/picks-and-stats`
          );
      
          const { rank, score, picks } = response.data;
          setRank(rank || "N/A");
          setScore(score || 0);
          setUserPicks(picks || []);
        } catch (err) {
          console.error("Error fetching user stats:", err);
          setError("Failed to load user stats. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      

    if (currentUserId) {
      fetchUserStats();
    }
  }, [currentUserId]);

  const renderGameTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>Game Name</th>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Your Pick</th>
            <th>Points Wagered</th>
            <th>Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {userPicks.map((pick) => (
            <tr key={pick._id}>
              <td>{pick.gameName}</td>
              <td>{pick.team1}</td>
              <td>{pick.team2}</td>
              <td>{pick.userPick}</td>
              <td>{pick.pointsWagered}</td>
              <td>{pick.pointsEarned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  if (loading) {
    return <p>Loading user stats...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div>
        <h3>Rank: {rank}</h3>
        <h3>Score: {score}</h3>
      </div>
      <div>
        <h4>Your Game Picks</h4>
        {userPicks.length > 0 ? renderGameTable() : <p>No picks available.</p>}
      </div>
    </div>
  );
};

export default UserStats;
