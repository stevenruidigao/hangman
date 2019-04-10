//The random word to be used in the game.
var randomWord;

//The words to be used in the game.
var words;

//Count of incorrect letter guesses.
var amountOfIncorrectChars;

//Letters already guessed by the user.
var alreadyUsedChars;

//Answer in array form.
var answerArray;

//Array of the word as the game progresses.
var userAnswer;

//If the user has guessed the answer.
var isGameOver;

//Alert box which pops up when the game is over.
var gameOverMsgAlert;

//Amount of guesses left for the user.
var guessesLeft;

//Runs when the index.html file loads.
window.onload = function() {
    $("button.keyBoardKey").attr("disabled", true);
    gameOverMsgAlert = document.getElementById("gameOverMsgAlert");
    gameOverMsgAlert.style.visibility = "hidden";

    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "words.txt", false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                words = allText.split(/\r\n|\r|\n/);
            }
        }
    }
    rawFile.send(null);
}

//Starts the game.
function startGame() {
    amountOfIncorrectChars = 0;
    alreadyUsedChars = [];
    userAnswer = [];
    answerArray = []
    isGameOver = false;
    guessesLeft = 5;

    gameOverMsgAlert.style.visibility = "hidden";

    randomWord = getRandomWord();
    randomWordLength = randomWord.length;
    userString = getDashedString(randomWord);
    document.getElementById("userString").value = userString;

    $("button.keyBoardKey").attr("disabled", false);
}

//Gets a random word from the list of words.
function getRandomWord() {
    var word = words[Math.floor(Math.random() * words.length)];
    answerArray = word.split('');
    return word;
}

//Gets a string with underscores.
function getDashedString(word) {
    var string = "";
    for (var i = 0; i < word.length; i++) {
        string += "?";
        userAnswer.push("?");
    }
    return string;
}

//Updates the disabled input with the current user answer.
function updateUiAnswer() {
    document.getElementById("userString").value = userAnswer.join('');
}

//After the user guesses a letter, we check if the guess is in the word.
function userGuessLetter(keyPressedLetter) {
    if (!isGameOver) {
        //Update interface with how many incorrect guesses left.
        var userGuessedChar = keyPressedLetter.toLowerCase();

        if (answerArray.includes(userGuessedChar)) {
            //Check if letter is in answer word.
            for (var i = 0; i < answerArray.length; i++) {
                if (answerArray[i] == userGuessedChar) {
                    userAnswer[i] = userGuessedChar;
                }
            }
            updateUiAnswer();
        } else {
            //Guessed character is not in the answer.
            amountOfIncorrectChars += 1;
            guessesLeft--;
        }

        if (!alreadyUsedChars.includes(userGuessedChar)) {
            alreadyUsedChars.push(userGuessedChar);
            
            //Disable keys already used.
            var keyBoardKeyId = "#key" + userGuessedChar.toUpperCase();
            $(keyBoardKeyId).attr("disabled", true);
        }

        document.getElementById("incorrectGuessesLeftCount").innerHTML = guessesLeft;

        checkIsGameOver = checkGameOver(answerArray, amountOfIncorrectChars);

        if (checkIsGameOver[0]) {
            isGameOver = true;
            $(keyBoardKeyId).attr("disabled", true);
            displayGameOverMsg(checkIsGameOver[1]);
        } 
    }
}

//Checks if game is over.
function checkGameOver(answerArray, amountOfIncorrectChars) {
    if (userAnswer.toString() === answerArray.toString()) {
        return [true, 0]; //Win.
    } else if (amountOfIncorrectChars === 5) {
        return [true, 1]; //Lost.
    } else {
        return [false, 2]; //Continue playing.
    }
}

//When game is over, display win or loss message to user interface.
function displayGameOverMsg(gameOverMsg) {
    var gameOverMsgAlert = document.getElementById("gameOverMsgAlert");
    if (gameOverMsg == 0) {
        gameOverMsgAlert.className = "alert alert-success";
        gameOverMsgAlert.style.visibility = "visible";
        gameOverMsgAlert.innerHTML = "You are a winner! Click the button to play again.";
    } else {
        gameOverMsgAlert.className = "alert alert-danger";
        gameOverMsgAlert.style.visibility = "visible";
        gameOverMsgAlert.innerHTML = "You are a complete failure! The answer was " + randomWord + ". Click the button to play again.";
    }
}