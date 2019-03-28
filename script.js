//The random word to be used in the game.
var randomWord;

//The words to be used in the game.
var words;

//count of incorrect letters guesses....
var amountOfIncorrectChars

//letters already guessed by user
var alreadyUsedChars;

//the answer in array form
var answerArray;

//array of the word as game progresses
var userAnswer;

//bool for if user has guessed the answer
var isGameOver;
//alert box which pops up when game is over
var gameOverMsgAlert;

var guessesLeft;

window.onload = function() {
    $("button.keyBoardKey").attr("disabled", true);
    gameOverMsgAlert = document.getElementById("gameOverMsgAlert");
    gameOverMsgAlert.style.visibility = "hidden"

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

    gameOverMsgAlert.style.visibility = "hidden"

    randomWord = getRandomWord();
    randomWordLength = randomWord.length;
    userString = getDashedString(randomWord);
    document.getElementById("userString").value = userString;

    $("button.keyBoardKey").attr("disabled", false);
}

//Gets a random word from the list of words.
function getRandomWord() {
    var word = words[Math.floor(Math.random() * words.length)];

    answerArray = word.split('')
    // console.log(answerArray)
    // alert(word)
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
function userGuessLetter(keyPressedLetter) {
    if (!isGameOver) {
        //update UI with how many incorrect guesses left


        var userGuessedChar = keyPressedLetter.toLowerCase();

        // console.log(userGuessedChar)

        if (answerArray.includes(userGuessedChar)) {
            //check if letter is in answer word 
            for (var i = 0; i < answerArray.length; i++) {
                if (answerArray[i] == userGuessedChar) {
                    userAnswer[i] = userGuessedChar
                }
            }
            updateUiAnswer()
            // console.log(userAnswer)
        } 
        else { //guessedChar is not in the answer
            amountOfIncorrectChars += 1
            guessesLeft--;
            // console.log("Sorry", userGuessedChar, "is not in the answer")
        }


        if (!alreadyUsedChars.includes(userGuessedChar)) {
            alreadyUsedChars.push(userGuessedChar)
            
            //disable keys already used
            var keyBoardKeyId = "#key" + userGuessedChar.toUpperCase();
            $(keyBoardKeyId).attr("disabled", true);
        }
        document.getElementById("incorrectGuessesLeftCount").innerHTML = guessesLeft;
        // console.log(alreadyUsedChars)

        checkIsGameOver = checkGameOver(answerArray, amountOfIncorrectChars)
        if (checkIsGameOver[0]) {
            isGameOver = true;
            $(keyBoardKeyId).attr("disabled", true);
            displayGameOverMsg(checkIsGameOver[1]);
        } 
    }
}

//checks if game is over
function checkGameOver(answerArray, amountOfIncorrectChars) {
    if (userAnswer.toString() === answerArray.toString()) {
        // console.log(true)
        return [true, 0]; //0 = you win
    } else if (amountOfIncorrectChars === 5) {
        // console.log(true)
        return [true, 1]; //1 = you lost
    } else {
        // console.log(false)
        return [false, 2]; //continue playing
    }
}

//when game is over, display win or loss msg to UI
function displayGameOverMsg(gameOverMsg) {
    var gameOverMsgAlert = document.getElementById("gameOverMsgAlert");
    if (gameOverMsg == 0) {
        gameOverMsgAlert.className = "alert alert-success"
        gameOverMsgAlert.style.visibility = "visible"
        gameOverMsgAlert.innerHTML = "You Win! click 'Start Game' to play again."
    }
    else {
        gameOverMsgAlert.className = "alert alert-danger"
        gameOverMsgAlert.style.visibility = "visible"
        gameOverMsgAlert.innerHTML = "Nice Try! the answer was " + randomWord + " click 'Start Game' to play again."
    }
}

