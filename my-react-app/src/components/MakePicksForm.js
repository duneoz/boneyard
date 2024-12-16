import React, { useState, useEffect } from 'react';
import '../styles/MakePicksForm.css';

const MakePicks = ({ onClose }) => {
  const [games, setGames] = useState([]); // All games fetched from backend
  const [userPicks, setUserPicks] = useState({}); // User's picks
  const [updatedGames, setUpdatedGames] = useState([]); // Games updated dynamically based on picks

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

  const handlePick = (gameId, teamKey) => {
    setUserPicks((prevPicks) => {
      const updatedPicks = {
        ...prevPicks,
        [gameId]: teamKey,
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
      <div>Spread provided for context, but you are not picking against the spread! Pick the game winners!</div>
      <div>
        {updatedGames.map((game) => (
          <div
            key={game._id}
            className={`game-card ${game.isLateEntry ? 'late-entry' : ''}`}
            style={{ opacity: game.isLateEntry ? 0.5 : 1 }} // Style games that are in the past
          >
            <h3>{game.name}</h3>
            <p>Spread: {game.spread}</p>
            <p>Kickoff: {game.date}</p>
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
