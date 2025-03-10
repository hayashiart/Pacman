// Imports classes and utilities for game initialization
import GameLoop from './GameLoop.js';         // Manages game loop
import ResourceLoader from './ResourceLoader.js'; // Loads game resources
import InputHandler from './InputHandler.js'; // Handles keyboard input
import Ranking from './Ranking.js';           // Manages high scores
import { isValidDate } from './Utils.js';     // Validates date strings

// Runs when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => { // Adds listener for DOM load
    // addEventListener(type, listener): Attaches event listener to document
    // "DOMContentLoaded": Fires when HTML is fully parsed
    const canvas = document.getElementById("gameCanvas"); // Gets canvas element
    // getElementById(id): Returns HTMLElement with ID "gameCanvas"
    const resourceLoader = new ResourceLoader(); // Creates new ResourceLoader instance
    const resources = resourceLoader.loadResources(); // Loads game resources
    // loadResources(): Returns object with images and sounds
    const gameLoop = new GameLoop(canvas, resources); // Creates new GameLoop with canvas and resources
    let inputHandler;                         // Declares inputHandler variable

    // Starts game at specified level and updates UI
    // - level: Number (1-3) to start at
    const startGame = (level) => {            // Defines startGame function
        gameLoop.start(level);                // Starts game at given level
        // start(level): Initiates game loop
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        // getElementById(id): Returns "mainScreen" element
        document.getElementById("gameContainer").style.display = "flex"; // Shows game container
        document.getElementById("optionsMenu").style.display = "block"; // Shows options menu
        soundButton.innerHTML = `<img src="images/sound.png" alt="Sound" class="panel-icon"> Sounds: On`; // Sets sound button text
        inputHandler = new InputHandler(gameLoop.pacman); // Creates new InputHandler with Pacman
        gameLoop.setInputHandler(inputHandler); // Sets handler in gameLoop
        // setInputHandler(handler): Stores handler for input
    };

    // UI element references
    const burgerMenu = document.getElementById("burgerMenu"); // Gets burger menu element
    const burgerIcon = document.querySelector(".burger-icon"); // Gets burger icon element
    // querySelector(selector): Returns first element matching ".burger-icon"
    const optionsMenu = document.getElementById("optionsMenu"); // Gets options menu element
    const optionsIcon = document.querySelector(".options-icon"); // Gets options icon element
    const pauseButton = document.getElementById("pauseGame"); // Gets pause button element
    const soundButton = document.getElementById("toggleSound"); // Gets sound button element

    // Toggles burger and options menus
    burgerIcon.addEventListener("click", () => burgerMenu.classList.toggle("open")); // Toggles burger menu
    // addEventListener(type, listener): Adds click listener
    // classList.toggle(class): Adds/removes "open" class
    optionsIcon.addEventListener("click", () => optionsMenu.classList.toggle("open")); // Toggles options menu

    // Shows main screen and hides other pages
    const showMainScreen = () => {             // Defines showMainScreen function
        document.getElementById("mainScreen").style.display = "flex"; // Shows main screen
        document.getElementById("rulesPage").style.display = "none"; // Hides rules page
        document.getElementById("contactPage").style.display = "none"; // Hides contact page
        document.getElementById("rankingPage").style.display = "none"; // Hides ranking page
        document.getElementById("gameContainer").style.display = "none"; // Hides game container
        document.getElementById("optionsMenu").style.display = "none"; // Hides options menu
    };

    // Main menu event listeners
    document.getElementById("playGame1").addEventListener("click", () => startGame(1)); // Starts level 1
    document.getElementById("playGame2").addEventListener("click", () => {
        window.location.href = "game2/index2.html"; // Redirect to Tic-Tac-Toe
    }); // Redirects to game2/index2.html instead of starting level 2
    document.getElementById("rules").addEventListener("click", () => { // Shows rules page
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("rulesPage").style.display = "flex"; // Shows rules page
    });
    document.getElementById("ranking").addEventListener("click", () => { // Shows ranking page
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("rankingPage").style.display = "flex"; // Shows ranking page
        Ranking.populateTable();              // Populates ranking table
        // populateTable(): Updates ranking table with scores
    });
    document.getElementById("contact").addEventListener("click", () => { // Shows contact page
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("contactPage").style.display = "flex"; // Shows contact page
    });
    document.getElementById("closeRules").addEventListener("click", showMainScreen); // Closes rules page
    document.getElementById("closeContact").addEventListener("click", showMainScreen); // Closes contact page
    document.getElementById("closeRanking").addEventListener("click", showMainScreen); // Closes ranking page

    // Burger menu event listeners
    document.getElementById("reinitialise").addEventListener("click", () => { // Reinitializes game
        gameLoop.reinitialise();              // Resets game to level 1
        // reinitialise(): Restarts game
        burgerMenu.classList.remove("open");  // Closes burger menu
        // classList.remove(class): Removes "open" class
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("rulesPage").style.display = "none"; // Hides rules page
        document.getElementById("contactPage").style.display = "none"; // Hides contact page
        document.getElementById("rankingPage").style.display = "none"; // Hides ranking page
        document.getElementById("gameContainer").style.display = "flex"; // Shows game container
        document.getElementById("optionsMenu").style.display = "block"; // Shows options menu
    });
    document.getElementById("mainPage").addEventListener("click", () => { // Returns to main screen
        showMainScreen();                     // Shows main screen
        burgerMenu.classList.remove("open");  // Closes burger menu
    });
    document.getElementById("menuRanking").addEventListener("click", () => { // Shows ranking from menu
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("rulesPage").style.display = "none"; // Hides rules page
        document.getElementById("contactPage").style.display = "none"; // Hides contact page
        document.getElementById("rankingPage").style.display = "flex"; // Shows ranking page
        document.getElementById("gameContainer").style.display = "none"; // Hides game container
        Ranking.populateTable();              // Populates ranking table
        burgerMenu.classList.remove("open");  // Closes burger menu
    });
    document.getElementById("menuContact").addEventListener("click", () => { // Shows contact from menu
        document.getElementById("mainScreen").style.display = "none"; // Hides main screen
        document.getElementById("rulesPage").style.display = "none"; // Hides rules page
        document.getElementById("contactPage").style.display = "flex"; // Shows contact page
        document.getElementById("rankingPage").style.display = "none"; // Hides ranking page
        document.getElementById("gameContainer").style.display = "none"; // Hides game container
        burgerMenu.classList.remove("open");  // Closes burger menu
    });

    // Options menu event listeners
    pauseButton.addEventListener("click", () => { // Toggles game pause
        gameLoop.togglePause();               // Toggles pause state
        // togglePause(): Pauses or resumes game
        pauseButton.innerHTML = `<img src="images/pause.png" alt="Pause" class="panel-icon"> ${gameLoop.gameState.gamePaused ? "Resume" : "Pause"}`; // Updates button text
        optionsMenu.classList.remove("open"); // Closes options menu
    });

    soundButton.addEventListener("click", () => { // Toggles sound
        gameLoop.toggleSound();               // Toggles sound state
        // toggleSound(): Enables/disables sound
        soundButton.innerHTML = `<img src="images/sound.png" alt="Sound" class="panel-icon"> Sounds: ${gameLoop.gameState.soundEnabled ? "On" : "Off"}`; // Updates button text
        optionsMenu.classList.remove("open"); // Closes options menu
    });

    // Contact form submission handler
    document.getElementById("contactForm").addEventListener("submit", (e) => { // Handles form submission
        // addEventListener(type, listener): Adds submit listener
        e.preventDefault();                   // Prevents default form submission
        // preventDefault(): Stops form from sending HTTP request
        const firstName = document.getElementById("firstName").value.trim(); // Gets trimmed first name
        // value: Returns input value as string
        // trim(): Removes leading/trailing whitespace
        const lastName = document.getElementById("lastName").value.trim(); // Gets trimmed last name
        const dob = document.getElementById("dob").value; // Gets date of birth
        const email = document.getElementById("email").value.trim(); // Gets trimmed email
        const message = document.getElementById("message").value.trim(); // Gets trimmed message

        const nameRegex = /^[A-Za-z]{2,}$/;   // Defines regex for names (2+ letters)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Defines regex for email
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Defines regex for date (YYYY-MM-DD)

        if (!nameRegex.test(firstName)) {     // Checks first name validity
            // test(string): Returns true if string matches regex
            alert("First name must be at least 2 letters long and contain only letters."); // Shows error
            return;                           // Exits function
        }
        if (!nameRegex.test(lastName)) {      // Checks last name validity
            alert("Last name must be at least 2 letters long and contain only letters."); // Shows error
            return;                           // Exits function
        }
        if (!dateRegex.test(dob) || !isValidDate(dob)) { // Checks date format and validity
            // isValidDate(dateString): Returns true if date is valid
            alert("Please enter a valid date of birth (YYYY-MM-DD)."); // Shows error
            return;                           // Exits function
        }
        if (!emailRegex.test(email)) {        // Checks email validity
            alert("Please enter a valid email address."); // Shows error
            return;                           // Exits function
        }
        if (message.length < 10) {            // Checks message length
            alert("Message must be at least 10 characters long."); // Shows error
            return;                           // Exits function
        }

        console.log("Form submitted:", { firstName, lastName, dob, email, message }); // Logs form data
        alert("Thank you for your message! (This is a demo—no real submission occurs.)"); // Shows confirmation
        document.getElementById("contactForm").reset(); // Resets form fields
        // reset(): Clears all form inputs
        showMainScreen();                     // Returns to main screen
    });

    // Initialize UI state: Show only main screen on load
    showMainScreen();                     // Ensures only #mainScreen is visible at start
    console.log("Main.js loaded, initial page set to mainScreen"); // Confirms initialization
});