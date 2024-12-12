import React, { useEffect, useState } from 'react';
import '../styles/BackgroundGrid.css';

// Function to generate a random logo from the logos array without duplication
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const BackgroundGrid = ({ logos }) => {
  const [gridItems, setGridItems] = useState([]);

  useEffect(() => {
    const generateGrid = () => {
      // Define a pattern for logo placement: A1, A3, A5, B2, B4, etc.
      const positions = [
        [1, 2], [1, 4], [1, 6],
        [2,1], [2, 3], [2, 5], [2,7],
        [3, 2], [3, 4], [3, 6],
        [4,1], [4, 3], [4, 5], [4,7],
        [5, 2], [5, 4], [5, 6],
        [6,1],[6, 3], [6, 5], [6,7],
        [7, 2], [7, 4], [7, 6],
        [8,1],[8, 3], [8, 5], [8,7],
        [9, 2], [9, 4], [9, 6],
        [10,1],[10, 3], [10, 5], [10,7],
        [11, 2], [11, 4], [11, 6],
        [12,1],[12, 3], [12, 5], [12,7],
        [13, 2], [13, 4], [13, 6],
        [14,1],[14, 3], [14, 5], [14,7],
        [15, 2], [15, 4], [15, 6]
      ];

      // Shuffle the logos array to ensure randomness and prevent duplicates
      const shuffledLogos = shuffleArray(logos);

      // Pick logos from the shuffled array
      const items = positions.map((position, index) => ({
        id: Math.random().toString(36).substr(2, 9), // Unique ID for each item
        logo: shuffledLogos[index], // Assign each logo from the shuffled array
        row: position[0],
        col: position[1],
      }));

      setGridItems(items);
    };

    generateGrid();
  }, [logos]); // Depend on logos to regenerate grid if logos change

  return (
    <div className="background-grid">
      {gridItems.map((item) => (
        <img
          key={item.id}
          src={item.logo}
          alt={`Logo ${item.id}`}
          className="grid-item"
          style={{
            gridRow: item.row,
            gridColumn: item.col,
          }}
        />
      ))}
    </div>
  );
};

// Fetch logos from the assets
const logos = [];
const logoContext = require.context('../assets/logos', false, /\.(png|jpe?g|svg)$/);

logoContext.keys().forEach((key) => {
  logos.push(logoContext(key));
});

console.log(logos); // Optional: Verify logos are being loaded

export default BackgroundGrid;
