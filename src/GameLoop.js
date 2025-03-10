// Imports constants and classes for game functionality
import { FPS, TOTAL_LEVELS } from './Constants.js'; // FPS: Frames per second (75), TOTAL_LEVELS: 3
import GameState from './GameState.js';             // Manages game state
import Renderer from './Renderer.js';               // Handles rendering
import AudioManager from './AudioManager.js';       // Manages audio
import TileMap from './TileMap.js';                 // Defines game map
import Pacman from './Pacman.js';                   // Controls Pac-Man
import Enemy from './Enemy.js';                     // Controls ghosts
import Ranking from './Ranking.js';                 // Manages high scores

// Manages the main game loop and state transitions
export default class GameLoop {
    // Initializes game loop with canvas and resources
    // - canvas: HTMLCanvasElement for rendering
    // - resources: Object with images and sounds
    constructor(canvas, resources) {
        this.gameState = new GameState();     // Creates new GameState instance
        this.renderer = new Renderer(canvas); // Creates new Renderer with canvas
        this.audioManager = new AudioManager(resources); // Creates new AudioManager with resources
        this.resources = resources;           // Stores resources object
        this.canvas = canvas;                 // Stores canvas element
        this.tileMap = null;                  // Initializes tileMap as null
        this.pacman = null;                   // Initializes pacman as null
        this.enemies = null;                  // Initializes enemies as null
        this.intervalId = null;               // Initializes interval ID as null
        this.inputHandler = null;             // Initializes inputHandler as null
    }

    // Sets the input handler for Pac-Man control
    // - handler: InputHandler instance
    setInputHandler(handler) {
        this.inputHandler = handler;          // Stores input handler instance
    }

    // Starts the game at a specified level
    // - level: Number (1-3) to start at
    start(level) {
        if (!this.gameState.gameStarted) {    // Checks if game hasn’t started
            this.gameState.currentLevel = level; // Sets current level from arg
            this.tileMap = new TileMap(this.resources, level); // Creates new TileMap with resources and level
            this.pacman = this.tileMap.getPacman( // Gets Pacman from tileMap
                (points) => this.gameState.incrementScore(points), // Callback to increment score
                this.audioManager                 // Passes audio manager
            );                                    // getPacman(callback, audioManager): Returns new Pacman instance
            this.enemies = this.tileMap.getEnemies(); // Gets enemies array from tileMap
            // getEnemies(): Returns array of Enemy instances
            this.gameState.pacmanStartPosition = { x: this.pacman.x, y: this.pacman.y }; // Stores Pacman’s start position
            this.tileMap.setCanvasSize(this.canvas); // Sets canvas size based on tileMap
            // setCanvasSize(canvas): Adjusts canvas dimensions
            this.gameState.gameStarted = true;    // Marks game as started
            this.gameState.gamePaused = false;    // Ensures game is unpaused
            this.audioManager.setMuted(!this.gameState.soundEnabled); // Syncs audio mute state
            // setMuted(muted): Mutes audio if true
            if (!this.intervalId) {               // Checks if no loop is running
                this.intervalId = setInterval(() => this.loop(), 1000 / FPS); // Starts game loop
                // setInterval(callback, ms): Runs callback every 1000/FPS ms (13.33ms at 75 FPS)
            }
            if (this.inputHandler) {              // Checks if input handler exists
                this.inputHandler.pacman = this.pacman; // Reattaches handler to new Pacman
            }
        }
    }

    // Reinitializes game to level 1
    reinitialise() {
        if (this.intervalId) {                // Checks if loop is running
            clearInterval(this.intervalId);   // Stops game loop
            // clearInterval(id): Cancels interval with given ID
            this.intervalId = null;           // Resets interval ID
        }
        this.gameState.resetForNewGame();     // Resets game state for new game
        // resetForNewGame(): Clears gameplay vars
        this.gameState.gameStarted = false;   // Marks game as not started
        this.start(1);                        // Starts game at level 1
        // start(level): Initiates game with level arg
    }

