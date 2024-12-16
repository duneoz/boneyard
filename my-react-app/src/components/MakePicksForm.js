import React, { useState, useEffect } from 'react';
import '../styles/MakePicksForm.css';

const MakePicks = ({ onClose }) => {
  const [games, setGames] = useState([]); // All games fetched from backend
  const [userPicks, setUserPicks] = useState({}); // User's picks
  const [updatedGames, setUpdatedGames] = useState([]); // Games updated dynamically based on picks
  const [availableRatings, setAvailableRatings] = useState(Array.from({ length: 46 }, (_, i) => i + 1).reverse()); // Ratings from 1 to 46

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        const currentDate = new Date();

        // Mark games as disabled if they have already started
        const gamesWithStatus = data.map((game) => ({
          ...game,
          isLateEntry: new Date(game.date) <= currentDate, // Check if game is in the past
        }));

        setGames(gamesWithStatus);
        setUpdatedGames(gamesWithStatus);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Function to format date to mm/dd, X:XX (local timezone)
  const formatDate = (utcDate) => {
    const localDate = new Date(utcDate);
    const hour = localDate.getHours();
    const minute = localDate.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    let formattedDate = `${localDate.toLocaleDateString('en-US')}, ${adjustedHour}:${formattedMinute} ${period}`;
    formattedDate = formattedDate.replace(/^(\d{1}):/g, '$1:');
    return formattedDate;
  };

  const bracket = {
    "67591a1e86598a7078f6d30a": { nextGameId: "67591a1e86598a7078f6d324", semiFinalGameId: "67591a1e86598a7078f6d32b", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d309": { nextGameId: "67591a1e86598a7078f6d323", semiFinalGameId: "67591a1e86598a7078f6d32b", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d308": { nextGameId: "67591a1e86598a7078f6d322", semiFinalGameId: "67591a1e86598a7078f6d32a", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d307": { nextGameId: "67591a1e86598a7078f6d325", semiFinalGameId: "67591a1e86598a7078f6d32a", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },

    "67591a1e86598a7078f6d324": { nextGameId: "67591a1e86598a7078f6d32b", team: "team2" },
    "67591a1e86598a7078f6d323": { nextGameId: "67591a1e86598a7078f6d32b", team: "team1" },
    "67591a1e86598a7078f6d322": { nextGameId: "67591a1e86598a7078f6d32a", team: "team1" },
    "67591a1e86598a7078f6d325": { nextGameId: "67591a1e86598a7078f6d32a", team: "team2" },

    "67591a1e86598a7078f6d32b": { nextGameId: "67591a1e86598a7078f6d32c", team: "team2" },
    "67591a1e86598a7078f6d32a": { nextGameId: "67591a1e86598a7078f6d32c", team: "team1" }
  };

  const handlePick = (gameId, teamKey, confidence) => {
    setUserPicks((prevPicks) => {
      const updatedPicks = {
        ...prevPicks,
        [gameId]: { teamKey, confidence },
      };
      return updatedPicks;
    });

    // Remove selected confidence from availableRatings
    setAvailableRatings((prevRatings) => prevRatings.filter((rating) => rating !== confidence));

    // If a Round 1 pick is changed, clear corresponding Round 2 and Semi-final picks
    if (gameId.includes('67591a1e86598a7078f6d30')) {
      const bracketEntry = bracket[gameId];
      if (bracketEntry) {
        const { nextGameId, semiFinalGameId, finalGameId } = bracketEntry;

        // Clear the downstream pick for the Round 2 game
        setUserPicks((prevPicks) => ({
          ...prevPicks,
          [nextGameId]: null, // Reset Round 2 pick to null
          [semiFinalGameId]: null, // Reset Semi-final pick to null
          [finalGameId]: null, // Reset Semi-final pick to null
        }));
      }
    }
  };

  const handleConfidenceChange = (gameId, event) => {
    const confidence = parseInt(event.target.value, 10);
    handlePick(gameId, userPicks[gameId]?.teamKey, confidence); // Update confidence level without changing the selected team
  };

  // Function to update downstream games based on user picks
  const updateDownstreamGames = (currentGameId, selectedTeamName) => {
    const bracketEntry = bracket[currentGameId];
    if (bracketEntry) {
      const { nextGameId, team, semiFinalGameId, finalGameId } = bracketEntry;

      // Update Round 2 game with the selected team
      setUpdatedGames((prevGames) =>
        prevGames.map((game) =>
          game._id === nextGameId
            ? { ...game, [team]: selectedTeamName || 'TBD' }
            : game
        )
      );

      // Update Semi-final game
      if (semiFinalGameId) {
        setUpdatedGames((prevGames) =>
          prevGames.map((game) =>
            game._id === semiFinalGameId
              ? { ...game, team1: 'TBD', team2: 'TBD' }
              : game
          )
        );
      }

      // Update Final game
      if (finalGameId) {
        setUpdatedGames((prevGames) =>
          prevGames.map((game) =>
            game._id === finalGameId
              ? { ...game, team1: 'TBD', team2: 'TBD' }
              : game
          )
        );
      }
    }
  };

  const handleSave = () => {
    console.log('Saving picks:', userPicks);
    onClose(); // Close modal after saving
  };

  return (
    <div className="make-picks-container">
      <h1>Make Your Picks</h1>
      <div>Spread provided for context, but you are not picking against the spread! Pick the game winners! Confidence rating represents the number of points you will earn if you pick correctly. You can only use each confidence rating once, so pick the highest value for the pick you're most confident in.</div>
      <div>
        {updatedGames.map((game) => (
          <div
            key={game._id}
            className={`game-card ${game.isLateEntry ? 'late-entry' : ''}`}
            style={{ opacity: game.isLateEntry ? 0.5 : 1 }} // Style games that are in the past
          >
            <h3>{game.name}</h3>
            <p>Spread: {game.spread}</p>
            <p>Kickoff: {formatDate(game.date)}</p> {/* Display formatted date */}
            <div className="teams-container">
              <div
                className={`team-card ${userPicks[game._id]?.teamKey === 'team1' ? 'selected' : ''} ${game.isLateEntry ? 'disabled' : ''}`}
                onClick={() => !game.isLateEntry && handlePick(game._id, 'team1')}
              >
                {game.team1}
              </div>
              <div
                className={`team-card ${userPicks[game._id]?.teamKey === 'team2' ? 'selected' : ''} ${game.isLateEntry ? 'disabled' : ''}`}
                onClick={() => !game.isLateEntry && handlePick(game._id, 'team2')}
              >
                {game.team2}
              </div>
            </div>
             {/* Confidence Rating Dropdown */}
             <select
            disabled={game.isLateEntry}
            value={userPicks[game._id]?.confidence || ''}
            onChange={(e) =>
              handlePick(game._id, userPicks[game._id]?.teamKey, parseInt(e.target.value))
            }
            className="confidence-dropdown"
          >
            <option value="">Select Confidence</option>
            {availableRatings
              // .filter((rating) => !usedRatings.has(rating)) // Filter out used ratings
              .map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Points
                </option>
              ))}
          </select>
          </div>
        ))}
      </div>
      <div className="modal-footer">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default MakePicks;
