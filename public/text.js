function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const myArray = Array.from(Array(100).keys(), n => n + 1);

async function rollName() {
    var start = Math.floor(Math.random() * myArray.length); //what the index of the start is
    var spins = Math.floor(Math.random() * myArray.length) + myArray.length; // the number of times to spin the wheel      

    // to implement a slot machine wheel, the lowest value has to be the first index, and we need a buffer of length//2 to actually get the expected value in the middle

    //include a spin animation and then do this manual spin so that it looks like wheel is slowing down
    for (let i = start; i <= start + spins; i++) {
        // roll down starting from the top
        for (let j = 1; j <= 7; j++) {
            var dynamicTextElement = document.getElementById("slot" + j);
            if (dynamicTextElement) {
                // subtract 4 to get it into the center of the slots
                dynamicTextElement.textContent = myArray[(i + j - 4) % myArray.length] ;
            }
        }
        if (i < start + spins - 30) {
            await sleep(50);
        } else {
            await sleep(50 + (20 * (i - (start + spins - 30)) / 5));
        }
    }
    alert (myArray[(start + spins) % myArray.length] + " has won!");
}

async function roll() {
    console.log("test");
    for (let i = 1; i <= 7; i++) {
        var dynamicTextElement = document.getElementById("slot" + i)
        if (dynamicTextElement) {
            var dynamicText = i;
            dynamicTextElement.textContent = dynamicText;
        }
        console.log(i);
        await sleep(25);
    }
}

window.onload = roll;