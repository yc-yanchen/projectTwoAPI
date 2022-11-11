const triviaApp = {};

triviaApp.url = new URL("https://the-trivia-api.com/api/questions");

triviaApp.init = () => {
    getQuestion();
};

triviaApp.url.search = new URLSearchParams({
    amount: 10,
    difficulty: "easy",
});

triviaApp.questionArray = [];

async function getQuestion() {
    const myObject = await fetch(triviaApp.url);
    const myQuestion = await myObject.json();
    triviaApp.questionArray.push(myQuestion);
    console.log(triviaApp.questionArray[0]);
}

triviaApp.displayQuestion = () => {
    const questionElement = document.createElement("h2");
    // questionElement.innerHTML = triviaApp.questionArray[0][0].question;
    // console.log(triviaApp.questionArray);
};

triviaApp.displayQuestion();

triviaApp.init();
