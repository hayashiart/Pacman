// Imports constants for consistent game settings
import { TILE_SIZE, TOTAL_LEVELS } from './Constants.js'; // TILE_SIZE: tile size (32px), TOTAL_LEVELS: number of levels (3)

// Defines the game’s state management class
export default class GameState {
    // Initializes game state with default values
    // - Sets up all properties for a new game instance
    constructor() {
        this.currentLevel = 1;        // Current level, starts at 1
        this.score = 0;               // Player’s score, starts at 0
        this.lives = 3;               // Lives remaining, starts at 3
        this.gameOver = false;        // Game over flag, false until all lives lost
        this.gameWin = false;         // Game won flag, false until all levels completed
        this.gameStarted = false;     // Game started flag, false until play begins
        this.gamePaused = false;      // Pause flag, false for active play
        this.soundEnabled = true;     // Sound on/off, true by default
        this.invincibilityTimer = 0;  // Invincibility frames, 0 when inactive
        this.transitionTimer = 0;     // Transition frames, 0 when no transition
        this.gameTimer = 0;           // Total frames played, starts at 0
        this.finalTime = 0;           // Final play time in seconds, set at end
        this.bonusPoints = 0;         // Bonus points for quick win, set at end
        this.scoreAnimationTimer = 0; // Frames for score animation, 0 when inactive
        this.animatedScore = 0;       // Animated score value, updates during win
        this.playerName = null;       // Player name, null until entered
        this.nameEntered = false;     // Name entered flag, false until set
        this.bestScores = JSON.parse(localStorage.getItem("bestScores")) || []; // High scores from storage, empty array if none
        this.pacmanStartPosition = null; // Pac-Man’s start position, null until set
    }

    // Adds points to the score
    // - points: Number of points to add (e.g., 10, 50, 200)
    // - Updates score when Pac-Man eats items or ghosts
    incrementScore(points) {
        this.score += points; // Increases score by points argument, simple addition for flexibility
    }

    // Resets state for a new game
    // - Preserves level and scores, resets gameplay vars
    resetForNewGame() {
        this.score = 0;               // Resets score to 0 for new game
        this.lives = 3;               // Resets lives to 3, standard starting value
        this.gameOver = false;        // Clears game over flag for new start
        this.gameWin = false;         // Clears win flag for new game
        this.invincibilityTimer = 0;  // Resets invincibility, no effect at start
        this.transitionTimer = 0;     // Resets transition, no transition at start
        this.gameTimer = 0;           // Resets play time to 0
        this.finalTime = 0;           // Clears final time, set at end
        this.bonusPoints = 0;         // Clears bonus points, set at win
        this.scoreAnimationTimer = 0; // Resets animation timer, inactive at start
        this.animatedScore = 0;       // Resets animated score, updates at win
        this.playerName = null;       // Clears player name, set at end
        this.nameEntered = false;     // Resets name entered flag, prompts later
    }
}