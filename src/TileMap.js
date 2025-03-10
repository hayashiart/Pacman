// Imports dependencies for map functionality
import Pacman from "./Pacman.js";             // Pacman class for creating Pac-Man instances
import Enemy from "./Enemy.js";               // Enemy class for creating ghost instances
import MovingDirection from "./MovingDirection.js"; // Enum for movement directions (up, down, left, right)
import { TILE_SIZE, VELOCITY } from "./Constants.js"; // TILE_SIZE: 32px, VELOCITY: 2px/frame from constants

// Manages the game map, including layout and entities
export default class TileMap {
    // Sets up the map with resources and level-specific layout
    // - resources: Object containing images and sounds
    // - level: Number (1-3) to select the map
    constructor(resources, level) {
        this.tileSize = TILE_SIZE;            // Sets tile size to 32px from TILE_SIZE constant
        this.resources = resources;           // Stores resources object for image access
        this.yellowDot = this.resources.yellowDot; // Assigns yellow dot image from resources
        this.pinkDot = this.resources.pinkDot;     // Assigns pink dot image from resources
        this.wall = this.resources.wall;           // Assigns wall image from resources
        this.powerDot = this.pinkDot;         // Sets initial power dot image to pink dot
        this.powerDotAnimationTimerDefault = 30; // Sets default animation timer to 30 frames
        this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault; // Initializes timer to 30
        this.level = level;                   // Stores level number (1-3)
        this.map = this.getMapForLevel(level); // Calls getMapForLevel with level arg to set map
    }

