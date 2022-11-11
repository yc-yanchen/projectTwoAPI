const triviaApp = {}

triviaApp.url = new URL("https://the-trivia-api.com/api/questions");

triviaApp.init = () => {
    getQuestion()
};

triviaApp.url.search = new URLSearchParams({
    amount: 10,
    difficulty: "easy"
});

triviaApp.questionArray = []

async function getQuestion() {
    const myObject = await fetch(triviaApp.url)
    const myQuestion = await myObject.json()
    triviaApp.questionArray.push(myQuestion)
    console.log(triviaApp.questionArray)
};






triviaApp.init();
