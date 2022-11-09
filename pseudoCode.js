//----------------Phase 1 ----------------//
//----------------Pseudo Code to Display Game Assets----------------//

// Fetch data from (https://restcountries.com/#rest-countries)
// Parse data to a useable format
// Create new elements:
//HTML element to display the flag (could be img/p because flag is retrieved as an icon)
//HTML elements to display the choices
// innerHTML/ innerText will be used to modify the newly created elements
// append the elements to the page
// the data only needs to be fetched once, the code will continue to reuse the object so there is no need to acquire again

//----------------Phase 2----------------//
//----------------Pseudo Code for Game Logic----------------//

// Acquiring the correct answer:
// Create a random number generator with the maximum number being the length of the data array
// The random number will be used to access the data array and the country name and country flag will be store in a correct answer variable

// Acquiring the inccorect answers
// randomNumber = () => {
// generate random number here and store into newNumber
// if(newNumber == previouslyAcquiredNumber) {
// randomNumber()
//     }
// }

// Loop it additional 3 times while using logic to prevent the same number from being generated

//----------------Phase 3----------------//
//----------------Pseudo Code for Answer Check----------------//

// when user mouse over / click, use css transition to provide animation
// addEventListener to detect user selection
// Compare the user choice value with the answer value,
// if true, correct! use empty string to erase all the choices and display correct!
// if inccorect, use empty string to erase all the choices and display the correct answer?

//----------------Phase 4----------------//
//----------------Pseudo Code for Game Logic----------------//

// rerun the code starting from phase 1
