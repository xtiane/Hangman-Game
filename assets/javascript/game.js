var titleList = ["Super Mario Bros",
								"The Legend of Zelda",
								"Portal",
								"Half Life",
								"Super Metroid",
								"Halo",
								"Tetris",
								"Super Mario World",
								"Chrono Trigger",
								"Minecraft",
								"Grand Theft Auto",
								"Baldurs Gate",
								"Deus Ex",
								"Street Fighter",
								"Super Mario Galaxy",
								"Star Wars TIE Fighter",
								"Metal Gear Solid",
								"Castlevania",
								"Final Fantasy",
								"Red Dead Redemption",
								"Rock Band",
								"World of Warcraft",
								"BioShock",
								"Silent Hill",
								"Journey",
								"Resident Evil",
								"Diablo",
								"Pac Man",
								"Mrs Pac Man",
								"Contra",
								"Dig Dug",
								"Mortal Kombat",
								"Tekken",
								"Pokemon",
								"Call of Duty",
								"Fallout",
								"Donkey Kong",
								"Tony Hawks Pro Skater",
								"Sonic The Hedgehog",
								"Galaga"];

// For debug only
/*var titleList = ["Star Wars TIE Fighter"];*/

var isGuessInProgress = false;
var currentTitle;
var titleGuessProgress = [];
var guessStack = [];
var numberOfGuessesRemaining;
var totalCorrect = 0;
var totalToWin = 0;
var totalWins = 0;

var titleToGuessDiv;
var userGuessListDiv;
var guessesRemainingDiv;
var winLoseDiv;
var winsDiv;
var insertCoinAudio;
var loseGameAudio;
var winGameAudio;
var correctAudio;

// Entry point
function startGame() {
	initializeElements();

	// Event listener
	document.onkeyup = function(event) {
		var userGuess = event.key;

		if(keyValidation(userGuess)) {
			if(isGuessInProgress) {
				playGame(userGuess);
			}
			else {
				resetGame();
			}
		}
	};

	return;
}

// Initializes variables used to access DOM elements
function initializeElements() {
	titleToGuessDiv = document.getElementById('title-to-guess');
	userGuessListDiv = document.getElementById('user-guesses');
	guessesRemainingDiv = document.getElementById("remaining-guesses");
	winLoseDiv = document.getElementById("win-lose");
	winsDiv = document.getElementById("wins");
	insertCoinAudio = document.getElementById("insert-coin");
	loseGameAudio = document.getElementById("lose-game");
	winGameAudio = document.getElementById("win-game");
	correctAudio = document.getElementById("correct");

	return;
}

// Checks if user input is a prohibited key
function keyValidation(userGuess) {
	if(userGuess === 'Meta' ||
			userGuess === '-' ||
			userGuess == ' ') {
		return false;
	}

	return true;
}

// Contains logic to play the game
function playGame(userGuess) {
	// If the user has already guessed this letter, skip processing
	if(letterAlreadyGuessed(userGuess)) {
		return;
	}

	checkUserGuess(userGuess);

	displayTitleGuessProgress();

	updateUserGuesses(userGuess, false);

	updateNumberOfGuessesRemaining(false, 0);

	if(isWinner()) {
		// Debug only
		//console.log('isWinner is true');

		// Play win game audio
		winGameAudio.play();

		// Display winner
		showWinOrLose(true);

		//Update wins counter
		totalWins++;

		//Update wins display
		updateElementTextContent(winsDiv, totalWins, false);

		isGuessInProgress = false;
	} else if(!moreGuessesAllowed()) {
		// Play lose game audio
		loseGameAudio.play();

		// Display lose
		showWinOrLose(false);
		
		isGuessInProgress = false;
	} else {
		isGuessInProgress = true;
	}

	return;
}

// Contains logic to setup a new game
function resetGame() {
	// Play insert coin audio
	insertCoinAudio.play();

	// Hide the win/lose div element
	showHideElement(winLoseDiv, false);

	// Clear user guesses display
	updateElementTextContent(userGuessListDiv, '', false);

	// Update wins display back to 0
	updateElementTextContent(winsDiv, totalWins, false);

	// Update guesses remaining display
	updateElementTextContent(guessesRemainingDiv, numberOfGuessesRemaining, false);

	setupNewTitle();

	// Reset number of guesses remaining
	updateNumberOfGuessesRemaining(true, 15);

	// Called to clear the guess stack
	updateUserGuesses('', true);

	// At this point the progress should be set to all underscores
	displayTitleGuessProgress();

	isGuessInProgress = true;

	return;
}