    // Runs one frame of the game loop
    loop() {
        if (!this.gameState.gameStarted || this.gameState.gamePaused) return; // Exits if game not started or paused
        this.renderer.clear();                // Clears canvas
        // clear(): Erases entire canvas
        this.renderer.drawTileMap(this.tileMap, this.gameState.currentLevel); // Draws tile map
        // drawTileMap(tileMap, level): Renders map
        if (this.gameState.invincibilityTimer <= 0 || this.gameState.invincibilityTimer % 10 >= 5) { // Checks invincibility flash
            this.renderer.drawPacman(this.pacman, this.pause(), this.enemies); // Draws Pacman if not flashing off
            // drawPacman(pacman, pause, enemies): Renders Pacman; flashes every 10 frames
        }
        this.renderer.drawEnemies(this.enemies, this.pause(), this.pacman); // Draws enemies
        // drawEnemies(enemies, pause, pacman): Renders all enemies
        this.renderer.drawScoreLevelAndLives(this.gameState); // Draws score, lives, etc.
        // drawScoreLevelAndLives(gameState): Renders HUD
        this.renderer.drawGameEnd(this.gameState); // Draws game end screen if applicable
        // drawGameEnd(gameState): Renders end animation

        if (this.gameState.invincibilityTimer > 0) this.gameState.invincibilityTimer--; // Decrements invincibility timer
        if (!this.gameState.gameOver && !this.gameState.gameWin && this.gameState.transitionTimer === 0) { // Checks if game active
            this.gameState.gameTimer++;       // Increments game timer
        }

        if (this.gameState.gameWin && this.gameState.scoreAnimationTimer > 0) { // Checks if animating win score
            this.gameState.scoreAnimationTimer--; // Decrements animation timer
            const increment = Math.ceil(this.gameState.bonusPoints / 75); // Calculates score increment
            // Math.ceil(num): Rounds up to nearest integer
            this.gameState.animatedScore = Math.min(this.gameState.animatedScore + increment, this.gameState.score); // Updates animated score
            // Math.min(a, b): Ensures score doesn’t exceed total
            if (this.gameState.scoreAnimationTimer === 0) this.gameState.animatedScore = this.gameState.score; // Sets final score
        }

        if (this.gameState.transitionTimer > 0) { // Checks if in transition
            this.handleTransition();          // Handles level transition
        } else {                              // If not in transition
            this.checkGameOver();             // Checks for game over
            this.checkGameWin();              // Checks for game win
        }
    }

    // Determines if game should pause rendering
    pause() {
        return !this.pacman.madeFirstMove || this.gameState.gameOver || this.gameState.gameWin || this.gameState.gamePaused || this.gameState.transitionTimer > 0; // Returns pause state
        // True if: no first move, game over, game won, paused, or transitioning
    }

    // Manages level transition timing
    handleTransition() {
        console.log("Handling transition, timer:", this.gameState.transitionTimer); // Logs transition timer
        this.gameState.transitionTimer--;     // Decrements transition timer
        if (this.gameState.transitionTimer === 75) { // Checks midpoint of transition (150-0)
            this.resetLevel();                // Resets level at halfway point
        }
    }

    // Checks for game win condition
    checkGameWin() {
        console.log("Dots left:", this.tileMap.dotsLeft()); // Logs remaining dots
        if (!this.gameState.gameWin && this.gameState.transitionTimer === 0 && this.tileMap.didWin()) { // Checks win conditions
            // didWin(): Returns true if no dots remain
            if (this.gameState.currentLevel < TOTAL_LEVELS) { // Checks if more levels remain
                this.gameState.currentLevel++; // Advances to next level
                this.gameState.transitionTimer = 150; // Starts 150-frame transition
                if (this.gameState.soundEnabled) this.audioManager.play(this.resources.gameWinSound); // Plays win sound
                // play(sound): Plays given sound if enabled
            } else {                          // If all levels completed
                this.gameState.finalTime = Math.floor(this.gameState.gameTimer / FPS); // Calculates final time in seconds
                // Math.floor(num): Rounds down timer/FPS
                this.gameState.bonusPoints = Math.max(10000 - this.gameState.finalTime * 100, 0); // Calculates bonus
                // Math.max(a, b): Ensures bonus isn’t negative
                this.gameState.score += this.gameState.bonusPoints; // Adds bonus to score
                this.gameState.animatedScore = this.gameState.score - this.gameState.bonusPoints; // Sets initial animated score
                this.gameState.scoreAnimationTimer = 75; // Starts 75-frame animation
                this.gameState.gameWin = true; // Marks game as won
                if (this.gameState.soundEnabled) this.audioManager.play(this.resources.gameWinSound); // Plays win sound
                this.promptForName();         // Prompts for player name
            }
        }
    }

