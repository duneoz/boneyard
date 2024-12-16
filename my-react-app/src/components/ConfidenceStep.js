import React from 'react';

const ConfidenceStep = ({ selectedGames, setSelectedGames, onClose }) => {
  // Handle reorder logic here, for example using drag-and-drop or up/down buttons
  const handleReorder = (draggedIndex, droppedIndex) => {
    const reorderedGames = [...selectedGames];
    const [removed] = reorderedGames.splice(draggedIndex, 1);
    reorderedGames.splice(droppedIndex, 0, removed);
    setSelectedGames(reorderedGames);
  };

  const handleSave = () => {
    console.log('Final picks with confidence levels:', selectedGames); // Save this data
    onClose();
  };

  return (
    <div className="confidence-step-modal">
      <h1>Set Confidence Levels</h1>
      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Picked Winner</th>
            <th>Confidence Level</th>
          </tr>
        </thead>
        <tbody>
          {selectedGames.map((game, index) => (
            <tr key={game.gameId}>
              <td>{game.gameId}</td>
              <td>{game.team}</td>
              <td>{index + 1} Points</td> {/* Assign confidence points based on row order */}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ConfidenceStep;
