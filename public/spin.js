let names = [];
let slots = [];
const numSlots = 7;
const minRoll = 40;

//adds delay to functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function rollNames() {
    var start = Math.floor(Math.random() * names.length); //what the index of the start is
    var spins = Math.floor(Math.random() * names.length) + minRoll; // the number of times to spin the wheel      

    // to implement a slot machine wheel, the lowest value has to be the first index, and we need a buffer of length//2 to get the value in the middle
    // need to think about storing a variable in order to reset the placement of the 
    await gsap.set(".slot", {
        top: "50vh", // Move elements down by random variable so that arrow appears to be smoother
    });

    //include a spin animation and then do this manual spin so that it looks like wheel is slowing down
    for (let i = start; i <= start + spins; i++) {
        let delay = 0.05;
        if (i >= start + spins - 30) {
            delay = (0.05 + (0.02 * (i - (start + spins - 30)) / 5));
        }
        // roll down starting from the top
        await gsap.to(".slot", {
            duration: delay, // Animation duration in seconds
            y: "+=10vh", // Move each element down by one slot
            ease: "power4.out", // Easing function 
            // after roll completed, resets the divs with new values, i.e. slot2 goes back with the value of the old slot3 so the roll is complete
            onComplete: () => {
                for (let j = numSlots; j > 0; j--) {
                    var dynamicTextElement = document.getElementById("slot" + (numSlots + 1 - j));
                    if (dynamicTextElement) {
                        // subtract half of slots to get it into the center of the slots
                        dynamicTextElement.textContent = names[(i + j - 4) % names.length] ;
                    }
                }
                gsap.set(".slot", {
                    y: "-=10vh"
                })
            }
        });        
    }

    // move this to be outside the for loop -1 so that it looks smoother transition
    /* looks extremely bad rn, should be implemented inside of the main loop, so that it looks more complete, need to alter clip paths as well for this to look right.
    await gsap.to(".slot", {
        duration: 1, // Animation duration in seconds
        y: "+="+(Math.random() * 6)+"vh", // Move elements down by random variable so that arrow appears to be smoother
        ease: "power4.out", // Easing function
    });*/
    await sleep(50);
    
    alert (names[(start + spins) % names.length] + " has won!");
    
    // remove winner
    names.splice((start + spins) % names.length, 1);
}

// generate
async function startState() {
    // fills array on start
    names = Array.from(Array(200).keys(), n => n + 1);

    for (let i = 1; i <= numSlots; i++) {
        var dynamicTextElement = document.getElementById("slot" + i)
        if (dynamicTextElement) {
            var dynamicText = i;
            dynamicTextElement.textContent = dynamicText;
            slots.push(dynamicTextElement);
        }
        console.log(i);
        await sleep(25);
    }
}

window.onload = startState;

// this will be for the input