    // Checks for game over condition
    checkGameOver() {
        if (!this.gameState.gameOver && this.enemies.some(enemy => !this.pacman.powerDotActive && enemy.collideWith(this.pacman))) { // Checks collision
            // some(callback): Returns true if any enemy collides without power dot
            // collideWith(pacman): Returns true if enemy overlaps Pacman
            this.gameState.lives--;           // Decrements lives
            if (this.gameState.lives > 0) {   // Checks if lives remain
                this.restartPacman();         // Restarts Pacman
                if (this.gameState.soundEnabled) this.audioManager.play(this.resources.gameOverSound); // Plays game over sound
            } else {                          // If no lives left
                this.gameState.finalTime = Math.floor(this.gameState.gameTimer / FPS); // Calculates final time
                // Math.floor(num): Rounds down timer/FPS
                this.gameState.gameOver = true; // Marks game as over
                if (this.gameState.soundEnabled) this.audioManager.play(this.resources.gameOverSound); // Plays game over sound
                this.promptForName();         // Prompts for player name
            }
        }
    }

    // Resets level entities for next level
    resetLevel() {
        this.tileMap = new TileMap(this.resources, this.gameState.currentLevel); // Creates new TileMap for current level
        this.pacman = this.tileMap.getPacman( // Gets new Pacman instance
            (points) => this.gameState.incrementScore(points), // Callback to increment score
            this.audioManager                 // Passes audio manager
        );                                    // getPacman(callback, audioManager): Returns new Pacman
        this.enemies = this.tileMap.getEnemies(); // Gets new enemies array
        // getEnemies(): Returns array of Enemy instances
        this.gameState.pacmanStartPosition = { x: this.pacman.x, y: this.pacman.y }; // Updates start position
        this.tileMap.setCanvasSize(this.canvas); // Resizes canvas for new map
        // setCanvasSize(canvas): Adjusts canvas dimensions
        this.gameState.invincibilityTimer = 0; // Resets invincibility timer
        if (this.inputHandler) {              // Checks if input handler exists
            this.inputHandler.pacman = this.pacman; // Reattaches handler to new Pacman
        }
    }

    // Restarts Pacman after losing a life
    restartPacman() {
        this.pacman.reset(this.gameState.pacmanStartPosition); // Resets Pacman to start position
        // reset(position): Moves Pacman to given x, y
        this.gameState.invincibilityTimer = 75; // Sets 75-frame invincibility period
    }

    // Prompts player for name and saves score
    promptForName() {
        if (!this.gameState.nameEntered) {    // Checks if name not yet entered
            this.gameState.playerName = prompt("Enter your name for the ranking:", "Player") || "Player"; // Prompts for name
            // prompt(message, default): Shows dialog, returns input or null; defaults to "Player"
            this.gameState.nameEntered = true; // Marks name as entered
            Ranking.saveScore(this.gameState.score, this.gameState.playerName); // Saves score
            // saveScore(score, name): Adds score to rankings
        }
    }

    // Toggles game pause state
    togglePause() {
        if (this.gameState.gameStarted) {     // Checks if game is started
            this.gameState.gamePaused = !this.gameState.gamePaused; // Toggles pause state
            if (!this.gameState.gamePaused && !this.intervalId) { // If unpausing and no loop
                this.intervalId = setInterval(() => this.loop(), 1000 / FPS); // Restarts loop
                // setInterval(callback, ms): Runs loop every 13.33ms
            } else if (this.gameState.gamePaused && this.intervalId) { // If pausing and loop exists
                clearInterval(this.intervalId); // Stops loop
                // clearInterval(id): Cancels interval
                this.intervalId = null;       // Resets interval ID
            }
        }
    }

    // Toggles sound on/off
    toggleSound() {
        this.gameState.soundEnabled = !this.gameState.soundEnabled; // Toggles sound state
        this.audioManager.setMuted(!this.gameState.soundEnabled); // Updates audio mute state
        // setMuted(muted): Mutes audio if true
        this.pacman.setSoundEnabled(this.gameState.soundEnabled); // Updates Pacman sound
        // setSoundEnabled(enabled): Syncs Pacman’s audio
    }
}