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
    triviaApp.displayQuestion();
}

// Function to display the questions inside the questionArray
triviaApp.displayQuestion = () => {
    // Create an h2 object in the document
    const questionElement = document.createElement("h2");
    // Adding text content to the h2
    questionElement.innerHTML = triviaApp.questionArray[0][0].question;
    // Appending the h2 object to the page of the html
    document.querySelector(".content").append(questionElement);
};

// Call the initialization function
triviaApp.init();
