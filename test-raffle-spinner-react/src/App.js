import './App.css';
//import { Button } from '@mui/material';
import {state, useState, useEffect} from 'react';
import { useGSAP } from "@gsap/react";
import { gsap } from 'gsap';

function App() {
  // array to store raffle data
  const [data, setData] = useState([]);
  
  const fetchData = () => {
    // Replace with your backend server URL
    console.log('fetch test!');
    const backendUrl = 'http://localhost:3001/api/get-google-sheet-data';

    fetch(backendUrl)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const numbers = Array.from({ length: 10 }, (_, index) => index);
  const slotComponents = numbers.map(number => (
    <Slot key={number} value="..." slotNumber={number} />
  ));

  return (
    <div className="raffle">
        <div className="raffleBody">
            <Edge type="top"/>
            {slotComponents[0]}
            {slotComponents[1]}
            {slotComponents[2]}
            {slotComponents[3]}
            {slotComponents[4]}
            {slotComponents[5]}
            {slotComponents[6]}
            {slotComponents[7]}
            {slotComponents[8]}
            {slotComponents[9]}
            <Edge type="bottom"/>
            <Triangle/>
        </div>

        <div className="LowerRaffle">
            <button id="roll" onClick={() => {
              console.log("test!")
              rollNames(parseData(fetchData()), slotComponents)
              }
            }>
              Spin
            </button>
        </div>
        
        <SelectOption/>
    </div>
    
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parseData(data) {
  // index 4 and 5 correspond to H and I which are boolean, 4 true 5 false
  // only want to keep E(1) and F(2) which is name and email
  // also want to add extra tickets G(3)
  const output = [];
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i][3] + 1; j++) {
      output.push([data[i][1], data[i][2]]);
    }
  }
  return shuffle(output);
}

// Need to make sure that button disables itself and opens modal
// Roll function that does the rolling and animation
async function rollNames(data, slots){
  // picks a random index to start the spin
  var start = Math.floor(Math.random() * data.length); 
  // the number of times to spin the wheel, with built in spin so that it always looks like it spins 
  var spins = Math.floor(Math.random() * 20) + 73; 

  for (let i = start; i <= start + spins; i++) {
    let delay = 0.05;
    // checks if there is less than 40 spins left, then starts to slow down the spin
    if (i >= start + spins - 40) {
        delay = (0.05 + (0.02 * (i - (start + spins - 40)) / 5)); //slows down the spin by 0.004 seconds.
    }
      
    await gsap.to(".slot", { // animates a slide downward
      duration: delay, // Animation duration in seconds
      y: "+=8vh", // Move each element down by one slot
      ease: "power4.out", // Easing function 
      // after roll completed, resets the divs with new values, i.e. slot2 goes back to its original place, but with the value of the old slot3 so the roll is complete
      onComplete: () => {
        for (let j = slots.length; j > 0; j--) {
          slots[slots.length - j].updateVal(data[(i + j - (slots.length / 2)) % data.length][0])
        }
        gsap.set(".slot", { //set resets the slots to their original place
          y: "-=8vh"
        })
      }
    });
  }
}

function Slot({value, slotNumber}){
  const slotID = "slot"+ slotNumber;
  const [val, setVal] = useState(value);

  const updateVal = (name) => {
    setVal(name);
  }

  return (
    <div id={slotID} className="slot">
      {val}
    </div>
  );
}

// shuffles arrays
function shuffle(array) {
  let currentIndex = array.length
  let randomIndex = 0;

  // while elements left to shuffle
  while (currentIndex > 0) {

    // pick random element and swap with current element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function Edge({type}){
  return (
    <div id={type} className="edge"></div>
  );
}

function Triangle(){
  return (
    <div className="triangle"></div>
  );
}

function SelectOption() {

  const [selectedOption, setSelectedOption] = useState('Names');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div id="refreshForm">
      <h2 >Select an Option:</h2>
      <form >
        <label>
          <input
            type="radio"
            name="refreshOption"
            value="Names"
            checked={selectedOption === 'Names'}
            onChange={handleOptionChange}
            // onClick={}
          />
          Names
        </label>

        <label>
          <input
            type="radio"
            name="refreshOption"
            value="Numbers"
            checked={selectedOption === 'Numbers'}
            onChange={handleOptionChange}
          />
          Numbers
        </label>
      </form>

      <p>You selected: {selectedOption}</p>
    </div>
  );
}

export default App;
