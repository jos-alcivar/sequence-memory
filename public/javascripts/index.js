'use strict'

let level = 0;
let score = 0;
let i = 0;
let bananas = 3;
let itemSequence = [];
let userSequence = [];
let sequenceLength = 2;
const durationArray = [1250, 650, 430, 210];

// Select all the grid items
const grid = document.querySelectorAll('.grid__item');

// Generate an array with random numbers
function generateRandomNumbers(arrayLength) {
    var numbers = [];

    while (numbers.length < arrayLength) {
        var randomNumber = Math.floor(Math.random() * arrayLength) + 1;

        // Check if the random number is already in the array
        if (!numbers.includes(randomNumber)) {
            numbers.push(randomNumber); // If not, add it to the array
        }
    }

    return numbers;
}

// Modify the random array length by level
let randomArray = generateRandomNumbers(grid.length).slice(0, sequenceLength);
console.log(randomArray);

// Display random array in the grid 
randomArray.forEach((number, index) => {
    grid[number - 1].textContent = `${index + 1}`;
    grid[number - 1].classList.add('display__numbers');
    itemSequence.push(grid[number - 1]);
});

// Add Click event on all the grid items
grid.forEach((item, index) => {
    item.addEventListener('click', function(){
        
        // Check for the first click to hide the numbers
        if (userSequence.length === 0) {
            setTimeout(hideNumbers(itemSequence), durationArray[0]);
        }
        
        // Check answers
        
        let item_id = Number(item.id.split("-").pop());
        userSequence.push(item_id);
        console.log(userSequence);
        checkAnswer(item_id);
        
        if (i === randomArray.length) {
            console.log('ready for next level')
            sequenceLength++;
            level++;
            i = 0;
            itemSequence = [];
            userSequence = [];
        }

    })
});


// Hide numbers from the grid
function hideNumbers(itemSequence) {
    itemSequence.forEach((item) => {
        item.textContent = '';
        item.classList.replace('display__numbers', 'hide__numbers');
    })
}

// Check answer
function checkAnswer(item_id) {
    // Increase score if guess is right
    if ( item_id === randomArray[i]) {
        console.log(userSequence[i]);
        console.log(randomArray[i]);
        i++;
        score++;
    } else {
        // Reduce bananas if guess is wrong
        if (bananas > 1) {
            bananas--;
        } else {
            // Game Over
            console.log('You are out of bananas!');
        }
    }
    console.log('Score ' + score);
    console.log('Bananas ' + bananas);
    console.log('i ' + i);
    
    
}

console.log(userSequence);
console.log(randomArray);

