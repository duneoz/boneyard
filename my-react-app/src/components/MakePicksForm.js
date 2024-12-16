import React, { useState, useEffect } from 'react';
import '../styles/MakePicksForm.css';

const MakePicks = () => {
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

  const [games, setGames] = useState([]);
  const [userPicks, setUserPicks] = useState({});
  const [updatedGames, setUpdatedGames] = useState([]);
  const [nextStep, setNextStep] = useState(false);
  const [selectedGames, setSelectedGames] = useState([]);

  const formatDate = (date) => {
    const options = { month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

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

  const handlePick = (gameId, teamKey) => {
    setUserPicks((prevPicks) => {
      const updatedPicks = {
        ...prevPicks,
        [gameId]: teamKey,
      };
  
      if (gameId.includes('67591a1e86598a7078f6d30')) {
        const bracketEntry = bracket[gameId];
        if (bracketEntry) {
          const { nextGameId, semiFinalGameId, finalGameId } = bracketEntry;
  
          updatedPicks[nextGameId] = null;
          updatedPicks[semiFinalGameId] = null;
          updatedPicks[finalGameId] = null;
  
          updatedPicks[semiFinalGameId] = { team1: "TBD", team2: "TBD" };
        }
      }
  
      return updatedPicks;
    });
  
    const selectedTeam = updatedGames.find((game) => game._id === gameId)?.[teamKey];
  
    const updateDownstreamGames = (currentGameId, selectedTeamName) => {
      const bracketEntry = bracket[currentGameId];
      if (bracketEntry) {
        const { nextGameId, team: teamPosition, semiFinalGameId, finalGameId } = bracketEntry;
  
        setUpdatedGames((prevGames) =>
          prevGames.map((game) =>
            game._id === nextGameId
              ? { ...game, [teamPosition]: selectedTeamName || "TBD" }
              : game
          )
        );
  
        if (semiFinalGameId) {
          setUpdatedGames((prevGames) =>
            prevGames.map((game) =>
              game._id === semiFinalGameId
                ? { ...game, team1: "TBD", team2: "TBD" }
                : game
            )
          );
        }
  
        if (finalGameId) {
          setUpdatedGames((prevGames) =>
            prevGames.map((game) =>
              game._id === finalGameId
                ? { ...game, team1: "TBD", team2: "TBD" }
                : game
            )
          );
        }
      }
    };
  
    if (selectedTeam) {
      updateDownstreamGames(gameId, selectedTeam);
    }
  };

  const handleNextStep = () => {
    const selectedGamesList = Object.keys(userPicks).map((gameId) => ({
      gameId,
      team: userPicks[gameId],
    }));
    setSelectedGames(selectedGamesList);
    setNextStep(true);
  };

  return (
    <div className="make-picks-container">
      <h1> Step 1: Make Your Picks</h1>
      <div>Spread provided for context, but you are not picking against the spread! Pick the game winners!</div>
      <div>
        {updatedGames.map((game) => (
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
    </div>
  );
};

export default MakePicks;
