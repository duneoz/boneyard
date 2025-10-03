import React, { useEffect } from 'react';
import '../styles/BackgroundGrid.css';

const BackgroundGrid = ({ logos }) => {
  // Function to generate the grid with logos
  const generateGrid = () => {
    const gridContainer = document.querySelector('.background-grid');
    gridContainer.innerHTML = ''; // Clear any existing rows

    const rows = [];
    
    // Create rows dynamically
    for (let i = 0; i < 15; i++) {  // Adjust row count if needed
      const row = document.createElement('div');
      row.className = 'grid-row';
      row.style.top = `${i * 100}px`; // Space rows apart (adjust spacing as needed)
      
      // Determine columns based on whether the row index is odd or even
      let columns;
      if (i % 2 === 0) { // Even rows get logos in cols 2, 4, 6
        columns = [2, 4, 6];
      } else { // Odd rows get logos in cols 1, 3, 5, 7
        columns = [1, 3, 5, 7];
      }

      // Add logos to the row based on the column configuration
      columns.forEach((col) => {
        const cell = document.createElement('div');
        cell.className = 'grid-item';
        const logo = document.createElement('img');
        
        // Randomly shuffle logos for each cell
        const randomLogo = logos[Math.floor(Math.random() * logos.length)];
        logo.src = randomLogo;
        logo.alt = 'Logo';
        logo.className = 'logo';
        cell.appendChild(logo);
        row.appendChild(cell);
      });

      gridContainer.appendChild(row);
    }
  };

  // Function to handle infinite scrolling effect
  const startScrollAnimation = () => {
    const gridContainer = document.querySelector('.background-grid');
    const rows = Array.from(document.querySelectorAll('.grid-row'));
    const speed = 0.1; // Adjust speed here

    const animate = () => {
      rows.forEach(row => {
        const currentTop = parseFloat(getComputedStyle(row).top) || 0;
        const newTop = currentTop - speed;

        if (newTop + row.offsetHeight <= 0) {
          row.style.top = `${gridContainer.offsetHeight}px`;
        } else {
          row.style.top = `${newTop}px`;
        }
      });

      requestAnimationFrame(animate);
    };

    animate(); // Start animation
  };

  // Initialize the grid and animation
  useEffect(() => {
    generateGrid();
    startScrollAnimation();
  }, [logos]);

  return <div className="background-grid"></div>;
};

export default BackgroundGrid;
