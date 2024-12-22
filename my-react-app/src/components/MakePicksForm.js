import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/MakePicksForm.css';

const formatDate = (date) => {
  const options = { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const MakePicksForm = ({ collectPicks, userPicks }) => {
  const [games, setGames] = useState([]);

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

    setGames((prevGames) =>
      prevGames.map((game) =>
        game._id === gameId ? { ...game, userPick: selectedTeamName } : game
      )
    );

    const updateDownstreamGames = (game, selectedTeamName) => {
      const { nextGameId, nextGameTeam, semiFinalGameId, finalGameId } = game;

      if (nextGameId && nextGameTeam) {
        setGames((prevGames) =>
          prevGames.map((nextGame) =>
            nextGame._id === nextGameId
              ? { ...nextGame, [nextGameTeam]: selectedTeamName, userPick: null }
              : nextGame
          )
        );

        const nextGame = games.find((game) => game._id === nextGameId);
        if (nextGame) {
          updateDownstreamGames(nextGame, selectedTeamName);
        }
      }

      if (semiFinalGameId) {
        setGames((prevGames) =>
          prevGames.map((semiFinalGame) =>
            semiFinalGame._id === semiFinalGameId
              ? {
                  ...semiFinalGame,
                  team1:
                    semiFinalGame.team1 === selectedTeamName
                      ? 'TBD'
                      : semiFinalGame.team1,
                  team2:
                    semiFinalGame.team2 === selectedTeamName
                      ? 'TBD'
                      : semiFinalGame.team2,
                  userPick: null,
                }
              : semiFinalGame
          )
        );
      }

      if (finalGameId) {
        setGames((prevGames) =>
          prevGames.map((finalGame) =>
            finalGame._id === finalGameId
              ? {
                  ...finalGame,
                  team1:
                    finalGame.team1 === selectedTeamName
                      ? 'TBD'
                      : finalGame.team1,
                  team2:
                    finalGame.team2 === selectedTeamName
                      ? 'TBD'
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
    const selectedGame = games.find((game) => game._id === gameId);
    if (!selectedGame) return;

    // Create an object to store game details
    const pickDetails = {
        gameName: selectedGame.name,
        spread: selectedGame.spread,
        selectedTeam: selectedTeamName,
    };

    // Update the bracket with the selected team
    updateBracket(gameId, selectedTeamName);

    // Pass the updated pick to the parent component
    collectPicks((prevPicks) => ({
        ...prevPicks,
        [gameId]: pickDetails, // Store the entire object
    }));
};


  return (
    <div className="make-picks-container">
      <h2>Step 1: Make Your Picks</h2>
      <div>Pick the winner for each bowl game. You are picking the WINNER. Spread is provided strictly for context - you are not picking against the spread! Games that are grayed out have kicked off in the past, so you are no longer able to pick those games.</div>
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
                  className={`team-card ${userPicks[game._id]?.selectedTeam === game.team1 ? 'selected' : ''}`}
                  onClick={() => !game.isLateEntry && handlePick(game._id, game.team1)}
                >
                  {game.team1}
                </div>
                <div
                  className={`team-card ${userPicks[game._id]?.selectedTeam === game.team2 ? 'selected' : ''}`}
                  onClick={() => !game.isLateEntry && handlePick(game._id, game.team2)}
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

MakePicksForm.propTypes = {
  userPicks: PropTypes.object.isRequired,
  collectPicks: PropTypes.func.isRequired,
};

export default MakePicksForm;
