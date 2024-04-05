import React, { useState } from 'react';

// Styling for the boxes
const boxStyle = {
  width: '100px',
  height: '100px',
  margin: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid black',
  cursor: 'pointer',
};

const activeBoxStyle = {
  ...boxStyle,
  backgroundColor: '#4CAF50', // Active color
};

const raffleGroup = () => {
  const [activeBox, setActiveBox] = useState(null);

  // Function to handle box click
  const handleBoxClick = (boxNumber) => {
    setActiveBox(boxNumber);
  };

  // Function to render a single box
  const renderBox = (number) => {
    return (
      <div
        style={activeBox === number ? activeBoxStyle : boxStyle}
        onClick={() => handleBoxClick(number)}
        key={number}
      >
        {number}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      {[1, 2, 3, 4, 5].map(renderBox)}
    </div>
  );
};

export default raffleGroup;