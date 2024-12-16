import { useEffect, useState } from 'react';
import React { useState, useEffect } from "react";
import '../styles/MakePicksForm.css';

const MakePicks = ({ onClose }) = > {
    const [games, setGames] = useState([]); // All games fetched from backend
    const [userPicks, setUserPicks] = useState({}); // User's picks
    const [updatedGames, setUpdatedGames] = useState([]); // Games updated dynamically based on picks
    const [availableRatings, setAvailableRatings] = useState(Array.from({ length: 46 }, (_, i) => i + 1)); // Ratings from 1 to 46
    
    useEffect(() => {
        const fetchGames = async () = > {
            try {
                const response = await fetch('http://localhost:5000/api/games');
                const data = await response.json();
                const currentDate = new Date();

                const gamesWithStatus = data.map((game) => ({ ...game, isLateEntry: new Date(game.date)}))
            }
        }
    })

}