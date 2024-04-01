import React from 'react';

const RaffleSlot = ({ raffleSlot, setRaffleSlot }) => {
  return (
    <div>
      <div className="upperSection">
        Now Showing
      </div>
      <div className="selectorWrapper">
        <select
          value={raffleSlot}
          onChange={(e) => setRaffleSlot(e.target.value)}
          className="select"
        >
          <option value="Section 1">1</option>
          <option value="Section 2">2</option>
          <option value="Section 3">3</option>
          <option value="Section 4">4</option>
        </select>
      </div>
    </div>
  );
};

export default RaffleSlot;