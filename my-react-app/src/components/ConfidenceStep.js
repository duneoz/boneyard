import React, { useState } from 'react';

const ConfidenceStep = ({ selectedGames, onClose }) => {
  console.log("Selected games in ConfidenceStep:", selectedGames);
  const [orderedGames, setOrderedGames] = useState(selectedGames);

  // Handle reorder logic here (drag-and-drop or up/down buttons)
  const handleReorder = (draggedIndex, droppedIndex) => {
    const reorderedGames = [...orderedGames];
    const [removed] = reorderedGames.splice(draggedIndex, 1);
    reorderedGames.splice(droppedIndex, 0, removed);
    setOrderedGames(reorderedGames);
  };

  // Handle assigning confidence points
  const handleSave = () => {
    // Final picks with confidence levels (add the logic to assign confidence points)
    const finalPicks = orderedGames.map((game, index) => ({
      ...game,
      confidence: 46 - index, // Top game gets 46 points, next gets 45, etc.
    }));
    console.log('Final picks with confidence levels:', finalPicks);
    onClose();
  };

  return (
    <div className="confidence-step-modal">
      <h1>Step 2: Set Confidence Levels</h1>
      <table className="picks-table">
        <thead>
          <tr>
            <th>Game</th>
            <th>Selected Winner</th>
            <th>Spread</th>
            <th>Confidence Level</th>
          </tr>
        </thead>
        <tbody>
          {orderedGames.map((game, index) => (
            <tr key={index}>
              <td>{game.name}</td>
              <td>{game.selectedWinner}</td>
              <td>
                {/* You could add buttons to reorder the games, or drag-and-drop */}
                <button onClick={() => handleReorder(index, index - 1)} disabled={index === 0}>Up</button>
                <button onClick={() => handleReorder(index, index + 1)} disabled={index === orderedGames.length - 1}>Down</button>
                <span>{46 - index} Points</span> {/* Confidence level */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <button onClick={handleSave}>Save</button> */}
    </div>
  );
};

export default ConfidenceStep;
