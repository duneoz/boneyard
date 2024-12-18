import React, { useState, useEffect } from 'react';
import '../styles/MakePicksForm.css';

const formatDate = (date) => {
  const options = { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const MakePicksForm = () => {
  const [games, setGames] = useState([]);
  const [userPicks, setUserPicks] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/games');
        const data = await response.json();
        const currentDate = new Date();

        const gamesWithStatus = data.map((game) => ({
          ...game,
          isLateEntry: new Date(game.date) <= currentDate,
        }));

        setGames(gamesWithStatus);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const updateBracket = (gameId, selectedTeamName) => {
    const selectedGame = games.find((game) => game._id === gameId);
  
    if (!selectedGame) return;
  
    // Update the user's pick for the current game
    setGames((prevGames) =>
      prevGames.map((game) =>
        game._id === gameId ? { ...game, userPick: selectedTeamName } : game
      )
    );
  
    const updateDownstreamGames = (game, selectedTeamName) => {
      const { nextGameId, nextGameTeam, semiFinalGameId, finalGameId } = game;
  
      if (nextGameId && nextGameTeam) {
        // Update the next game with the selected team
        setGames((prevGames) =>
          prevGames.map((nextGame) =>
            nextGame._id === nextGameId
              ? { ...nextGame, [nextGameTeam]: selectedTeamName, userPick: null }
              : nextGame
          )
        );
  
        const nextGame = games.find((game) => game._id === nextGameId);
        if (nextGame) {
          // Recursively update games affected by the pick change
          updateDownstreamGames(nextGame, selectedTeamName);
        }
      }
  
      // Reset Semi-final games if they depend on this pick
      if (semiFinalGameId) {
        setGames((prevGames) =>
          prevGames.map((semiFinalGame) =>
            semiFinalGame._id === semiFinalGameId
              ? {
                  ...semiFinalGame,
                  team1:
                    semiFinalGame.team1 === selectedTeamName
                      ? "TBD"
                      : semiFinalGame.team1,
                  team2:
                    semiFinalGame.team2 === selectedTeamName
                      ? "TBD"
                      : semiFinalGame.team2,
                  userPick: null,
                }
              : semiFinalGame
          )
        );
  
        const semiFinalGame = games.find((game) => game._id === semiFinalGameId);
        if (semiFinalGame) {
          updateDownstreamGames(semiFinalGame, selectedTeamName);
        }
      }
  
      // Reset Final game if it depends on this pick
      if (finalGameId) {
        setGames((prevGames) =>
          prevGames.map((finalGame) =>
            finalGame._id === finalGameId
              ? {
                  ...finalGame,
                  team1:
                    finalGame.team1 === selectedTeamName
                      ? "TBD"
                      : finalGame.team1,
                  team2:
                    finalGame.team2 === selectedTeamName
                      ? "TBD"
                      : finalGame.team2,
                  userPick: null,
                }
              : finalGame
          )
        );
      }
    };
  
    updateDownstreamGames(selectedGame, selectedTeamName);
  };
  

  const handlePick = (gameId, selectedTeamName) => {
    updateBracket(gameId, selectedTeamName);
    setUserPicks((prevPicks) => ({ ...prevPicks, [gameId]: selectedTeamName }));
  };

  return (
    <div className="make-picks-container">
      <h1>Step 1: Make Your Picks</h1>
      <div>Pick the game winners!</div>
      <div>
        {games && games.length > 0 ? (
          games.map((game) => (
            <div
              key={game._id}
              className={`game-card ${game.isLateEntry ? 'late-entry' : ''}`}
              style={{ opacity: game.isLateEntry ? 0.5 : 1 }}
            >
              <h3>{game.name}</h3>
              <p>Spread: {game.spread}</p>
              <p>Kickoff: {formatDate(game.date)}</p>
              <div className="teams-container">
                <div
                  className={`team-card ${userPicks[game._id] === game.team1 ? 'selected' : ''}`}
                  onClick={() => handlePick(game._id, game.team1)}
                >
                  {game.team1}
                </div>
                <div
                  className={`team-card ${userPicks[game._id] === game.team2 ? 'selected' : ''}`}
                  onClick={() => handlePick(game._id, game.team2)}
                >
                  {game.team2}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No games available to pick.</p>
        )}
      </div>
    </div>
  );
};

export default MakePicksForm;
