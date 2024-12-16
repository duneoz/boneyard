import React, { useState } from "react";
import MakePicksForm from "./MakePicksForm";
import ConfidenceStep from "./ConfidenceStep";
import "../styles/PicksModal.css";

const PicksModal = ({ onClose }) => {
    const [nextStep, setNextStep] = useState(false);
    const [selectedGames, setSelectedGames] = useState([]);

    const handleNextStep = () => {
        setNextStep(true);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                    
                {/* Content */}
                {!nextStep ? (
                    <MakePicksForm
                        selectedGames={selectedGames}
                        setSelectedGames={setSelectedGames}
                    />
                ) : (
                    <ConfidenceStep
                        selectedGames={selectedGames}
                        setSelectedGames={setSelectedGames}
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
                        <button className="save-button" onClick={onClose}>
                            Save and Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PicksModal;
