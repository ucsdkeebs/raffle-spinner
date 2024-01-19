import logo from './logo.svg';
import './App.css';
import { Button } from '@mui/material';
import {state, useState} from 'react';
import gsap from 'gsap';

function App() {
  return (
    <div class="raffle">
        <div class="raffleBody">
            <Edge type="top"/>
            <Slot slotNumber="0"/>
            <Slot slotNumber="1"/>
            <Slot slotNumber="2"/>
            <Slot slotNumber="3"/>
            <Slot slotNumber="4"/>
            <Slot slotNumber="5"/>
            <Slot slotNumber="6"/>
            <Slot slotNumber="7"/>
            <Slot slotNumber="8"/>
            <Slot slotNumber="9"/>
            <Edge type="bottom"/>
            <Triangle/>
        </div>

        <div class="LowerRaffle">
            <button id="roll" onclick="rollNames()">Spin</button>
        </div>
        
        <SelectOption/>
    </div>
    
  );
}

function Slot({value, slotNumber}){
  const slotID = "slot"+ slotNumber;
  const [val, setVal] = useState(value);
  return (
    <div id={slotID} class="slot">{val}</div>
  );
}

function Edge({type}){
  return (
    <div id={type} class="edge"></div>
  );
}

function Triangle(){
  return (
    <div class="triangle"></div>
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
