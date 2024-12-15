import React, { useState, useEffect } from 'react';
import '../styles/MakePicksForm.css';

const MakePicks = ({ onClose }) => {
  const [games, setGames] = useState([]); // All games fetched from backend
  const [userPicks, setUserPicks] = useState({}); // User's picks
  const [updatedGames, setUpdatedGames] = useState([]); // Games updated dynamically based on picks
  const [availableRatings, setAvailableRatings] = useState(Array.from({ length: 46 }, (_, i) => i + 1)); // Ratings from 1 to 46

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
    // Convert the UTC date to the local time zone
    const localDate = new Date(utcDate);

    // Get the hour, minute, and period (AM/PM)
    const hour = localDate.getHours();
    const minute = localDate.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';

    // Adjust the hour for the 12-hour clock format
    const adjustedHour = hour % 12 || 12; // Convert 0 (midnight) to 12
    const formattedMinute = minute < 10 ? `0${minute}` : minute; // Ensure 2 digits for minutes

    // Format the time in "MM/DD, HH:MM AM/PM" format
    let formattedDate = `${localDate.toLocaleDateString('en-US')}, ${adjustedHour}:${formattedMinute} ${period}`;

    // Remove leading zero in the hour if it's between 1 and 9
    formattedDate = formattedDate.replace(/^(\d{1}):/g, '$1:'); // This ensures the hour is without leading zeros

    return formattedDate;
};

  
  // Bracket relationships (hardcoded based on your example)
  const bracket = {
    // First round picks
    "67591a1e86598a7078f6d30a": { nextGameId: "67591a1e86598a7078f6d324", semiFinalGameId:"67591a1e86598a7078f6d32b", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d309": { nextGameId: "67591a1e86598a7078f6d323", semiFinalGameId:"67591a1e86598a7078f6d32b", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d308": { nextGameId: "67591a1e86598a7078f6d322", semiFinalGameId:"67591a1e86598a7078f6d32a", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },
    "67591a1e86598a7078f6d307": { nextGameId: "67591a1e86598a7078f6d325", semiFinalGameId:"67591a1e86598a7078f6d32a", finalGameId: "67591a1e86598a7078f6d32c", team: "team1" },

    // Second round picks
    "67591a1e86598a7078f6d324": { nextGameId: "67591a1e86598a7078f6d32b", team: "team2" },
    "67591a1e86598a7078f6d323": { nextGameId: "67591a1e86598a7078f6d32b", team: "team1" },
    "67591a1e86598a7078f6d322": { nextGameId: "67591a1e86598a7078f6d32a", team: "team1" },
    "67591a1e86598a7078f6d325": { nextGameId: "67591a1e86598a7078f6d32a", team: "team2" },

    // Semi-final picks
    "67591a1e86598a7078f6d32b": { nextGameId: "67591a1e86598a7078f6d32c", team: "team2" },
    "67591a1e86598a7078f6d32a": { nextGameId: "67591a1e86598a7078f6d32c", team: "team1" }
  };

  const handlePick = (gameId, teamKey, confidence) => {
    setUserPicks((prevPicks) => {
      const updatedPicks = {
        ...prevPicks,
        [gameId]: {teamKey, confidence},
      };

      

      // If a Round 1 pick is changed, clear corresponding Round 2 and Semi-final picks
      if (gameId.includes('67591a1e86598a7078f6d30')) {
        // Round 1 pick has been changed
        const bracketEntry = bracket[gameId];
        if (bracketEntry) {
          const { nextGameId, semiFinalGameId, finalGameId } = bracketEntry;

          // Clear the downstream pick for the Round 2 game
          updatedPicks[nextGameId] = null; // Reset Round 2 pick to null

          // Clear the downstream pick for the Semi-final game
          updatedPicks[semiFinalGameId] = null; // Reset Semi-final pick to null

          // Clear the downstream pick for the Championship game
          updatedPicks[finalGameId] = null; // Reset Semi-final pick to null

          // Set Team 1 and Team 2 cards to "TBD"
          updatedPicks[semiFinalGameId] = { team1: "TBD", team2: "TBD" };
        }
      }

      return updatedPicks;
    });

    // Fetch the selected team name from the current game
    const selectedTeam = updatedGames.find((game) => game._id === gameId)?.[teamKey];

    const updateDownstreamGames = (currentGameId, selectedTeamName) => {
      const bracketEntry = bracket[currentGameId];
      if (bracketEntry) {
        const { nextGameId, team: teamPosition, semiFinalGameId, finalGameId } = bracketEntry;

        // Check if this game has a downstream effect (Round 2, Semi-final, Round 3)
        setUpdatedGames((prevGames) =>
          prevGames.map((game) =>
            game._id === nextGameId
              ? {
                  ...game,
                  [teamPosition]: selectedTeamName || "TBD", // Set Team to TBD if no selection
                }
              : game
          )
        );

        // Apply changes for Semi-final game as well
        if (semiFinalGameId) {
          setUpdatedGames((prevGames) =>
            prevGames.map((game) =>
              game._id === semiFinalGameId
                ? {
                    ...game,
                    team1: "TBD", // Force Team 1 to "TBD" for Semi-final
                    team2: "TBD", // Force Team 2 to "TBD" for Semi-final
                  }
                : game
            )
          );
        }

        // Apply changes for Final game as well
        if (finalGameId) {
            setUpdatedGames((prevGames) =>
              prevGames.map((game) =>
                game._id === finalGameId
                  ? {
                      ...game,
                      team1: "TBD", // Force Team 1 to "TBD" for Semi-final
                      team2: "TBD", // Force Team 2 to "TBD" for Semi-final
                    }
                  : game
              )
            );
          }
      }
    };

    // Start updating downstream games if there's a selected team
    if (selectedTeam) {
      updateDownstreamGames(gameId, selectedTeam);
    }
  };

  const handleSave = () => {
    // Logic to save picks (send to the server, etc.)
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
                className={`team-card ${userPicks[game._id] === 'team1' ? 'selected' : ''} ${game.isLateEntry ? 'disabled' : ''}`}
                onClick={() => !game.isLateEntry && handlePick(game._id, 'team1')}
              >
                {game.team1}
              </div>
              <div
                className={`team-card ${userPicks[game._id] === 'team2' ? 'selected' : ''} ${game.isLateEntry ? 'disabled' : ''}`}
                onClick={() => !game.isLateEntry && handlePick(game._id, 'team2')}
              >
                {game.team2}
              </div>
            </div>
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
