// Imports direction enum for ghost movement
import MovingDirection from "./MovingDirection.js"; // Enum with up: 0, down: 1, left: 2, right: 3

// Defines ghost behavior and rendering
export default class Enemy {
    // Initializes a ghost with position and properties
    // - x/y: Starting pixel coordinates
    // - tileSize: Size of each tile (e.g., 32px)
    // - velocity: Movement speed (e.g., 2px/frame)
    // - tileMap: TileMap instance for collision checks
    // - resources: Object with ghost images
    constructor(x, y, tileSize, velocity, tileMap, resources) {
        this.x = x;                       // Sets initial x position in pixels
        this.y = y;                       // Sets initial y position in pixels
        this.tileSize = tileSize;         // Sets tile size from arg (e.g., 32px)
        this.velocity = velocity;         // Sets movement speed from arg (e.g., 2px/frame)
        this.tileMap = tileMap;           // Stores TileMap reference for collision
        this.resources = resources;       // Stores resources object for images
        this.normalGhost = this.resources.ghost; // Assigns normal ghost image
        this.scaredGhost = this.resources.scaredGhost; // Assigns scared ghost image (blue)
        this.scaredGhost2 = this.resources.scaredGhost2; // Assigns scared ghost alternate image
        this.image = this.normalGhost;    // Sets initial image to normal ghost
        this.movingDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length); // Sets random initial direction
        // Math.random(): Returns float 0 to <1
        // Object.keys(obj): Returns array of MovingDirection keys (up, down, left, right)
        // length: Number of directions (4)
        // Math.floor(num): Rounds down to integer (0-3)
        this.directionTimerDefault = this.#random(1, 20); // Sets random default timer (1-20 frames)
        this.directionTimer = this.directionTimerDefault; // Initializes timer to default
        this.scaredAboutToExpireTimerDefault = 10; // Sets default expiration timer to 10 frames
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault; // Initializes expiration timer
    }

    // Draws the ghost on the canvas
    // - ctx: CanvasRenderingContext2D for rendering
    // - pause: Boolean indicating if game is paused
    // - pacman: Pacman instance for power dot state
    draw(ctx, pause, pacman) {
        if (!pause) {                     // Checks if game is not paused
            this.#move();                 // Calls #move to update position
            this.#changeDirection();      // Calls #changeDirection to update movement
        }
        this.#setImage(pacman);           // Calls #setImage with pacman arg to update appearance
        ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize); // Draws current ghost image
        // drawImage(image, x, y, width, height): Renders image at x, y with tileSize
    }

    // Checks collision with Pac-Man
    // - pacman: Pacman instance to check against
    collideWith(pacman) {
        const size = this.tileSize / 2;   // Calculates half tile size for collision box
        return (                          // Returns true if ghost and Pac-Man overlap
            this.x < pacman.x + size &&   // Checks if ghost’s left edge is left of Pac-Man’s right
            this.x + size > pacman.x &&   // Checks if ghost’s right edge is right of Pac-Man’s left
            this.y < pacman.y + size &&   // Checks if ghost’s top edge is above Pac-Man’s bottom
            this.y + size > pacman.y      // Checks if ghost’s bottom edge is below Pac-Man’s top
        );                                // Combines all conditions for overlap
    }

    // Sets the ghost’s image based on Pac-Man’s state
    // - pacman: Pacman instance for power dot status
    #setImage(pacman) {
        if (pacman.powerDotActive) {      // Checks if Pac-Man’s power dot is active
            this.#setImageWhenPowerDotIsActive(pacman); // Calls method to handle scared state
        } else {                          // If power dot is inactive
            this.image = this.normalGhost; // Sets image to normal ghost
        }
    }

    // Sets image when power dot is active
    // - pacman: Pacman instance for expiration status
    #setImageWhenPowerDotIsActive(pacman) {
        if (pacman.powerDotAboutToExpire) { // Checks if power dot is about to expire
            this.scaredAboutToExpireTimer--; // Decrements expiration timer
            if (this.scaredAboutToExpireTimer === 0) { // Checks if timer reaches 0
                this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault; // Resets timer to 10
                this.image = this.image === this.scaredGhost ? this.scaredGhost2 : this.scaredGhost; // Toggles scared images
            }
        } else {                          // If power dot is active but not expiring
            this.image = this.scaredGhost; // Sets image to scared ghost (blue)
        }
    }

    // Changes ghost’s direction randomly
    #changeDirection() {
        this.directionTimer--;            // Decrements direction change timer
        let newMoveDirection = null;      // Initializes new direction as null
        if (this.directionTimer === 0) {  // Checks if timer reaches 0
            this.directionTimer = this.directionTimerDefault; // Resets timer to default
            newMoveDirection = Math.floor(Math.random() * Object.keys(MovingDirection).length); // Picks random direction
            // Math.random(): Returns float 0 to <1
            // Object.keys(obj): Returns array of MovingDirection keys (4)
            // length: Number of directions (4)
            // Math.floor(num): Rounds down to integer (0-3)
        }
        if (newMoveDirection != null && this.movingDirection != newMoveDirection) { // Checks if new direction differs
            if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) { // Checks grid alignment
                // Number.isInteger(num): Returns true if num is an integer
                // Ensures ghost is on tile boundary for direction change
                if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, newMoveDirection)) { // Checks for collision
                    // didCollideWithEnvironment(x, y, direction): Returns true if wall ahead
                    this.movingDirection = newMoveDirection; // Updates direction if no collision
                }
            }
        }
    }

    // Updates ghost’s position based on direction
    #move() {
        if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.movingDirection)) { // Checks for collision
            // didCollideWithEnvironment(x, y, direction): Returns true if wall in path
            switch (this.movingDirection) { // Switches on current direction
                case MovingDirection.up:    // Up direction (0)
                    this.y -= this.velocity; // Moves up by subtracting velocity (2px)
                    break;
                case MovingDirection.down:  // Down direction (1)
                    this.y += this.velocity; // Moves down by adding velocity (2px)
                    break;
                case MovingDirection.left:  // Left direction (2)
                    this.x -= this.velocity; // Moves left by subtracting velocity (2px)
                    break;
                case MovingDirection.right: // Right direction (3)
                    this.x += this.velocity; // Moves right by adding velocity (2px)
                    break;
            }
        }
    }

    // Generates a random integer between min and max
    // - min: Minimum value (inclusive)
    // - max: Maximum value (inclusive)
    #random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // Returns random integer in range
        // Math.random(): Returns float 0 to <1
        // max - min + 1: Calculates range including both ends
        // Math.floor(num): Rounds down to nearest integer
        // Adds min to shift range from 0-based to min-based
    }
}