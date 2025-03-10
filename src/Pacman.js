// Imports direction enum for movement
import MovingDirection from "./MovingDirection.js"; // Enum with up: 0, down: 1, left: 2, right: 3

// Defines Pac-Man’s behavior and rendering
export default class Pacman {
    // Initializes Pac-Man with position and properties
    // - x/y: Starting pixel coordinates
    // - tileSize: Size of each tile (e.g., 32px)
    // - velocity: Movement speed (e.g., 2px/frame)
    // - tileMap: TileMap instance for collision and eating
    // - incrementScore: Function to add points
    // - audioManager: Object for sound effects
    constructor(x, y, tileSize, velocity, tileMap, incrementScore, audioManager) {
        this.x = x;                       // Sets initial x position in pixels
        this.y = y;                       // Sets initial y position in pixels
        this.tileSize = tileSize;         // Sets tile size from arg (e.g., 32px)
        this.velocity = velocity;         // Sets movement speed from arg (e.g., 2px/frame)
        this.tileMap = tileMap;           // Stores TileMap reference for interactions
        this.incrementScore = incrementScore; // Stores score increment function
        this.audioManager = audioManager; // Stores audio manager for sound control
        this.currentMovingDirection = null; // Sets current direction to null (not moving)
        this.requestedMovingDirection = null; // Sets requested direction to null (no input)
        this.pacmanAnimationTimerDefault = 10; // Sets default animation timer to 10 frames
        this.pacmanAnimationTimer = null; // Initializes animation timer to null (off)
        this.pacmanRotation = this.Rotation.right; // Sets initial rotation to right (0)
        this.powerDotActive = false;      // Sets power dot effect to inactive
        this.powerDotAboutToExpire = false; // Sets power dot expiration flag to false
        this.timers = [];                 // Initializes empty array for timeout IDs
        this.madeFirstMove = false;       // Sets first move flag to false
        this.pacmanImages = this.loadPacmanImages(); // Calls loadPacmanImages to get image array
        this.pacmanImageIndex = 0;        // Sets initial image index to 0
    }

    // Defines rotation values for Pac-Man’s orientation
    Rotation = {
        right: 0,                         // Right rotation as 0
        down: 1,                          // Down rotation as 1
        left: 2,                          // Left rotation as 2
        up: 3,                            // Up rotation as 3
    };

