// Import firebase database
import database from "./firebaseConfig.js";

// Import firebase functions
import { ref, push, get } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Firebase referencing the database location
const dbRef = ref(database);

// Firebase construct a new node for the adding user scores
const childNodeRef = ref(database, "scoreEntry");

// Create namespace
const triviaApp = {};

// Create initialization function
triviaApp.init = function () {
	triviaApp.setupAmount();
};

// Create an array to store the parsed json data
triviaApp.questionArray = [];

// Create a document object for the form element in the HTML
triviaApp.formElement = document.querySelector("#userSetting");

// Attached an event listener to the form which collects the game settings which the user selected
triviaApp.formElement.addEventListener("submit", function (event) {
	// Create an object to store the selected radio button
	triviaApp.userDif = document.querySelector("input[type='radio']:checked");

	//Create an object to store the number of questions the user wants
	triviaApp.userQuestionAmount = document.querySelector("select[name='userAmount']");

	// variable to store the api url endpoint
	triviaApp.url = new URL("https://the-trivia-api.com/api/questions");

	// Search parameters for the url endpoint
	triviaApp.url.search = new URLSearchParams({
		// To request for the number of questions
		limit: triviaApp.userQuestionAmount.value,
		// To determine the difficulty level of the questions
		difficulty: triviaApp.userDif.value,
	});
	// Clear the form element
	triviaApp.clearAll();
	// Get the questions
	getQuestion();
});

// Function to create 1 to 50 option choices for user to select
triviaApp.setupAmount = () => {
	for (let i = 1; i <= 50; i++) {
		const optionElement = document.createElement("option");
		// Assigning the current i to the value and innerText of option
		optionElement.value = i;
		optionElement.innerText = i;
		// Appending the options
		document.querySelector("select").append(optionElement);
	}
};

// Async function to fetch for the api data
async function getQuestion() {
	const myObject = await fetch(triviaApp.url);
	const myQuestion = await myObject.json();
	triviaApp.questionArray.push(myQuestion);
	// Call triviaApp.setupQuestion
	triviaApp.setupQuestion();
}

// Function to run through game setup related functions.
triviaApp.setupQuestion = () => {
	// Clear the questions and choices if present
	triviaApp.clearAll();
	// If the triviaApp.questionCounter is less than the length of the question array, display the questions, display the choices, and update the score.
	// Otherwise, stop displaying the score, and run the display results function
	if (triviaApp.questionCounter < triviaApp.questionArray[0].length) {
		triviaApp.displayQuestion();
		triviaApp.displayChoice();
		triviaApp.updateScore();
	} else {
		triviaApp.clearScore();
		triviaApp.displayResults();
	}
};

// Function to display the questions inside the triviaApp.questionArray
triviaApp.displayQuestion = () => {
	// Create an h2 object in the document to hold the question
	const questionElement = document.createElement("h2");
	questionElement.classList = "questionText";
	// Adding question to the h2
	questionElement.innerHTML = triviaApp.questionArray[0][triviaApp.questionCounter].question;
	// Appending the h2 object to the .mainContainer
	triviaApp.appendMain(questionElement);
};

// Function to display the choices
triviaApp.displayChoice = () => {
	// Create an empty array. This array will hold both the correct and inccorect answers for the questions as they get pushed in. The array will then get shuffled.
	triviaApp.choiceArray = [];
	// Pushing the incorrect answer into the array by looping through them with the forEach method.
	triviaApp.questionArray[0][triviaApp.questionCounter].incorrectAnswers.forEach((answer) => {
		triviaApp.choiceArray.push(answer);
	});
	// Pushing the correct answer into the array
	triviaApp.choiceArray.push(triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer);

	// Shuffle the choice array
	triviaApp.fisherYates(triviaApp.choiceArray);

	// For each item in the shuffled choice array:
	for (let i = 0; i < triviaApp.choiceArray.length; i++) {
		// For each item in the array, create a new li element
		const liElement = document.createElement("li");
		// For each item in the array, create a new p element
		const pElement = document.createElement("p");
		// Modify the innerText property of pElement to the value at the corresponding index number in the array
		pElement.innerText = triviaApp.choiceArray[i];
		// Modify the id property of the pElement. Assigns a unique id based on the counter i
		pElement.id = `choice${i}`;
		// Modify the class property of the pElement
		pElement.classList = "choiceText";
		// Modify the class property of the class list
		liElement.classList = "choiceList selectionButton boxStyling";
		// Modify the id property of the liElement. Assigns a unique id based on the counter i
		liElement.id = `choiceList${i}`;
		// Appending the objects created above to the page
		liElement.append(pElement);
		// Appending the choices to the .choiceContainer
		triviaApp.appendChoice(liElement);

		// Attach event listener
		document.querySelector(`#choiceList${i}`).addEventListener("click", function (event) {
			// Clear the choices
			triviaApp.clearChoice();
			// Create li Element to store paragraph element
			const liEvaluation = document.createElement("li");
			// Assign it a class to style
			liEvaluation.classList = "choiceEvaluation choiceList selectionButton boxStyling";
			// Append the li to the ul
			triviaApp.appendChoice(liEvaluation);
			// Create a p Element to display the evaluatino
			const pEvaluation = document.createElement("p");
			// Assign it a class to style
			pEvaluation.classList = "choiceText";
			// Append the p to the li
			liEvaluation.append(pEvaluation);

			// Create a function which compares the textContent of the choice which the user clicked and compare it to the correct answer
			if (event.target.textContent == triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer) {
				// Score will be added when the user selects the correct answer
				triviaApp.scoreAddition();
				// The application will let the user know to click on the button to continue
				pEvaluation.innerText = `Correct! \n Click here to continue`;
			} else {
				// Score will be subtracted when the user selects the incorrect answer
				triviaApp.scoreSubtract();
				// THe application will let the user know to click on the button to continue. The correct answer will also be displayed
				pEvaluation.innerText = `The correct answer is: \n ${triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer} \n Click here to continue`;
			}
			// Add an event listener to the new li element to run the function triviaApp.nextQuestion() (to load the next set of question and answers)
			liEvaluation.addEventListener("click", function () {
				// Increase the questionCounter to keep track of which question the user is on
				triviaApp.questionCounter++;
				// Runs the setupQuestion function which processes and displays the next set of questions and choices
				triviaApp.setupQuestion();
			});
		});
	}
};

