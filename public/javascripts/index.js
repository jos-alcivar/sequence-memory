'use strict'

let level = 0;
let score = 0;
let i = 0;
let bananas = 3;
let lifes = "🍌🍌🍌";
let itemSequence = [];
let userSequence = [];
let sequenceLength = 2;
const durationArray = [1250, 650, 430, 210];

// Define DOM variables
const classGrid = document.querySelectorAll('.grid__item');
const idScore = document.querySelector('#score');
const idLives = document.querySelector('#lives');

idLives.textContent = lifes;

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
let randomArray = generateRandomNumbers(classGrid.length).slice(0, sequenceLength);
console.log('random array generated ' + randomArray);

// Display random array in the grid 
function populateGrid(randomArray) {
    randomArray.forEach((number, index) => {
        classGrid[number - 1].textContent = `${index + 1}`;
        classGrid[number - 1].classList.add('display__numbers');
        itemSequence.push(classGrid[number - 1]);
    });
}
populateGrid(randomArray);

// Add Click event on all the grid items
classGrid.forEach((item, index) => {
    item.addEventListener('click', function(){
        
        // Check for the first click to hide the numbers
        if (userSequence.length === 0) {
            setTimeout(hideNumbers(itemSequence), durationArray[0]);
        }
        
        // Check answers        
        let item_id = Number(item.id.split("-").pop());
        userSequence.push(item_id);
        console.log('user guesses ' + userSequence);
        checkAnswer(item_id);
        
        if (i === randomArray.length) {
            console.log('ready for next level')
            clearNumbers(itemSequence);
            sequenceLength++;
            level++;
            i = 0;
            itemSequence = [];
            userSequence = [];
            randomArray = generateRandomNumbers(classGrid.length).slice(0, sequenceLength);
            console.log('new random array generated ' + randomArray);
            populateGrid(randomArray);
        }

    })
});


// Hide numbers on the grid
function hideNumbers(itemSequence) {
    itemSequence.forEach((item) => {
        item.textContent = '';
        item.classList.replace('display__numbers', 'hide__numbers');
    })
}

// Remove numbers on the grid
function clearNumbers(itemSequence) {
    itemSequence.forEach((item) => {
        item.textContent = '';
        item.classList.remove('display__numbers', 'hide__numbers');
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
        idScore.textContent = `${score}`;
    } else {
        // Reduce bananas if guess is wrong
        if (bananas > 1) {
            bananas--;
        } else {
            // Game Over
            console.log('You are out of bananas!');
        }

        lifes = lifes.slice(0, -2);
        if (lifes.length > 0) {
            idLives.textContent = lifes;
        } else {
            idLives.textContent = "Game over";
        }
    } 
    
}

// Restart game
function restartGame() {
    clearNumbers(itemSequence);
    sequenceLength++;
    level++;
    i = 0;
    itemSequence = [];
    userSequence = [];
    randomArray = generateRandomNumbers(classGrid.length).slice(0, sequenceLength);
    console.log('new random array generated ' + randomArray);
    populateGrid(randomArray);
}

