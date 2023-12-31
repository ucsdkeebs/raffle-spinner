let names = [];
const numSlots = 10;
const minRoll = 73; //minimum to have the roll speed be 5.5 seconds

//adds delay to functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function to spin the wheel
async function rollNames() {
    closeModal();
    var start = Math.floor(Math.random() * names.length); // picks a random index to start the spin
    var spins = Math.floor(Math.random() * 20) + minRoll; // the number of times to spin the wheel, with built in spin so that it always looks like it spins 
    
    // iterates for the number of spins
    for (let i = start; i <= start + spins; i++) {
        let delay = 0.05;
        // checks if there is less than 30 spins left, then starts to slow down the spin
        if (i >= start + spins - 30) {
            delay = (0.05 + (0.02 * (i - (start + spins - 30)) / 5)); //slows down the spin by 0.004 seconds.
        }
        // 
        await gsap.to(".slot", { // animates a slide downward
            duration: delay, // Animation duration in seconds
            y: "+=8vh", // Move each element down by one slot
            ease: "power4.out", // Easing function 
            // after roll completed, resets the divs with new values, i.e. slot2 goes back to its original place, but with the value of the old slot3 so the roll is complete
            onComplete: () => {
                for (let j = numSlots; j > 0; j--) {
                    var dynamicTextElement = document.getElementById("slot" + (numSlots - j)); // finds each of the slots
                    if (dynamicTextElement) {
                        // sets the content of the slot to new value, subtracts half of the numSlots, so that the winning value is in the middle
                        dynamicTextElement.textContent = names[(i + j - (numSlots / 2)) % names.length] ;
                    }
                }
                gsap.set(".slot", { //set resets the slots to their original place
                    y: "-=8vh"
                })
            }
        });        
    }

    await sleep(50); // delay to make the animation smoother
    
    let winIndex = (start + spins) % names.length; //gets the winning index to be displayed/removed
    //alert (names[winIndex] + " has won!");
    openModal(names[winIndex]);
    
    // sets button to remove winner
    //consider on resetting the display so that the wheel doesnt show the winner anymore
    var removeWinButton = document.getElementById("removeWinner");
    removeWinButton.onclick = function() {
        names.splice(winIndex, 1);
        closeModal();
    };

    // sets button to empty list
    var removeAllButton = document.getElementById("removeAll");
    removeAllButton.onclick = function() {
        names = new Array();
        closeModal();
    };
}

// default start
async function startState() {
    // fills array on start
    names = Array.from(Array(1000).keys(), n => n + 1);
    // shuffles the numbers in an array
    shuffle(names);

    for (let i = 0; i < numSlots; i++) {
        var dynamicTextElement = document.getElementById("slot" + i);
        if (dynamicTextElement) {
            // randomizes where to put the names on the wheel
            var dynamicText = names[Math.floor(Math.random()*names.length)];
            dynamicTextElement.textContent = dynamicText;
        }
        console.log(i);
        await sleep(25);
    }
}

// to shuffle our array on start
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

// closes pop up window
async function closeModal() {
    var modal = document.getElementById("winScreen");
    modal.style.display = "none";
}

// opens pop up window with winner and options
function openModal(winningNumber) {
    var modal = document.getElementById("winScreen");
    var dynamicTextElement = document.getElementById("modal-text");
    dynamicTextElement.textContent = winningNumber + " has won!"
    modal.style.display = "block";
}

window.onload = startState;