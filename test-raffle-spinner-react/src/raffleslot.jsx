import React from 'react';

const RaffleSlot = ({ raffleSlot, setRaffleSlot }) => {
  return(
    <div className="rectangleWrapper">
      <div id='titleTag'>Now Showing:</div>
      <div className="emptyLine"></div>
      <div className="line"></div> 
      <div className="selectWrapper">
        <select
          value={raffleSlot}
          onChange={(e) => setRaffleSlot(e.target.value)}
          className="select"
        >
          <option value="1">Section 1</option>
          <option value="2">Section 2</option>
          <option value="3">Section 3</option>
          <option value="4">Section 4</option>
        </select>
      </div>
      <div className="line"></div>
      <div className="emptyLine"></div>
    </div>
  );
};

export default RaffleSlot;