// Function to add score based on the difficulty. The function will check the difficulty which the async function used to fetch the questions, and add score depending on which difficulty was picked.
triviaApp.scoreAddition = () => {
	if (triviaApp.userDif.value == "easy") {
		triviaApp.score = triviaApp.score + 100;
	}
	if (triviaApp.userDif.value == "medium") {
		triviaApp.score = triviaApp.score + 125;
	}
	if (triviaApp.userDif.value == "hard") {
		triviaApp.score = triviaApp.score + 150;
	}
};

// Similarly, the function which adds points, this one subtract points.
triviaApp.scoreSubtract = () => {
	if (triviaApp.userDif.value == "easy") {
		triviaApp.score = triviaApp.score - 20;
	}
	if (triviaApp.userDif.value == "medium") {
		triviaApp.score = triviaApp.score - 50;
	}
	if (triviaApp.userDif.value == "hard") {
		triviaApp.score = triviaApp.score - 90;
	}
};

// Function to update the score and append it onto the page after each question, and upon setup of the game.
triviaApp.updateScore = () => {
	// Adding the class of boxStyling to the div to make it show up on the page
	document.querySelector(".forScore").classList = "forScore boxStyling";
	// Clear the currect text which shows the score and progress before appending the updated one.
	triviaApp.clearScore();
	// Create elements to hold the progress and the score
	const scoreElement = document.createElement("p");
	const progressElement = document.createElement("p");
	// Adding classes for styling to those paragraph elements
	progressElement.classList = "scoreText tBlue";
	scoreElement.classList = "scoreText tBlue";
	// Using template literal, the current player score and their progress is displayed.
	progressElement.innerHTML = `PROGRESS: ${triviaApp.questionCounter + 1}/${triviaApp.questionArray[0].length}`;
	scoreElement.innerHTML = `SCORE: ${triviaApp.score}`;
	// Append those elements to the .forScore div
	document.querySelector(".forScore").append(scoreElement);
	document.querySelector(".forScore").append(progressElement);
};

// Function to display player results
triviaApp.displayResults = () => {
	// Create new element to hold the end message including the player score
	const endMessage = document.createElement("p");
	endMessage.classList = "formText";
	//Append the element
	triviaApp.appendMain(endMessage);
	// A slightly different message is displayed depending on how the user scored.
	if (triviaApp.score / triviaApp.questionArray[0].length >= 1 / 2) {
		endMessage.innerText = `Nice job! You scored ${triviaApp.score} points.`;
	} else {
		endMessage.innerText = `You scored ${triviaApp.score} points.`;
	}
	// Calls the function triviaApp.submissionAsset()
	triviaApp.submissionAsset();
};

//---SCORE SUBMISSION---///

