const triviaApp = {};


triviaApp.init = function () {
    getQuestion();
};

// Array to store the questions
triviaApp.questionArray = [];

triviaApp.url = new URL("https://the-trivia-api.com/api/questions");

// Search query for the setting of the game 
triviaApp.url.search = new URLSearchParams({
    limit: 10,
    difficulty: "easy",
});s


async function getQuestion() {
    const myObject = await fetch(triviaApp.url);
    const myQuestion = await myObject.json();
    triviaApp.questionArray.push(myQuestion);
    console.log(triviaApp.questionArray[0]);
}

triviaApp.displayQuestion = () => {
    const questionElement = document.createElement("h2");
    questionElement.innerHTML = triviaApp.questionArray[0][0].question;
    // console.log(triviaApp.questionArray);
};

triviaApp.displayQuestion();

triviaApp.init();