    // Draws Pac-Man on the canvas
    // - ctx: CanvasRenderingContext2D for rendering
    // - pause: Boolean indicating if game is paused
    // - enemies: Array of Enemy instances for ghost interaction
    draw(ctx, pause, enemies) {
        if (!pause) {                     // Checks if game is not paused
            this.#move();                 // Calls #move to update position
            this.#animate();              // Calls #animate to update image
            this.#eatDot();               // Calls #eatDot to check for dots
            this.#eatPowerDot();          // Calls #eatPowerDot to check for power dots
            this.#eatGhost(enemies);      // Calls #eatGhost with enemies arg to check collisions
        }
        const size = this.tileSize / 2;   // Calculates half tile size for centering
        ctx.save();                       // Saves current canvas state
        // save(): Preserves current context settings (e.g., transformations)
        ctx.translate(this.x + size, this.y + size); // Moves origin to Pac-Man’s center
        // translate(x, y): Shifts canvas origin to x, y for rotation
        ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180); // Rotates canvas by rotation angle
        // rotate(angle): Rotates canvas in radians; converts 0-3 to 0-270 degrees
        ctx.drawImage(                    // Draws current Pac-Man image
            this.pacmanImages[this.pacmanImageIndex], // Image from array at current index
            -size,                        // X position relative to center (-16px)
            -size,                        // Y position relative to center (-16px)
            this.tileSize,                // Width of image (32px)
            this.tileSize                 // Height of image (32px)
        );                                // drawImage(image, x, y, width, height): Renders image
        ctx.restore();                    // Restores canvas state
        // restore(): Reverts to saved state, undoing transformations
    }

    // Loads Pac-Man animation images
    loadPacmanImages() {
        const pacmanImage1 = new Image(); // Creates new Image object for frame 1
        pacmanImage1.src = "../images/pac0.png"; // Sets source to closed mouth image
        const pacmanImage2 = new Image(); // Creates new Image object for frame 2
        pacmanImage2.src = "../images/pac1.png"; // Sets source to partially open mouth
        const pacmanImage3 = new Image(); // Creates new Image object for frame 3
        pacmanImage3.src = "../images/pac2.png"; // Sets source to fully open mouth
        const pacmanImage4 = new Image(); // Creates new Image object for frame 4
        pacmanImage4.src = "../images/pac1.png"; // Sets source to partially open mouth
        return [pacmanImage1, pacmanImage2, pacmanImage3, pacmanImage4]; // Returns array of images
    }

    // Updates Pac-Man’s position based on direction
    #move() {
        if (this.currentMovingDirection !== this.requestedMovingDirection) { // Checks if direction change requested
            if (Number.isInteger(this.x / this.tileSize) && Number.isInteger(this.y / this.tileSize)) { // Checks grid alignment
                // Number.isInteger(num): Returns true if num is an integer
                // Ensures Pac-Man is on a tile boundary for direction change
                if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.requestedMovingDirection)) // Checks for collision
                    // didCollideWithEnvironment(x, y, direction): Returns true if wall ahead
                    this.currentMovingDirection = this.requestedMovingDirection; // Updates direction if no collision
            }
        }
        if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection)) { // Checks current direction collision
            // didCollideWithEnvironment(x, y, direction): Returns true if wall in current path
            this.pacmanAnimationTimer = null; // Stops animation timer
            this.pacmanImageIndex = 1;    // Sets image to partially open mouth (stopped)
            return;                       // Exits function if collision occurs
        } else if (this.currentMovingDirection != null && this.pacmanAnimationTimer == null) { // Checks if moving and animation off
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault; // Starts animation with default 10 frames
            this.madeFirstMove = true;    // Sets flag to true on first movement
        }
        switch (this.currentMovingDirection) { // Switches on current direction
            case MovingDirection.up:      // Up direction (0)
                this.y -= this.velocity;  // Moves up by subtracting velocity (2px)
                this.pacmanRotation = this.Rotation.up; // Sets rotation to up (3)
                break;
            case MovingDirection.down:    // Down direction (1)
                this.y += this.velocity;  // Moves down by adding velocity (2px)
                this.pacmanRotation = this.Rotation.down; // Sets rotation to down (1)
                break;
            case MovingDirection.left:    // Left direction (2)
                this.x -= this.velocity;  // Moves left by subtracting velocity (2px)
                this.pacmanRotation = this.Rotation.left; // Sets rotation to left (2)
                break;
            case MovingDirection.right:   // Right direction (3)
                this.x += this.velocity;  // Moves right by adding velocity (2px)
                this.pacmanRotation = this.Rotation.right; // Sets rotation to right (0)
                break;
        }
    }

    // Animates Pac-Man’s mouth
    #animate() {
        if (this.pacmanAnimationTimer == null) return; // Exits if no animation active
        this.pacmanAnimationTimer--;          // Decrements animation timer
        if (this.pacmanAnimationTimer == 0) { // Checks if timer reaches 0
            this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault; // Resets timer to 10
            this.pacmanImageIndex++;          // Increments image index for next frame
            if (this.pacmanImageIndex == this.pacmanImages.length) // Checks if index exceeds array length
                this.pacmanImageIndex = 0;    // Resets index to 0 for looping
        }
    }

    // Enables or disables sound
    // - enabled: Boolean to toggle sound
    setSoundEnabled(enabled) {
        this.audioManager.setMuted(!enabled); // Sets audio muted state to opposite of enabled
        // setMuted(muted): Mutes audio if true, unmutes if false
    }

    // Handles eating regular dots
    #eatDot() {
        console.log("Position:", this.x, this.y, "madeFirstMove:", this.madeFirstMove); // Logs position and move flag
        if (this.tileMap.eatDot(this.x, this.y) && this.madeFirstMove) { // Checks if dot eaten and moved
            // eatDot(x, y): Returns true if dot at x, y is eaten, updates map
            console.log("Dot eaten!");        // Logs dot eaten event
            this.audioManager.play(this.audioManager.resources.wakaSound); // Plays waka sound
            // play(sound): Plays the given sound resource
            this.incrementScore(10);          // Adds 10 points to score
            // incrementScore(points): Increases score by points arg
        }
    }

    // Handles eating power dots
    #eatPowerDot() {
        if (this.tileMap.eatPowerDot(this.x, this.y) && this.madeFirstMove) { // Checks if power dot eaten and moved
            // eatPowerDot(x, y): Returns true if power dot at x, y is eaten, updates map
            this.audioManager.play(this.audioManager.resources.powerDotSound); // Plays power dot sound
            // play(sound): Plays the given sound resource
            this.powerDotActive = true;       // Activates power dot effect
            this.powerDotAboutToExpire = false; // Resets expiration flag
            this.incrementScore(50);          // Adds 50 points to score
            // incrementScore(points): Increases score by points arg
            this.timers.forEach(timer => clearTimeout(timer)); // Clears all existing timeouts
            // forEach(callback): Calls callback for each timer ID
            // clearTimeout(id): Cancels timeout with given ID
            this.timers = [];                 // Resets timers array to empty
            this.timers.push(                 // Adds new timeout to deactivate power dot
                setTimeout(() => {            // Schedules function after 6 seconds
                    this.powerDotActive = false; // Deactivates power dot effect
                    this.powerDotAboutToExpire = false; // Resets expiration flag
                }, 1000 * 6)                  // setTimeout(callback, ms): Runs callback after 6000ms
            );                                // push(item): Adds timeout ID to timers array
            this.timers.push(                 // Adds new timeout for expiration warning
                setTimeout(() => {            // Schedules function after 3 seconds
                    this.powerDotAboutToExpire = true; // Sets expiration flag
                }, 1000 * 3)                  // setTimeout(callback, ms): Runs callback after 3000ms
            );                                // push(item): Adds timeout ID to timers array
        }
    }

    // Handles eating ghosts
    // - enemies: Array of Enemy instances
    #eatGhost(enemies) {
        if (this.powerDotActive) {            // Checks if power dot effect is active
            const collideEnemies = enemies.filter(enemy => enemy.collideWith(this)); // Filters colliding enemies
            // filter(callback): Returns array of enemies where collideWith returns true
            // collideWith(pacman): Returns true if enemy collides with Pac-Man
            collideEnemies.forEach(enemy => { // Loops through colliding enemies
                // forEach(callback): Executes callback for each enemy
                enemies.splice(enemies.indexOf(enemy), 1); // Removes enemy from array
                // indexOf(item): Returns index of item in array
                // splice(start, deleteCount): Removes 1 element at index
                this.audioManager.play(this.audioManager.resources.eatGhostSound); // Plays ghost eaten sound
                // play(sound): Plays the given sound resource
                this.incrementScore(200);     // Adds 200 points to score
                // incrementScore(points): Increases score by points arg
            });
        }
    }

    // Resets Pac-Man to initial state
    // - position: Object with x and y coordinates
    reset(position) {
        this.x = position.x;                  // Sets x to initial x position
        this.y = position.y;                  // Sets y to initial y position
        this.currentMovingDirection = null;   // Resets current direction to null
        this.requestedMovingDirection = null; // Resets requested direction to null
        this.pacmanAnimationTimer = null;     // Stops animation timer
        this.pacmanImageIndex = 1;            // Sets image to partially open mouth
        this.powerDotActive = false;          // Deactivates power dot effect
        this.powerDotAboutToExpire = false;   // Resets expiration flag
        this.timers.forEach(timer => clearTimeout(timer)); // Clears all timeouts
        // forEach(callback): Calls callback for each timer ID
        // clearTimeout(id): Cancels timeout with given ID
        this.timers = [];                     // Resets timers array to empty
        this.madeFirstMove = false;           // Resets first move flag
    }
}