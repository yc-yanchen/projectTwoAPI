// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyBa_3SUH4GgTauY68tVZf-JUqc3neWTXNE",
	authDomain: "projecttwoapi.firebaseapp.com",
	databaseURL: "https://projecttwoapi-default-rtdb.firebaseio.com",
	projectId: "projecttwoapi",
	storageBucket: "projecttwoapi.appspot.com",
	messagingSenderId: "769841972321",
	appId: "1:769841972321:web:0b7209aa7c0f501a59d620",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

export default database;
