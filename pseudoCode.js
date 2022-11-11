// Phase 1: Retrieving data from API
// Get browser to fetch the data from the queried url
// Parse the data

// Contain bellow in a for(let i = 0; i < questionDatabase.length; i++) so that it would loop the code bellow

// Phase 2: Display the question
// Create a new element p or h
// Use innerhtml to added text (Data from array contains characters which can only be displayed when innerhtml is used)
// Append the element

// Phase 3: Merge the correct and incorrect answer into a single array
// Collect data from the incorrect_answers array and correct_answer array and push them into a singular array choiceArray
// Use the Fisher Yates algorithm to shuffle the array

// Phase 4: Use a for(let i = 0; i < choiceArray.length; i++) to display the choices
// Create a button
// Add value to it from the choice array
// Add id to it using the variable i so that each button has a different ID
// Append the element
// Create addeventlistener to each ID
//      Runs a function which checks whether the button value is the same as the correct answer
// Use an empty string to wipe the choices, then display whether the user is correct or not