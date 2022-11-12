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
        liElement.id = `choiceList${i}`;
        liElement.classList = "listStyling";
        pElement.innerText = triviaApp.choiceArray[i];
        pElement.id = `choice${i}`;
        pElement.classList = "textChoice";
        liElement.append(pElement);
        document.querySelector(".choiceContainer").append(liElement);

        document.querySelector(`#choiceList${i}`).addEventListener("click", function (event) {
            triviaApp.clearChoice();
            const liEvaluation = document.createElement("li");
            const pEvaluation = document.querySelector("p");
            liEvaluation.classList = "liEvaluationStyling";
            pEvaluation.classList = "textChoice";
            document.querySelector(".choiceContainer").append(liEvaluation);

            liEvaluation.append(pEvaluation);
            if (event.target.textContent == triviaApp.questionArray[0][triviaApp.questionCounter].correctAnswer) {
                pEvaluation.innerText = "Correct";
            } else {
                pEvaluation.innerText = "Incorrect";
            }

            liEvaluation.addEventListener("click", function (event) {
                triviaApp.nextQuestion();
            });
        });
    }
};

// Counter to keep track of the number of itterations
triviaApp.questionCounter = 0;

triviaApp.nextQuestion = () => {
    triviaApp.clearAll();
    triviaApp.questionCounter++;
    triviaApp.setupQuestion();
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
