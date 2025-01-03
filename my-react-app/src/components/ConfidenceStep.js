import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../styles/ConfidenceStep.css"; // Ensure styles are updated
import { toast } from 'react-toastify';

const ConfidenceStep = ({ 
  userPicks, 
  onClose, 
  currentUserId, 
  onSaveAndClose 
}) => {
  const [orderedPicks, setOrderedPicks] = useState([]);

  console.log("currentUserId in Confidence:", currentUserId);

  useEffect(() => {
    // Convert user picks into an array with game IDs and selected team
    const picksArray = Object.entries(userPicks).map(([gameId, teamData]) => ({
      gameId,
      ...teamData,
    }));
    setOrderedPicks(picksArray);
  }, [userPicks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside a list, do nothing

    const updatedPicks = [...orderedPicks];
    const [movedItem] = updatedPicks.splice(result.source.index, 1);
    updatedPicks.splice(result.destination.index, 0, movedItem);

    setOrderedPicks(updatedPicks);
  };

  const handleSave = async () => {
    if (orderedPicks.length === 0) {
      alert("Please reorder your picks before submitting.");
      return;
    }

    const picks = orderedPicks.map((pick, index) => ({
      userId: currentUserId,
      gameId: pick.gameId,
      selectedWinner: pick.selectedTeam,
      confidence: 46 - index, // Assign confidence based on position
    }));
    
    console.log("User Picks:", picks);

    try {
      const response = await fetch("https://bowl-bash-148f8ac7cdb4.herokuapp.com/api/picks/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ picks }), // Sending picks as an array
      });

      if (response.ok) {
        console.log("Picks submitted successfully");

        // Successful picks submission example
        toast.success('Picks submitted successfully!');

        // Trigger the handleSaveAndClose from the parent (HomePage.js)
        onSaveAndClose();

        onClose(); // Close the modal after successful save
      } else {
        const errorData = await response.json();
        console.error("Error saving picks:", errorData.message);
      }
    } catch (error) {
      console.error("Error saving picks:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="confidence-step-container">
        <h2>Step 2: Place your Bets!</h2>
        <p>
          Now you have the opportunity to wager bets on each pick. Use the drag
          and drop feature to reorder your picks so that you are wagering the
          most points on the picks you are most confident in!
        </p>
        <Droppable droppableId="picks-list">
          {(provided) => (
            <div
              className="picks-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {orderedPicks.map((pick, index) => (
                <Draggable
                  key={pick.gameId}
                  draggableId={`${pick.gameId}-${index}`} // Ensure draggableId is unique
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`pick-card ${
                        snapshot.isDragging ? "dragging" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="confidence-section">
                        <div className="confidence-points">
                          <div className="points">{46 - index}</div>
                          <div className="label">Points</div>
                        </div>
                      </div>
                      <div className="pick-details">
                        <div className="game-info">
                          <div className="game-name">
                            <strong>{pick.gameName}</strong>
                          </div>
                        </div>
                        <div>
                        {pick.matchup}, {pick.spread}
                        </div>
                        <div className="selected-team">
                          Pick: <i>{pick.selectedTeam}</i>
                        </div>
                        <div className="spread">
                          Spread: {pick.spread || "Spread Not Available"}
                        </div>
                      </div>
                      <div className="gripper">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>

      {/* Save and Close button */}
      <div className="finalize-button-container">
        <button className="save-button" onClick={handleSave}>
          Save and Close
        </button>
        <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
      </div>
    </DragDropContext>
  );
};

export default ConfidenceStep;