    // Returns the map array for the specified level
    // - level: Number (1-3) to choose the map
    getMapForLevel(level) {
        this.level = level;                   // Updates instance level with given arg
        switch (level) {                      // Switches on level value to select map
            case 1:                           // Case for level 1
                return [                      // Returns 13x11 grid for level 1
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 1: wall, 7: power dot, 4: Pac-Man, 0: dot, 6: enemy
                    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
                    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                ];
            case 2:                           // Case for level 2
                return [                      // Returns 15x12 grid for level 2
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 7, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 7, 1],
                    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 6, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
                    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                ];
            case 3:                           // Case for level 3
                return [                      // Returns 17x12 grid for level 3
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 7, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 7, 1],
                    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
                    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 6, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                    [1, 0, 1, 1, 1, 7, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
                    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                ];
            default:                          // Fallback for invalid level
                return this.getMapForLevel(1); // Recursively calls with level 1 as default
        }
    }

    // Draws the map on the canvas
    // - ctx: CanvasRenderingContext2D for rendering
    draw(ctx) {
        for (let row = 0; row < this.map.length; row++) { // Loops through each row of map
            for (let column = 0; column < this.map[row].length; column++) { // Loops through each column in row
                let tile = this.map[row][column]; // Gets tile value at row, column
                if (tile === 1) {             // Checks if tile is a wall (1)
                    this.#drawWall(ctx, column, row, this.tileSize); // Calls #drawWall with ctx, column, row, size
                } else if (tile === 0) {      // Checks if tile is a dot (0)
                    this.#drawDot(ctx, column, row, this.tileSize); // Calls #drawDot with ctx, column, row, size
                } else if (tile === 7) {      // Checks if tile is a power dot (7)
                    this.#drawPowerDot(ctx, column, row, this.tileSize); // Calls #drawPowerDot with ctx, column, row, size
                } else {                      // Handles all other tile types (e.g., 5, 6 after replacement)
                    this.#drawBlank(ctx, column, row, this.tileSize); // Calls #drawBlank with ctx, column, row, size
                }
            }
        }
    }

    // Draws a regular dot at a position
    // - ctx: Canvas context for drawing
    // - column/row: Grid coordinates
    // - size: Tile size (32px)
    #drawDot(ctx, column, row, size) {
        ctx.drawImage(this.yellowDot, column * this.tileSize, row * this.tileSize, size, size); // Draws yellow dot
        // drawImage(image, x, y, width, height): Renders image at x, y with given size
    }

    // Draws an animated power dot
    // - ctx: Canvas context for drawing
    // - column/row: Grid coordinates
    // - size: Tile size (32px)
    #drawPowerDot(ctx, column, row, size) {
        this.powerDotAnimationTimer--;        // Decrements timer for animation
        if (this.powerDotAnimationTimer === 0) { // Checks if timer reaches 0
            this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault; // Resets timer to 30
            this.powerDot = this.powerDot === this.pinkDot ? this.yellowDot : this.pinkDot; // Toggles between pink and yellow
        }
        ctx.drawImage(this.powerDot, column * size, row * size, size, size); // Draws current power dot image
        // drawImage(image, x, y, width, height): Renders powerDot at x, y with size
    }

    // Draws a wall tile
    // - ctx: Canvas context for drawing
    // - column/row: Grid coordinates
    // - size: Tile size (32px)
    #drawWall(ctx, column, row, size) {
        ctx.drawImage(this.wall, column * this.tileSize, row * this.tileSize, size, size); // Draws wall image
        // drawImage(image, x, y, width, height): Renders wall at x, y with size
    }

    // Draws a blank space
    // - ctx: Canvas context for drawing
    // - column/row: Grid coordinates
    // - size: Tile size (32px)
    #drawBlank(ctx, column, row, size) {
        ctx.fillStyle = "black";              // Sets fill color to black
        ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size); // Fills rectangle with black
        // fillRect(x, y, width, height): Draws a filled rectangle at x, y with size
    }

    // Creates and returns a new Pac-Man instance
    // - incrementScore: Function to add points to score
    // - audioManager: Object for managing sound effects
    getPacman(incrementScore, audioManager) {
        for (let row = 0; row < this.map.length; row++) { // Loops through map rows
            for (let column = 0; column < this.map[row].length; column++) { // Loops through columns in row
                if (this.map[row][column] === 4) { // Checks for Pac-Man start tile (4)
                    this.map[row][column] = 0; // Replaces start tile with dot (0)
                    return new Pacman(        // Creates and returns new Pacman instance
                        column * this.tileSize, // X position in pixels (column * 32)
                        row * this.tileSize,    // Y position in pixels (row * 32)
                        this.tileSize,          // Tile size (32px)
                        VELOCITY,               // Movement speed (2px/frame)
                        this,                   // Reference to this TileMap instance
                        incrementScore,         // Function to increment score
                        audioManager            // Audio manager for sound effects
                    );
                }
            }
        }
    }

    // Creates and returns an array of enemy instances
    getEnemies() {
        const enemies = [];                   // Initializes empty array for enemies
        for (let row = 0; row < this.map.length; row++) { // Loops through map rows
            for (let column = 0; column < this.map[row].length; column++) { // Loops through columns in row
                if (this.map[row][column] === 6) { // Checks for enemy start tile (6)
                    this.map[row][column] = 0; // Replaces start tile with dot (0)
                    enemies.push(             // Adds new Enemy to array
                        new Enemy(            // Creates new Enemy instance
                            column * this.tileSize, // X position in pixels (column * 32)
                            row * this.tileSize,    // Y position in pixels (row * 32)
                            this.tileSize,          // Tile size (32px)
                            VELOCITY,               // Movement speed (2px/frame)
                            this,                   // Reference to this TileMap instance
                            this.resources          // Resources object for enemy images
                        )
                    );                        // push(): Adds element to end of enemies array
                }
            }
        }
        return enemies;                       // Returns array of Enemy instances
    }

    // Sets the canvas size based on map dimensions
    // - canvas: HTMLCanvasElement to resize
    setCanvasSize(canvas) {
        canvas.width = this.map[0].length * this.tileSize;  // Sets canvas width to columns * 32px
        canvas.height = this.map.length * this.tileSize;    // Sets canvas height to rows * 32px
    }

    // Checks if movement in a direction hits a wall
    // - x/y: Current position in pixels
    // - direction: MovingDirection value (0-3)
    didCollideWithEnvironment(x, y, direction) {
        if (direction == null) return false;  // Returns false if direction is null, no check needed
        if (Number.isInteger(x / this.tileSize) && Number.isInteger(y / this.tileSize)) { // Checks if x, y align with grid
            // Number.isInteger(num): Returns true if num is an integer
            // Ensures position is on a tile boundary for collision check
            let column = 0, row = 0, nextColumn = 0, nextRow = 0; // Declares variables for current and next tile coords
            switch (direction) {              // Switches on direction to calculate next position
                case MovingDirection.right:   // Right direction (3)
                    nextColumn = x + this.tileSize; // Calculates next x position (moves right 32px)
                    column = nextColumn / this.tileSize; // Converts next x to column index
                    row = y / this.tileSize;  // Converts current y to row index
                    break;
                case MovingDirection.left:    // Left direction (2)
                    nextColumn = x - this.tileSize; // Calculates next x position (moves left 32px)
                    column = nextColumn / this.tileSize; // Converts next x to column index
                    row = y / this.tileSize;  // Converts current y to row index
                    break;
                case MovingDirection.up:      // Up direction (0)
                    nextRow = y - this.tileSize; // Calculates next y position (moves up 32px)
                    row = nextRow / this.tileSize; // Converts next y to row index
                    column = x / this.tileSize; // Converts current x to column index
                    break;
                case MovingDirection.down:    // Down direction (1)
                    nextRow = y + this.tileSize; // Calculates next y position (moves down 32px)
                    row = nextRow / this.tileSize; // Converts next y to row index
                    column = x / this.tileSize; // Converts current x to column index
                    break;
            }
            return this.map[row] && this.map[row][column] === 1; // Returns true if next tile is a wall (1)
            // Checks if row exists and tile at (row, column) is 1
        }
        return false;                         // Returns false if not on grid, no collision possible
    }

    // Checks if all dots are eaten to win
    didWin() {
        return this.dotsLeft() === 0;         // Returns true if dotsLeft() returns 0, all dots eaten
    }

    // Counts remaining dots on the map
    dotsLeft() {
        return this.map.flat().filter(tile => tile === 0).length; // Returns count of dot tiles (0)
        // flat(): Flattens 2D map array into 1D array, no args
        // filter(callback): Returns array of tiles where callback returns true (tile === 0)
        // length: Returns number of elements in filtered array
    }

    // Handles eating a regular dot
    // - x/y: Pac-Man’s position in pixels
    eatDot(x, y) {
        const centerX = x + this.tileSize / 2; // Calculates center x of Pac-Man for precise tile check
        const centerY = y + this.tileSize / 2; // Calculates center y of Pac-Man for precise tile check
        const row = Math.floor(centerY / this.tileSize); // Converts center y to row index
        // Math.floor(num): Rounds num down to nearest integer
        const column = Math.floor(centerX / this.tileSize); // Converts center x to column index
        // Math.floor(num): Rounds num down to nearest integer
        console.log(`Checking tile (${column}, ${row}):`, this.map[row] ? this.map[row][column] : "Out of bounds"); // Logs tile position and value
        if (this.map[row] && this.map[row][column] === 0) { // Checks if row exists and tile is a dot (0)
            this.map[row][column] = 5;        // Sets tile to 5 (blank) to mark it eaten
            return true;                      // Returns true to indicate dot was eaten
        }
        return false;                         // Returns false if no dot at position
    }

    // Handles eating a power dot
    // - x/y: Pac-Man’s position in pixels
    eatPowerDot(x, y) {
        const row = y / this.tileSize;        // Converts y to row index
        const column = x / this.tileSize;     // Converts x to column index
        if (Number.isInteger(row) && Number.isInteger(column) && this.map[row][column] === 7) { // Checks if power dot is at position
            // Number.isInteger(num): Returns true if num is an integer, ensures exact tile alignment
            // this.map[row][column] === 7: Confirms tile is a power dot
            this.map[row][column] = 5;        // Sets tile to 5 (blank) to mark it eaten
            return true;                      // Returns true to indicate power dot was eaten
        }
        return false;                         // Returns false if no power dot at position
    }
}