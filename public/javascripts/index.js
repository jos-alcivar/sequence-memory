'use strict'

let level = 1;
let score = 0;
let i = 0;
let a = 0;
let bananas = 3;
let lifes = "🍌🍌🍌";
let itemSequence = [];
let userSequence = [];
let sequenceLength = 1;
const durationArray = [1250, 650, 430, 210];
const correctSound = new Audio(`/assets/sounds/correctSound.wav`);
const errorSound = new Audio(`/assets/sounds/errorSound.wav`);
const gameOverSound = new Audio(`/assets/sounds/chimpSound.mp3`)

// Define DOM variables
const classGrid = document.querySelectorAll('.grid__item');
const idScore = document.querySelector('#score');
const idLives = document.querySelector('#lives');
const popup = document.querySelector('.popup');
const formScore = document.getElementById('form-score');
const formMain = document.getElementById('form-main');
const formClose = document.getElementById('form-close');

idLives.textContent = lifes;

// Function to format the number to always have 3 digits
function formatToThreeDigits(number) {
    return number.toString().padStart(3, '0');
}

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
classGrid.forEach((item) => {
    item.addEventListener('click', function(){
        
        // Check the level to decrease the duration
        if (level <= 5) {
            a = 0;
        } else if (level <=10){
            a = 1;
        } else if (level <=15){
            a = 2;
        } else {
            a = 3;
        }

        // Check for the first click to hide the numbers
        if (userSequence.length === 0) {
            setTimeout(hideNumbers(itemSequence), durationArray[a]);
        }
        
        // Check answers        
        let item_id = Number(item.id.split("-").pop());
        userSequence.push(item_id);
        checkAnswer(item_id, item);
        
        if (i === randomArray.length) {
            if (sequenceLength <=8) {
                sequenceLength++;
            }
            level++;
            console.log(`You passed to level ${level}`)
            restartGame();
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
function checkAnswer(item_id, item) {
    // Increase score if guess is right
    if ( item_id === randomArray[i]) {
        i++;
        score++;
        correctSound.play();
        item.classList.remove('display__numbers', 'hide__numbers');
        idScore.textContent = `${formatToThreeDigits(score)}`;        
    } else {
        // Reduce bananas if guess is wrong
        errorSound.play()
        
        lifes = lifes.slice(0, -2);
        if (lifes.length > 0) {
            idLives.textContent = lifes;
        } else {
            idLives.textContent = "Game over!";
            gameOverSound.play();
            disableElements();
            sequenceLength = 1;
            setTimeout(saveScore(score), 500);
        }
    }    
}

// Restart game
function restartGame(restartScore) {
    clearNumbers(itemSequence);
    i = 0;
    itemSequence = [];
    userSequence = [];
    randomArray = generateRandomNumbers(classGrid.length).slice(0, sequenceLength);
    populateGrid(randomArray);

    if (restartScore) {
        level = 1;
        score = 0;
        lifes = "🍌🍌🍌";
        idLives.textContent = lifes;
        idScore.textContent = '---';
        enableElements();
    }
}

// Enable click events
function enableElements() {
    classGrid.forEach((item) => {
        item.classList.remove('disabledElement');
    });
}

// Disable click events
function disableElements() {
    classGrid.forEach((item) => {
        item.classList.add('disabledElement');
    });
}

// Call form to save score
function saveScore(score){
    // Display pop up window
    clearNumbers(itemSequence);
    console.log(itemSequence);
    const userScore = `${formatToThreeDigits(score)}`;
    formScore.textContent = userScore;
    popup.classList.add('display__popup');

    // Add eventListener to submit btn
    formMain.addEventListener('submit', async function(event) {
        event.preventDefault();

        const user = document.getElementById('form-text').value;

        // Check if user has filled the input text
        if (user) {
            const userData = {
                name: user,
                score: userScore
            }

            // Create method and actions
            try {
                const response = await fetch('/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                console.log('Success:', data);
            } catch (error) {
                console.log('Error:', error);
            }
            // Reload page
            location.reload();

        } else {
            alert('Please write a name before submit!')
        }
    });

    // Add eventListener to close btn
    formClose.addEventListener('click', () => {
        popup.classList.remove('display__popup');
        restartGame(true);
    });
}