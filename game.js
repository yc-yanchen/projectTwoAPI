// Create namespace
const triviaApp = {};

// Create initialization function
triviaApp.init = function () {
    getQuestion();
};

// Create an array to store the parsed json data
triviaApp.questionArray = [];

// variable to store the api url endpoint
triviaApp.url = new URL("https://the-trivia-api.com/api/questions");

// Search parameters for the url endpoint
triviaApp.url.search = new URLSearchParams({
    // To request for the number of questions
    limit: 10,
    // To determine the difficulty level of the questions
    difficulty: "easy",
});

// Async function to fetch for the api data
async function getQuestion() {
    const myObject = await fetch(triviaApp.url);
    const myQuestion = await myObject.json();
    triviaApp.questionArray.push(myQuestion);
    console.log(triviaApp.questionArray);

    // Call the displayQuestion function
    triviaApp.setupQuestion();
}

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
        const pElement = document.createElement("p");
        pElement.innerText = triviaApp.choiceArray[i];
        pElement.id = `choice${i}`;
        pElement.classList = "choiceText";
        liElement.classList = "choiceList";
        liElement.id = `choiceList${i}`;
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
            if (event.target.textContent == triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer) {
                pEvaluation.innerText = `Correct! \n Click here to continue`;
                triviaApp.score++;
                triviaApp.updateScore();
            } else {
                pEvaluation.innerText = `The correct answer is: \n ${triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer} \n Click here to continue`;
            }
            // Add an event listener to the new li element to run the function triviaApp.nextQuestion()
            liEvaluation.addEventListener("click", function () {
                triviaApp.nextQuestion();
            });
        });
    }
};

triviaApp.updateScore = () => {
    triviaApp.clearScore();
    const scoreElement = document.createElement("p");
    scoreElement.classList = "scoreText";
    scoreElement.innerHTML =`${triviaApp.score}`;
    document.querySelector(".scoreContainer").append(scoreElement);

};

// Counter to keep the score
triviaApp.score = 0;

// Counter to keep track of the number of itterations
triviaApp.questionCounter = 0;

triviaApp.nextQuestion = () => {
    triviaApp.clearAll();
    triviaApp.questionCounter++;
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