// Sets up a new title for user to guess by randomly choosing from the title list array
function setupNewTitle() {
	// Reset total correct counter
	totalCorrect = 0;

	// Choose a title for user to guess
	currentTitle = titleList[Math.floor(Math.random() * titleList.length)];

	// For Debug Only
	//console.log(currentTitle);
	//console.log(currentTitle);
	//console.log("> " + currentTitle.length);

	// Since this is a new title setup the display div
	updateElementTextContent(titleToGuessDiv, '', false);

	// Clear the title guess progress array
	titleGuessProgress = [];

	// Setup the guess progress array
	// If the word contains spaces, increment the correct guess counter
	for(var i=0; i<currentTitle.length; i++) {
		if(currentTitle.charAt(i) === ' ') {
			// DEBUG only
			//console.log('Space found in title!');

			// Push a dash as separator
			titleGuessProgress.push('-');

			totalCorrect++;
		} else {
			titleGuessProgress.push('_');	 
		}
	}

	// Set the total to win value
	totalToWin = currentTitle.length;

	return;
}

// Updates the guess progress display
function displayTitleGuessProgress() {

	//console.log(titleGuessProgress);

	// Since titles can contain spaces, we want the spaces treated as new lines in the display
	for(var i=0; i<titleGuessProgress.length; i++) {

		if(i === 0) {
			updateElementTextContent(titleToGuessDiv, titleGuessProgress[i] + '    ', false);
		} else {
			updateElementTextContent(titleToGuessDiv, titleGuessProgress[i] + '    ', true);
		}
	}

	return;
}

// Updates the user guesses stack
// If clearStack is true, userGuess will be ignored
function updateUserGuesses(userGuess, clearStack) {
	if(clearStack) {
		guessStack = [];
	} else {
		// Update the display div
		updateElementTextContent(userGuessListDiv, ' ' + userGuess.toUpperCase(), true);

		// Push it to the stack
		guessStack.push(userGuess);
	}
	
	return;
}

// Checks if the user input is contained in the title currently being guessed
function checkUserGuess(userGuess) {
	// Check if userGuess is contained within the current title
	var indexOfGuess = currentTitle.toLowerCase().indexOf(userGuess);

	// Debug ONLY
	//console.log("indexOfGuess", indexOfGuess);

	while(indexOfGuess >= 0) {
		correctAudio.play();

		totalCorrect++;

		titleGuessProgress[indexOfGuess] = userGuess;

		indexOfGuess = currentTitle.toLowerCase().indexOf(userGuess, indexOfGuess + 1);

		// Debug ONLY
		//console.log("indexOfGuess", indexOfGuess);
	}

	return;
}

// Updates the number of guesses counter by subtracting one, if resetGuesses is true, it will set the value to the specified value
function updateNumberOfGuessesRemaining(resetGuesses, toThisValue) {
	if(resetGuesses) {
		numberOfGuessesRemaining = toThisValue;
	}
	else {
		numberOfGuessesRemaining--;
	}

	// Update display
	updateElementTextContent(guessesRemainingDiv, numberOfGuessesRemaining, false);

	return;
}

// Checks if the user is a winner
function isWinner() {
	//console.log("totalCorrect", totalCorrect, "totalToWin", totalToWin);
	if(totalCorrect === totalToWin) {
		return true;
	}

	return false;
}

// Checks if the user can continue guessing
function moreGuessesAllowed() {
	if(numberOfGuessesRemaining >= 1) {
		return true;
	} 

	return false;
}

// Updates the text for the specified HTML element.  If append is true, text provided will be appended to any existing content.
function updateElementTextContent(element, text, append) {
	if(append) {
		element.textContent += text;
	} else {
		element.textContent = text;
	}

	return;
}

// Check if the user input is already part of the guess stack
function letterAlreadyGuessed(userGuess) {
	var indexInStack = guessStack.indexOf(userGuess);

	if(indexInStack >= 0) {
		return true;
	}

	return false;
}

// Will display the win or lose image
function showWinOrLose(isWinner) {
	//var winLoseDiv = document.getElementById('win-lose');

	if(isWinner) {
		winLoseDiv.style.backgroundImage = "url('./assets/images/win.png')";
	} else {
		winLoseDiv.style.backgroundImage = "url('./assets/images/pwned.png')";
	}

	showHideElement(winLoseDiv, true);

	return;
}

// Shows or hides the specified element
function showHideElement(element, show) {
	if(show) {
		element.style.display = 'block';
	} else {
		element.style.display = 'none';
	}

	return;
}