// Function which is responsible to collect user initial and user score to send to Firebase
triviaApp.submissionAsset = () => {
	// Creating the form element which will hold the rest of the form content
	const scoreSubmissionForm = document.createElement("form");
	scoreSubmissionForm.id = "scoreForm";
	triviaApp.appendMain(scoreSubmissionForm);

	// Create a form label
	const submissionPrompt = document.createElement("label");
	submissionPrompt.innerText = "Enter Initials to Submit Score";
	submissionPrompt.classList = "formText";
	submissionPrompt.setAttribute("for", "userInitial");
	scoreSubmissionForm.append(submissionPrompt);

	// Create a text input for the initials
	const initialElement = document.createElement("input");
	initialElement.setAttribute("type", "text");
	initialElement.placeholder = "Enter Initials";
	initialElement.id = "userInitial";
	// Prevent player from entering more than three characters into the intials form
	initialElement.maxLength = 3;
	scoreSubmissionForm.append(initialElement);

	// Create an input button to submit the form
	const submitElement = document.createElement("input");
	submitElement.setAttribute("type", "submit");
	submitElement.setAttribute("value", "Submit Score");
	submitElement.classList = "selectionButton boxStyling";
	scoreSubmissionForm.append(submitElement);

	// Create an event listener which listens for a submit of the form.
	scoreSubmissionForm.addEventListener("submit", function (event) {
		// Prevent the page from refreshing
		event.preventDefault();

		// Collects the necessary data for submission
		const submissionContent = {
			// Forcing all characters the user inputed to uppercase
			initial: initialElement.value.toUpperCase(),
			// Collect the current player score
			score: triviaApp.score,
		};

		// Only push the score when the user has entered text into the input field
		if (initialElement.value) {
			push(childNodeRef, submissionContent);
			triviaApp.clearAll();
			triviaApp.questionCounter = 0;
			triviaApp.score = 0;
			triviaApp.questionArray = [];
			// An alert will show if the user does not input their initial before submitting the form
		} else {
			alert("Please enter initials before submitting");
		}

		// Once the score is submitted, call triviaApp.displayLeaderboard()
		triviaApp.displayLeaderboard();
	});
};

//---END OF SCORE SUBMISSION---//

//---LEADERBOARD---//

// Function to display the leaderboard
triviaApp.displayLeaderboard = () => {
	// Requests for a snapshot of the current database on Firebase
	get(dbRef).then((snapshot) => {
		// Parse the data into the leaderboard object
		const leaderboard = snapshot.val();
		// Create the necessary components to display the leaderboard in a table. Two columns, one for the initials, and one for the scores.
		const tableElement = document.createElement("table");
		const tableRowElement = document.createElement("tr");
		const tableHeaderInitial = document.createElement("th");
		const tableHeaderScore = document.createElement("th");
		tableHeaderInitial.innerText = "Initial";
		tableRowElement.append(tableHeaderInitial);
		tableRowElement.append(tableHeaderScore);
		tableHeaderScore.innerText = "Score";
		tableElement.append(tableRowElement);

		// Create an element to show "Leaderboard" above the table
		const leaderboardTitle = document.createElement("h2");
		leaderboardTitle.classList = "homeHeading tYellow";
		leaderboardTitle.innerText = "Leaderboard";
		// Append the table and the title to .mainContainer
		triviaApp.appendMain(leaderboardTitle);
		triviaApp.appendMain(tableElement);

		// Using a for in function, looped through the leaderboard object to display the initial and scores
		for (let entry in leaderboard.scoreEntry) {
			// Create new table row, and new table data to store the information
			const tableUserRow = document.createElement("tr");
			const tableInitial = document.createElement("td");
			const tableScore = document.createElement("td");
			// Add the data to the elements
			tableInitial.textContent = leaderboard.scoreEntry[entry].initial;
			tableScore.textContent = leaderboard.scoreEntry[entry].score;
			// Append the elements to the previously created table
			tableUserRow.append(tableInitial);
			tableUserRow.append(tableScore);
			// Append the new row to the previously created table
			document.querySelector("table").append(tableUserRow);
		}
		// Call the function triviaApp.goHome()
		triviaApp.goHome();
	});
};

//---END OF LEADERBOARD---//

// Function to display a button at the end of the leaderboard page to bring the user back to the start page
triviaApp.goHome = () => {
	//  Create anchor element to redirect user to the start
	const homeButton = document.createElement("a");
	homeButton.classList = "menuButton choiceList selectionButton boxStyling choiceText";
	// Append the anchor to the page below the scoreboard
	triviaApp.appendMain(homeButton);
	// Link to the index.html
	homeButton.href = "./index.html";
	homeButton.innerText = "Play again";
};

// Function to append elements to the .mainContainer
triviaApp.appendMain = (elementToAppend) => {
	document.querySelector(".mainContainer").append(elementToAppend);
};

// Function to append elements to the .choiceContainer
triviaApp.appendChoice = (elementToAppend) => {
	document.querySelector(".choiceContainer").append(elementToAppend);
};

// Counter to keep track of the number of itterations
triviaApp.questionCounter = 0;

// Counter to keep the score
triviaApp.score = 0;

// Clear score
triviaApp.clearScore = () => {
	document.querySelector(".forScore").innerHTML = "";
};

// Clear choices
triviaApp.clearChoice = () => {
	document.querySelector(".choiceContainer").innerHTML = "";
};

// Clear questions
triviaApp.clearQuestion = () => {
	document.querySelector(".mainContainer").innerHTML = "";
};

// Clear all
triviaApp.clearAll = () => {
	triviaApp.clearChoice();
	triviaApp.clearQuestion();
};

// Fisher Yates algorithm (Research source: https://javascript.info/task/shuffle)
triviaApp.fisherYates = function (array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
};

// Call the initialization function
triviaApp.init();
