import database from "./firebaseConfig.js";

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
		optionElement.value = i;
		optionElement.innerText = i;
		document.querySelector("select").append(optionElement);
	}
};

// Async function to fetch for the api data
async function getQuestion() {
	const myObject = await fetch(triviaApp.url);
	const myQuestion = await myObject.json();
	triviaApp.questionArray.push(myQuestion);
	console.log(triviaApp.questionArray);

	// Call the displayQuestion function
	triviaApp.setupQuestion();
}

// Function to run through game setup related functions.
triviaApp.setupQuestion = () => {
	// Clear the questions and choices if present
	triviaApp.clearAll();
	// If the question counter is less than the length of the question array, display the questions, display the choices, and update the score.
	// Otherwise, stop displaying the score, and run the display results function
	if (triviaApp.questionCounter < triviaApp.questionArray[0].length) {
		triviaApp.displayQuestion();
		triviaApp.displayChoice();
		triviaApp.updateScore();
	} else {
		triviaApp.clearScore();
		document.querySelector(".forScore").classList = "forScore";
		triviaApp.displayResults();
	}
};

// Function to display the questions inside the questionArray
triviaApp.displayQuestion = () => {
	// Create an h2 object in the document
	const questionElement = document.createElement("h2");
	questionElement.classList = "questionText";
	// Adding text content to the h2
	questionElement.innerHTML = triviaApp.questionArray[0][triviaApp.questionCounter].question;
	// Appending the h2 object to the page of the html
	triviaApp.appendMain(questionElement);
};

// Function to display the choices
triviaApp.displayChoice = () => {
	triviaApp.choiceArray = [];
	triviaApp.questionArray[0][triviaApp.questionCounter].incorrectAnswers.forEach((answer) => {
		triviaApp.choiceArray.push(answer);
	});
	triviaApp.choiceArray.push(triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer);

	// Shuffled the choice array
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

			// Create a function which compares the textContent of the choice which the user clicked and comparing it to the correct answer
			if (event.target.textContent == triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer) {
				// Runs function which updates the score
				triviaApp.scoreAddition();
				pEvaluation.innerText = `Correct! \n Click here to continue`;
			} else {
				triviaApp.scoreSubtract();
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

// Function to update the score and append it onto the page
triviaApp.updateScore = () => {
	// Clear the html element container
	document.querySelector(".forScore").classList = "forScore boxStyling";
	triviaApp.clearScore();
	const scoreElement = document.createElement("p");
	const progressElement = document.createElement("p");
	progressElement.classList = "scoreText tBlue";
	scoreElement.classList = "scoreText tBlue";
	progressElement.innerHTML = `PROGRESS: ${triviaApp.questionCounter + 1}/${triviaApp.questionArray[0].length}`;
	scoreElement.innerHTML = `SCORE: ${triviaApp.score}`;
	document.querySelector(".forScore").append(scoreElement);
	document.querySelector(".forScore").append(progressElement);
};

// Function to display player results
triviaApp.displayResults = () => {
	const endMessage = document.createElement("p");
	endMessage.classList = "formText";
	triviaApp.appendMain(endMessage);
	if (triviaApp.score / triviaApp.questionArray[0].length >= 1 / 2) {
		endMessage.innerText = `Nice job! You scored ${triviaApp.score} points.`;
	} else {
		endMessage.innerText = `You scored ${triviaApp.score} points.`;
	}
	triviaApp.submissionAsset();
};

// Function to display a button at the end of the leaderboard page to bring the user back to the start page
// Note that only the center text in the li button will lead the click to the home page and that the rest of the button does not do anything
triviaApp.goHome = () => {
	const liElement = document.createElement("li");
	triviaApp.appendMain(liElement);
	const homeButton = document.createElement("a");
	homeButton.classList = "menuButton choiceList selectionButton boxStyling choiceText";
	liElement.append(homeButton);
	homeButton.href = "./index.html";
	homeButton.innerText = "Play again";
};

//---SCORE SUBMISSION---///

triviaApp.submissionAsset = () => {
	const scoreSubmissionForm = document.createElement("form");
	scoreSubmissionForm.id = "scoreForm";
	triviaApp.appendMain(scoreSubmissionForm);

	const submissionPrompt = document.createElement("label");
	submissionPrompt.innerText = "Enter Initials to Submit Score";
	submissionPrompt.classList = "formText";
	submissionPrompt.setAttribute("for", "userInitial");
	scoreSubmissionForm.append(submissionPrompt);

	const initialElement = document.createElement("input");
	initialElement.setAttribute("type", "text");
	initialElement.placeholder = "Enter Initials";

	initialElement.id = "userInitial";
	initialElement.maxLength = 3;
	scoreSubmissionForm.append(initialElement);

	const submitElement = document.createElement("input");
	submitElement.setAttribute("type", "submit");
	submitElement.setAttribute("value", "Submit Score");
	submitElement.classList = "selectionButton boxStyling";
	scoreSubmissionForm.append(submitElement);

	scoreSubmissionForm.addEventListener("submit", function (event) {
		event.preventDefault();

		const submissionContent = {
			initial: initialElement.value.toUpperCase(),
			score: triviaApp.score,
		};

		if (initialElement.value) {
			push(childNodeRef, submissionContent);
			triviaApp.clearAll();
			triviaApp.questionCounter = 0;
			triviaApp.score = 0;
			triviaApp.questionArray = [];
		} else {
			alert("Please enter initials before submitting");
		}

		triviaApp.displayLeaderboard();
	});
};

//---END OF SCORE SUBMISSION---//

//---LEADERBOARD---//

triviaApp.displayLeaderboard = () => {
	get(dbRef).then((snapshot) => {
		const leaderboard = snapshot.val();
		const tableElement = document.createElement("table");
		const tableRowElement = document.createElement("tr");
		const tableHeaderInitial = document.createElement("th");
		const tableHeaderScore = document.createElement("th");
		tableHeaderInitial.innerText = "Initial";
		tableRowElement.append(tableHeaderInitial);
		tableRowElement.append(tableHeaderScore);
		tableHeaderScore.innerText = "Score";
		tableElement.append(tableRowElement);

		const leaderboardTitle = document.createElement("h2");
		leaderboardTitle.classList = "homeHeading tYellow";
		leaderboardTitle.innerText = "Leaderboard";
		triviaApp.appendMain(leaderboardTitle);
		triviaApp.appendMain(tableElement);

		for (let entry in leaderboard.scoreEntry) {
			const tableUserRow = document.createElement("tr");
			const tableInitial = document.createElement("td");
			const tableScore = document.createElement("td");
			tableInitial.textContent = leaderboard.scoreEntry[entry].initial;
			tableScore.textContent = leaderboard.scoreEntry[entry].score;
			tableUserRow.append(tableInitial);
			tableUserRow.append(tableScore);
			document.querySelector("table").append(tableUserRow);
		}
		triviaApp.goHome();
	});
};

//---END OF LEADERBOARD---//

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
