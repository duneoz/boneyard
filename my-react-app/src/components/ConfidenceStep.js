import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../styles/ConfidenceStep.css";
import { toast } from 'react-toastify';

const ConfidenceStep = ({ 
  userPicks, 
  onClose, 
  currentUserId, 
  onSaveAndClose 
}) => {
  const [orderedPicks, setOrderedPicks] = useState([]);

  // ✅ Use environment variable for API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const picksArray = Object.entries(userPicks).map(([gameId, teamData]) => ({
      gameId,
      ...teamData,
    }));
    setOrderedPicks(picksArray);
  }, [userPicks]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
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
      confidence: 46 - index,
    }));

    console.log("User Picks:", picks);

    try {
      const response = await fetch(`${API_BASE_URL}/api/picks/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ picks }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Picks submitted successfully");
        toast.success("Picks submitted successfully!");
        onSaveAndClose();
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error saving picks:", errorData.message);
        toast.error(`Error saving picks: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving picks:", error);
      toast.error("An unexpected error occurred while saving picks.");
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
                  draggableId={`${pick.gameId}-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`pick-card ${snapshot.isDragging ? "dragging" : ""}`}
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
                        <div className="spread">
                          {pick.matchup}, {pick.spread}
                        </div>
                        <div className="selected-team">
                          Pick: <i>{pick.selectedTeam}</i>
                        </div>
                      </div>
                      <div className="gripper">
                        <span></span><span></span><span></span>
                        <span></span><span></span><span></span>
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
