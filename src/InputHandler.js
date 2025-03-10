// Imports direction enum for input mapping
import MovingDirection from './MovingDirection.js'; // Enum with up: 0, down: 1, left: 2, right: 3

// Handles keyboard input for Pac-Man movement
export default class InputHandler {
    // Initializes input handler with Pac-Man reference
    // - pacman: Pacman instance to control
    constructor(pacman) {
        this.pacman = pacman;             // Stores Pacman instance for movement control
        document.addEventListener("keydown", this.handleKeydown.bind(this)); // Adds keydown listener
        // addEventListener(type, listener): Attaches event listener to document
        // "keydown": Event type for key press
        // bind(this): Ensures handleKeydown uses this InputHandler instance
    }

    // Processes keyboard input to update Pac-Man’s direction
    // - event: KeyboardEvent object with key info
    handleKeydown(event) {
        switch (event.key) {              // Switches on pressed key using event.key property
            // event.key: Returns string of key pressed (e.g., "ArrowUp")
            case "ArrowUp":               // Up arrow key
                if (this.pacman.currentMovingDirection === MovingDirection.down) // Checks if moving down
                    this.pacman.currentMovingDirection = MovingDirection.up; // Reverses to up (0)
                this.pacman.requestedMovingDirection = MovingDirection.up; // Sets requested direction to up (0)
                this.pacman.madeFirstMove = true; // Marks first move as made
                break;
            case "ArrowDown":             // Down arrow key
                if (this.pacman.currentMovingDirection === MovingDirection.up) // Checks if moving up
                    this.pacman.currentMovingDirection = MovingDirection.down; // Reverses to down (1)
                this.pacman.requestedMovingDirection = MovingDirection.down; // Sets requested direction to down (1)
                this.pacman.madeFirstMove = true; // Marks first move as made
                break;
            case "ArrowLeft":             // Left arrow key
                if (this.pacman.currentMovingDirection === MovingDirection.right) // Checks if moving right
                    this.pacman.currentMovingDirection = MovingDirection.left; // Reverses to left (2)
                this.pacman.requestedMovingDirection = MovingDirection.left; // Sets requested direction to left (2)
                this.pacman.madeFirstMove = true; // Marks first move as made
                break;
            case "ArrowRight":            // Right arrow key
                if (this.pacman.currentMovingDirection === MovingDirection.left) // Checks if moving left
                    this.pacman.currentMovingDirection = MovingDirection.right; // Reverses to right (3)
                this.pacman.requestedMovingDirection = MovingDirection.right; // Sets requested direction to right (3)
                this.pacman.madeFirstMove = true; // Marks first move as made
                break;
        }
    }
}