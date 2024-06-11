// Déclaration des variables contenant les éléments HTML
const playButton = document.getElementById("play");
const greenColor = document.querySelector("#green");
const redColor = document.querySelector("#red");
const blueColor = document.querySelector("#blue");
const yellowColor = document.querySelector("#yellow");
const displayLevel = document.querySelector(".level");
const displayLooseMenu = document.querySelector(".loose");
const yesButton = document.querySelector(".button_yes");
const displayScore = document.querySelector(".score");
const centerWord = document.querySelector(".center");
const displayBestScore = document.querySelector(".best_score");

// Déclaration des fichiers audio
let yellowSound = new Audio('./sounds/simonSoundYellow.mp3');
let greenSound = new Audio('./sounds/simonSoundGreen.mp3');
let blueSound = new Audio('./sounds/simonSoundBlue.mp3');
let redSound = new Audio('./sounds/simonSoundRed.mp3');
let failedSound = new Audio('./sounds/simonSoundFailed.mp3');

// Déclaration des variables liées aux couleurs
let level = 1;
let userInput = [];
let levelColors = [];
let defaultColors = [
    "rgb(20, 20, 104)", //blue
    "rgb(134, 14, 14)", //red
    "rgb(14, 77, 14)", //green
    "rgb(107, 107, 18)" //yellow
];

let lightColors = [
    "rgb(104, 104, 255)", //blue light
    "rgb(255, 80, 80)", //red light
    "rgb(80, 255, 80)", //green light
    "rgb(255, 255, 80)" //yellow light
];

// Events
playButton.addEventListener("click", () => {
    launchLevel(level);
    playButton.style.visibility = "hidden";
    displayLevel.style.opacity = 1;
});

yesButton.addEventListener("click", () => {
    resetGame();
});

// affichage du meilleure score
let bestScore = localStorage.getItem("meilleure score");
if(bestScore) displayBestScore.innerHTML = `Meilleur score: ${bestScore}`;


// Déclaration des fonctions liées au jeu
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const resetColors = () => {
    blueColor.style.backgroundColor = defaultColors[0];
    redColor.style.backgroundColor = defaultColors[1];
    greenColor.style.backgroundColor = defaultColors[2];
    yellowColor.style.backgroundColor = defaultColors[3];
};

const addColor = () => {
    let randomNumber = getRandomInt(0, 3);

    switch (randomNumber) {
        case 0:
            levelColors.push("blue");
            break;
        case 1:
            levelColors.push("red");
            break;
        case 2:
            levelColors.push("green");
            break;
        case 3:
            levelColors.push("yellow");
            break;
        default:
            console.log("Un problème est survenu lors de la génération du numéro aléatoire.");
    }
};

const turnOnColor = (color) => {
    switch (color) {
        case "blue":
            blueColor.style.backgroundColor = lightColors[0];
            blueSound.play();
            break;
        case "red":
            redColor.style.backgroundColor = lightColors[1];
            redSound.play();
            break;
        case "green":
            greenColor.style.backgroundColor = lightColors[2];
            greenSound.play();
            break;
        case "yellow":
            yellowColor.style.backgroundColor = lightColors[3];
            yellowSound.play();
            break;
    }
    setTimeout(resetColors, 500);
};

const launchLevel = (level) => {
    addColor();
    closeInputs();
    for (let i = 0; i < level; i++) {
        setTimeout(() => {
            turnOnColor(levelColors[i]);
        }, i * 1000);
    };
    setTimeout(() => {
        openInputs();
    }, level * 1000);
    displayLevel.innerHTML= "niveau " + level;
}

const checkPlayerInput = (color) => {
    if (userInput[userInput.length - 1] === levelColors[userInput.length - 1]) {
        turnOnColor(color);
    } else {
        // partie terminée
        failedSound.play();
        displayLooseMenu.style.display = "block";
        displayScore.innerHTML = level;
        localStorage.setItem("meilleure score", level);
    }
};

const checkLevel = () => {
    // true si userInput et levelColors ont les mêmes valeurs
    const inputsSuccess = userInput.length === levelColors.length && userInput.every(function (value, index) {
        return value === levelColors[index];
    });

    if(inputsSuccess){
        level++;
        userInput = [];
        setTimeout(() => {
            launchLevel(level);
        }, 1500);
    }
}

const handleUpdateUserInput = (event) => {
    userInput.push(event.target.id);
    checkPlayerInput(event.target.id);
    if(userInput.length === levelColors.length){
        checkLevel();
    }
};

// fonction qui active le click sur les couleurs
const openInputs = () => {
    blueColor.addEventListener("click", handleUpdateUserInput);
    redColor.addEventListener("click", handleUpdateUserInput);
    greenColor.addEventListener("click", handleUpdateUserInput);
    yellowColor.addEventListener("click", handleUpdateUserInput);
    centerWord.innerHTML = "Jouez";
};
// fonction qui désactive le click sur les couleurs
const closeInputs = () => {
    blueColor.removeEventListener("click", handleUpdateUserInput);
    redColor.removeEventListener("click", handleUpdateUserInput);
    greenColor.removeEventListener("click", handleUpdateUserInput);
    yellowColor.removeEventListener("click", handleUpdateUserInput);
    centerWord.innerHTML = "Patientez";
};

const resetGame = () => {
    resetColors();
    level = 1;
    userInput = [];
    levelColors = [];
    playButton.style.visibility = "visible";
    displayLooseMenu.style.display = "none";
    displayLevel.innerHTML = "Niveau 1";    
    let bestScore = localStorage.getItem("meilleure score");
    displayBestScore.innerHTML = `Meilleur score: ${bestScore}`;
}