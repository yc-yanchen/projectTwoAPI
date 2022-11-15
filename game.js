// Create namespace
const triviaApp = {};

// Create initialization function
triviaApp.init = function () {
    triviaApp.setupAmount();
};

// Create an array to store the parsed json data
triviaApp.questionArray = [];

// Create a document object for the form element in the HTML
triviaApp.formElement = document.querySelector("form");

// Attached an event listener to the form
triviaApp.formElement.addEventListener("submit", function (event) {
    event.preventDefault();

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
    triviaApp.clearAll();
    getQuestion();
});
//-----------------------------------//
//---Testing Area for User Amount ---//
//-----------------------------------//

triviaApp.setupAmount = () => {
    for (let i = 0; i < 50; i++) {
        const optionElement = document.createElement("option");
        optionElement.value = i + 1;
        optionElement.innerText = i + 1;
        document.querySelector("select").append(optionElement);
    }
};

//-----------------------------------//
//---------Testing Area End----------//
//-----------------------------------//

// Async function to fetch for the api data
async function getQuestion() {
    const myObject = await fetch(triviaApp.url);
    const myQuestion = await myObject.json();
    triviaApp.questionArray.push(myQuestion);
    console.log(triviaApp.questionArray);

    // Call the displayQuestion function
    triviaApp.setupQuestion();
}

// Function to run through all game setup related functions
triviaApp.setupQuestion = () => {
    triviaApp.displayQuestion();
    triviaApp.displayChoice();
    triviaApp.updateScore();
};

// Function to display the questions inside the questionArray
triviaApp.displayQuestion = () => {
    // Create an h2 object in the document
    const questionElement = document.createElement("h2");
    // Adding text content to the h2
    questionElement.innerHTML = triviaApp.questionArray[0][triviaApp.questionCounter].question;
    // Appending the h2 object to the page of the html
    document.querySelector(".questionContainer").append(questionElement);
};

// Function to display the choices
triviaApp.displayChoice = () => {
    triviaApp.choiceArray = [];
    // console.log(triviaApp.questionArray[0][0].incorrectAnswers);
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
        liElement.classList = "choiceList";
        // Modify the id property of the liElement. Assigns a unique id based on the counter i
        liElement.id = `choiceList${i}`;
        // Appending the objects created above to the page
        liElement.append(pElement);
        document.querySelector(".choiceContainer").append(liElement);

        // Attach event listener
        document.querySelector(`#choiceList${i}`).addEventListener("click", function (event) {
            // Clear the choices
            triviaApp.clearChoice();
            // Create li Element to store paragraph element
            const liEvaluation = document.createElement("li");
            // Assign it a class to style
            liEvaluation.classList = "choiceEvaluation";
            // Append the li to the ul
            document.querySelector(".choiceContainer").append(liEvaluation);
            // Create a p Element to display the evaluatino
            const pEvaluation = document.createElement("p");
            // Assign it a class to style
            pEvaluation.classList = "choiceText";
            // Append the p to the li
            liEvaluation.append(pEvaluation);

            // Create a function which compares the textContent of the choice which the user clicked and comparing it to the correct answer
            if (event.target.textContent == triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer) {
                pEvaluation.innerText = `Correct! \n Click here to continue`;
                // Updates the score counter by adding 1 when correct answer is selected
                triviaApp.score++;
                // Runs function which updates the score
                triviaApp.updateScore();
            } else {
                pEvaluation.innerText = `The correct answer is: \n ${triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer} \n Click here to continue`;
            }
            // Add an event listener to the new li element to run the function triviaApp.nextQuestion() (to load the next set of question and answers)
            liEvaluation.addEventListener("click", function () {
                triviaApp.nextQuestion();
            });
        });
    }
};

// Function to update the score and append it onto the page
triviaApp.updateScore = () => {
    // Clear the html element container
    triviaApp.clearScore();
    const scoreElement = document.createElement("p");
    scoreElement.classList = "scoreText";
    scoreElement.innerHTML = `${triviaApp.score}/${triviaApp.questionArray[0].length}`;
    document.querySelector(".scoreContainer").append(scoreElement);
};

// Counter to keep the score
triviaApp.score = 0;

// Counter to keep track of the number of itterations
triviaApp.questionCounter = 0;

// Function which runs at the end of the "loop"
triviaApp.nextQuestion = () => {
    // Clears both queston and choices
    triviaApp.clearAll();
    // Increase the questionCounter to keep track of which question the user is on
    triviaApp.questionCounter++;
    // Runs the setupQuestion function which processes and displays the next set of questions and choices
    triviaApp.setupQuestion();
};

// Clear score
triviaApp.clearScore = () => {
    document.querySelector(".scoreContainer").innerHTML = "";
};

// Clear choices
triviaApp.clearChoice = () => {
    document.querySelector(".choiceContainer").innerHTML = "";
};

// Clear questions
triviaApp.clearQuestion = () => {
    document.querySelector(".questionContainer").innerHTML = "";
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
