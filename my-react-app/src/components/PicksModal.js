import React, { useState } from "react";
import MakePicksForm from "./MakePicksForm";
import ConfidenceStep from "./ConfidenceStep";
import "../styles/PicksModal.css";

const PicksModal = ({ onClose }) => {
    const [nextStep, setNextStep] = useState(false);
    const [userPicks, setUserPicks] = useState({}); // Manage user picks

    // Function to handle transition to next step (Confidence Step)
    const handleNextStep = () => {
        setNextStep(true); // Move to the next step
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Conditionally render MakePicksForm or ConfidenceStep */}
                {!nextStep ? (
                    <MakePicksForm
                        userPicks={userPicks}
                        setUserPicks={setUserPicks} // Pass setter to MakePicksForm
                    />
                ) : (
                    <ConfidenceStep
                        userPicks={userPicks}  // Pass userPicks to ConfidenceStep
                        onClose={onClose}
                    />
                )}

                {/* Footer (Always rendered) */}
                <div className="modal-footer">
                    <button
                        className="next-step-button"
                        onClick={nextStep ? null : handleNextStep} // Disable button if already at next step
                    >
                        {nextStep ? "Save and Close" : "Next Step"}
                    </button>

                    <button className="modal-close-button" onClick={onClose}>
                        Close
                    </button>

                    {nextStep && (
                        <button className="save-button" onClick={() => console.log("Saving picks and closing modal")}>
                            Save and Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PicksModal;
