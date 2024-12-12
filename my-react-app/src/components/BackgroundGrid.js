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
        [1, 1], [1, 3], [1, 5],
        [2, 2], [2, 4],
        [3, 1], [3, 3], [3, 5],
        [4, 2], [4, 4],
        [5, 1], [5, 3], [5, 5],
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
