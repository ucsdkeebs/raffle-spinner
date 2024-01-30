import './App.css';
//import { Button } from '@mui/material';
import {useState, useEffect} from 'react';
import { useGSAP } from "@gsap/react";
import { gsap } from 'gsap';
import Triangle from './triangle.jsx';
import Winscreen from './winscreen.jsx';

function App() {
  // array to store raffle data
  const [raffle, setRaffle] = useState([]);
  
  // the values that are displayed on the slot
  const [slotValues, setSlotValues] = useState(['.','.','.','.','.','.','.','.','.','.'])

  // whether or not the modal should be opened
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // the winner of the raffle
  const [winner, setWinner] = useState([]);

  //disale button of the raffle
  const [isButtonDisabled, setButtonDisabled] = useState(false);

  // index of the Winner sheet to be added to the list of winners
  const [currentWinIndex, setCurrentWinIndex] = useState(1);

  // opens Modal on win by setting state to true
  const openModal = () => {
    setModalIsOpen(true);
  };

  // closes Modal after clicking on x or outside of modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  /**
   * Calls to GoogleSheets API to retrieve list of valid people to enter raffle
   * sets the raffle array to this list retrieved
   */
  const fetchData = async () => {
    console.log('fetch test!');
    const backendUrl = 'http://localhost:3001/api/get-google-sheet-data';

    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      const info = parseData(data);
      await setRaffle(info);    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchNumWinner = async () => {
    // creates the api query with the relevant information
    const backendUrl = `http://localhost:3001/api/get-num-winners`;

    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      let count = 1;
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === "TRUE") {
          count++;
        }
      }
      setCurrentWinIndex(count); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const updateData = async () => {
    // creates the api query with the relevant information
    const backendUrl = `http://localhost:3001/api/add-winner/${winner[2]}/${currentWinIndex}/${winner[0]}/${winner[1]}`;

    try {
      const response = await fetch(backendUrl,{
        method: "POST"
      });
      const data = await response.json();
      setCurrentWinIndex(currentWinIndex + 1); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // sets the state of raffle array
  useEffect(() => {
    console.log('Raffle state updated:', raffle);
    let slots = raffle.slice(0,10);
    let parseSlots = []
    for (let i = 0; i < slots.length; i++)
    {
      if (slots[i].length > 1)
      {
        parseSlots.push(slots[i][0]);
      }
    }
    console.log("CURRENT SLOTS: ", parseSlots);
    setSlotValues(parseSlots);
  }, [raffle]);

  // calls fetch data command just to avoid errors at the start
  useEffect(() => {
    console.log('no dependencies');
    fetchData();
    fetchNumWinner();
  }, []);

  useEffect(() => {
    console.log(currentWinIndex);
  }, [currentWinIndex])

  const rollNames = async () => {
    console.log(raffle);
    // picks a random index to start the spin
    var start = Math.floor(Math.random() * raffle.length); 
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
          const shiftedSlots = [];
          for (let j = slotValues.length; j > 0; j--) {
            //console.log(parsedData[(i + j - (slotValues.length / 2)) % parsedData.length][0]);
            shiftedSlots.push(raffle[(i + j - (slotValues.length / 2)) % raffle.length][0]);
          }
          setSlotValues(shiftedSlots);
          gsap.set(".slot", { //set resets the slots to their original place
            y: "-=8vh"
          })
        }
      });
    }

    // gets winning index and sets the winner to be the string at that index
    let winIndex = (start + spins) % raffle.length;
    setWinner(raffle[winIndex]);
  }

  // creates array of numbers 1-10 to be used to create the slots
  const numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(i);
  }

  return (
    <div className="raffle">
        <div className="raffleBody">
            <Edge type="top"/>
            {numbers.map((number) => (
              <Slot key={number} value={slotValues[number]} slotNumber={number} />
            ))}
            <Edge type="bottom"/>
            <Triangle/>
        </div>

        <div className="LowerRaffle">
        <button id="roll" disabled = {isButtonDisabled} onClick={async() => {
          setButtonDisabled(true);
          await fetchData();
          
          await rollNames();

          // delay to make the animation smoother
          await sleep(1000); 
    
          openModal();
          setButtonDisabled(false);
        }}>
              Spin
            </button>
        </div>
        
        <Winscreen
          isOpen={modalIsOpen}
          closeModal={closeModal}
          modalText={winner[0]}
          remove={() => {
            updateData()
            closeModal()
          }}
        />
    </div>
    
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// goes through the data from the spreadsheet to properly run the raffle
function parseData(data) {
  // only want to keep E(1) and F(2) which is name and email
  // also want to add extra tickets G(3)
  const output = [];
  for (let i = 0; i < data.length; i++) {
    // checks if the entry is both in the venue and has yet to win
    if ((data[i][4] === "TRUE") && (data[i][5] === "FALSE")) {
      // accounts for any extra tickets that the entry has
      for (let j = 0; j < parseInt(data[i][3]) + 1; j++) {
        output.push([data[i][1], data[i][2], parseInt(i) + 2]);
      }
    }
  }
  return shuffle(output);
}

function Slot({value, slotNumber}){
  const slotID = "slot"+ slotNumber;
  const [val, setVal] = useState(value);

  useEffect (() => {
    setVal(value);
  }, [value]);

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
export default App;
