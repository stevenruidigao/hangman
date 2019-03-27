//The random word to be used in the game.
var randomWord;

//The words to be used in the game.
var words = ["chicken", "horse", "cow"];

//count of incorrect letters guesses
var amountOfIncorrectChars

//letters already guessed by user
var alreadyUsedChars;

//the answer in array form
var answerArray;

//array of the word as game progresses
var userAnswer;

//bool for if user has guessed the answer
var isGameOver;


//Starts the game.
function startGame() {
    amountOfIncorrectChars = 0;
    alreadyUsedChars = [];
    userAnswer = [];
    answerArray = []
    isGameOver = false;

    randomWord = getRandomWord();
    randomWordLength = randomWord.length;
    userString = getDashedString(randomWord);
    document.getElementById("startGame").disabled = true;
    document.getElementById("userString").value = userString + " (" + randomWordLength + ")";

    userGuessLetter()
}

//Resets the game.
function resetGame() {
    alert("reset game");
    document.getElementById("startGame").disabled = false;
}

//Gets a random word from the list of words.
function getRandomWord() {
    var word = words[Math.floor(Math.random() * words.length)];

    answerArray = word.split('')
    console.log(answerArray)

    return word;
}

//Gets an string with underscores.
function getDashedString(word) {
    var string = "";
    for (var i = 0; i < word.length; i++) {
        string += "?";
        userAnswer.push("?")
    }
    return string;
}

//updates the disabled input with the current user answer
function updateUiAnswer() {
    document.getElementById("userString").value = userAnswer.join('');
}

//user guesses letter 
//then, checks if guess in word
function userGuessLetter() {
    if (!isGameOver) {
        var guessesLeft = 5 - amountOfIncorrectChars;
        console.log("Letters already used: ", alreadyUsedChars)
        console.log("Incorrect guesses left: " + guessesLeft)

        var userGuessedChar = prompt("Guess a letter")

        if (alreadyUsedChars.includes(userGuessedChar)) {
            //check if user already guessed inputted letter
            console.log("You have already guessed that letter")
            userGuessLetter(answerArray, amountOfIncorrectChars)
        } else if (answerArray.includes(userGuessedChar)) {
            //check if letter is in answer word 
            for (var i = 0; i < answerArray.length; i++) {
                if (answerArray[i] == userGuessedChar) {
                    userAnswer[i] = userGuessedChar
                }
            }
            alreadyUsedChars.push(userGuessedChar)
            updateUiAnswer()
            console.log(userAnswer)
        } else { //guessedChar is not in the answer
            amountOfIncorrectChars += 1
            console.log("Sorry", userGuessedChar, "is not in the answer")
        }

        if (!alreadyUsedChars.includes(userGuessedChar)) {
            alreadyUsedChars.push(userGuessedChar)
        }

        checkIsGameOver = checkGameOver(answerArray, amountOfIncorrectChars)
        if (!checkIsGameOver[0]) {
            userGuessLetter(answerArray, amountOfIncorrectChars)
        } else {
            // console.log(checkIsGameOver[1])
            isGameOver = true;
            alert("game over")
        }
    }
}

function checkGameOver(answerArray, amountOfIncorrectChars) {
    if (userAnswer.toString() === answerArray.toString()) {
        console.log(true)
        return [true, "You won!"];
    } else if (amountOfIncorrectChars === 5) {
        console.log(true)
        return [true, "You lost!"];
    } else {
        console.log(false)
        return [false, "ok"];
    }
}

