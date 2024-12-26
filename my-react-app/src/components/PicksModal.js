import React, { useState } from "react";
import MakePicksForm from "./MakePicksForm";
import ConfidenceStep from "./ConfidenceStep";
import "../styles/PicksModal.css";

const PicksModal = ({ onClose, currentUserId, onSaveAndClose }) => {
  const [nextStep, setNextStep] = useState(false);
  const [userPicks, setUserPicks] = useState({});

  // Function to handle transitioning to the Confidence Step
  const handleNextStep = () => {
    if (Object.keys(userPicks).length === 0) {
      alert("Please make your picks before proceeding.");
      return;
    }
    setNextStep(true);
  };

  // Function to collect picks from MakePicksForm
  const collectPicks = (picks) => {
    setUserPicks(picks);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Conditionally render MakePicksForm or ConfidenceStep */}
        {!nextStep ? (
          <MakePicksForm
            collectPicks={collectPicks} // Pass the collectPicks function to MakePicksForm
            userPicks={userPicks} // Optional: Pass initial picks if needed
          />
        ) : (
          <ConfidenceStep
            userPicks={userPicks}
            onClose={onClose}
            currentUserId={currentUserId}
            onSaveAndClose={onSaveAndClose}  // <-- Use `onSaveAndClose` to match the prop
          />

        )}

        {/* Footer */}
        <div className="modal-footer">
          {!nextStep && (
            <button className="next-step-button" onClick={handleNextStep}>
              Next Step
            </button>
          )}
          
          {!nextStep && (
            <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PicksModal;
