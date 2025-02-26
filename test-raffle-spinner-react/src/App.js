import './App.css';
//import { Button } from '@mui/material';
import {useState, useEffect} from 'react';
import { gsap } from 'gsap';
import Winscreen from './winscreen.jsx';
import AnimationRenderer from './animation.jsx';
import raffleFrame from './img/Raffle_Frame.png';
import RaffleSlot from './raffleslot.jsx';
import animationStatic from './img/Animation_Frames/kwibs_0000.png';
import animation from './img/kwibs.gif';

function App() {

  // array to store raffle data
  const [raffle, setRaffle] = useState([]);
  
  // the values that are displayed on the slot
  const [slotValues, setSlotValues] = useState(['.','.','.','.','.','.','.','.','.','.'])
  
  // whether or not the modal should be opened
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // the winner of the raffle
  const [winner, setWinner] = useState([]);

  // index of the Winner sheet to be added to the list of winners
  const [currentWinIndex, setCurrentWinIndex] = useState(0);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // which slot of the raffle is being spun
  const [raffleSlot, setRaffleSlot] = useState("I");

  // opens Modal on win by setting state to true
  const openModal = () => {
    setModalIsOpen(true);
  };

  // closes Modal after clicking on x or outside of modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // calls fetch data command just to avoid errors at the start
  useEffect(() => {
    console.log('no dependencies');
    fetchData();
    fetchNumWinner();
  }, [raffleSlot]);

  // sets the state of raffle array
  useEffect(() => {
    console.log('Raffle state updated');
    let slots = raffle.slice(0,10);
    let parseSlots = []
    for (let i = 0; i < slots.length; i++)
    {
      if (slots[i].length > 1)
      {
        parseSlots.push(slots[i][0]);
      }
    }
    //console.log("CURRENT SLOTS: ", parseSlots);
    setSlotValues(parseSlots);
  }, [raffle]);

  useEffect(() => {
    console.log(currentWinIndex);
  }, [currentWinIndex])


  /**
   * Calls to GoogleSheets API to retrieve list of valid people to enter raffle
   * sets the raffle array to this list retrieved
   */
  const fetchData = async () => {
    console.log('fetching!');
    const backendUrl = 'http://localhost:3001/api/get-google-sheet-data';

    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      const info = parseData(data);
      setRaffle(info); 
      return info;   
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchNumWinner = async () => {
    // creates the api query with the relevant information
    const backendUrl = `http://localhost:3001/api/get-num-winners`;
    console.log('getting the column to insert the winner');

    try {
      const response = await fetch(backendUrl);
      const data = await response.json();
      let count = currentWinIndex;
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

  const addProtectedData = async () => {
    console.log('protecting data');
    const backendUrl = 'http://localhost:3001/api/add-protection';

    try {
      const response = await fetch(backendUrl,{
        method: "POST"
      });
      const protectedId = await response.json();
      return protectedId;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const updateProtectData = async (dataProtected) => {
    console.log(`unprotecting Data: ${dataProtected}`);
    const backendUrl = `http://localhost:3001/api/remove-protection/${dataProtected}`;

    try {
      const response = await fetch(backendUrl, {
        method: "POST"
      });
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // goes through the data from the spreadsheet to properly run the raffle
  function parseData(data) {
    // only want to keep E(1) and F(2) which is name and email
    // also want to add extra tickets G(3)
    const output = [];
    for (let i = 0; i < data.length; i++) {
      // checks if the entry is both in the venue and has yet to win
      if ((data[i][4] === "TRUE") && (data[i][5] === "FALSE") && ((raffleSlot === "all") || (data[i][6] === raffleSlot))) {
        // accounts for any extra tickets that the entry has
        for (let j = 0; j < parseInt(data[i][3]) + 1; j++) {
          output.push([data[i][1], data[i][2], data[i][0], parseInt(i) + 2]);
        }
      }
    }
    return shuffle(output);
  }

  const updateData = async () => {
    // creates the api query with the relevant information
    const backendUrl = `http://localhost:3001/api/add-winner/${winner[3]}/${currentWinIndex}/${winner[0]}/${winner[1]}/${winner[2]}`;
    console.log('updating the data by adding the winner ' + backendUrl)
    try {
      const response = await fetch(backendUrl,{
        method: "POST"
      });
      //const data = await response.json();
      setCurrentWinIndex(currentWinIndex + 1); 
      console.log("i am not smart")
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const rollNames = async (raffleNames) => {
    console.log('rolling');
    // picks a random index to start the spin
    var start = Math.floor(Math.random() * raffleNames.length); 
    // the number of times to spin the wheel, with built in spin so that it always looks like it spins 
    var spins = Math.floor(Math.random() * 20) + 53; 
    for (let i = start; i <= start + spins; i++) {
      let delay = 0.05;
      // checks if there is less than 20 spins left, then starts to slow down the spin
      if (i >= start + spins - 20) {
        delay = (0.05 + (0.02 * (i - (start + spins - 20)) / 5)); //slows down the spin by 0.004 seconds.
      }
            
      await new Promise ( resolve => { 
        gsap.to(".slot", { // animates a slide downward
          duration: delay, // Animation duration in seconds
          y: "+=4vw", // Move each element down by one slot
          ease: "power4.out", // Easing function 
          // after roll completed, resets the divs with new values, i.e. slot2 goes back to its original place, but with the value of the old slot3 so the roll is complete
          onComplete: () => {
            const shiftedSlots = [];
            for (let j = slotValues.length; j > 0; j--) {
              //console.log(parsedData[(i + j - (slotValues.length / 2)) % parsedData.length][0]);
              let index = (i + j - (slotValues.length / 2));
              shiftedSlots.push(raffleNames[(index >= 0 ? index : raffleNames.length + index) % raffleNames.length][0]);
            }
            setSlotValues(shiftedSlots);
            gsap.set(".slot", { //set resets the slots to their original place
              y: "-=4vw"
            })
            resolve();
          }
        });
      });
      gsap.killTweensOf('.slot');
    }

    // gets winning index and sets the winner to be the string at that index
    let winIndex = (start + spins + 1) % raffleNames.length;
    console.log("win Index: " + winIndex);
    setWinner(raffleNames[winIndex]);
  }

  // creates array of numbers 1-10 to be used to create the slots
  const numbers = [];
  for (let i = 0; i < 10; i++) {
    numbers.push(i);
  }

  const handleAnimationClick = async () => {
    setIsButtonDisabled(true);
    //const protectedId = await addProtectedData();
    const updatedRaffle = await fetchData();
    console.log(updatedRaffle);
    console.log('Updated Raffle:')
    
    await rollNames(updatedRaffle);
    await sleep(1000);
  
    setIsButtonDisabled(false);
    openModal();
    //updateProtectData(protectedId);
  };  

  return (
    <div className="raffle">

        <div className ="Animation">
          <AnimationRenderer
              onAnimate={handleAnimationClick}
              staticSrc={animationStatic}
              gifSrc={animation}
              animationDuration={6480} // Example: 5000 milliseconds for a 5-second GIF
              isButtonDisabled={isButtonDisabled}
              setIsButtonDisabled={setIsButtonDisabled}
          />
        </div>

        <div className = "frame">
            <img id="slotframe" src={raffleFrame} alt="Raffle Frame" />
            <div className="raffleBody">
              {numbers.map((number) => (
                <Slot key={number} value={slotValues[number]} slotNumber={number} />
              ))}
          </div>       
        </div> 
        <div className="raffleSlotSign">
          <RaffleSlot
            raffleSlot={raffleSlot}
            setRaffleSlot={setRaffleSlot}
            isDisabled={isButtonDisabled}
          />
        </div>
        <div className="LowerRaffle">
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

export default App;
