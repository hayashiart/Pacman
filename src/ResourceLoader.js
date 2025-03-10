// Defines resource loading for the game
export default class ResourceLoader {
    // Initializes resource loader with an empty object
    constructor() {
        this.resources = {};              // Creates empty object to store resources
    }

    // Loads and returns all game resources (images and audio)
    loadResources() {
        // Images section
        this.resources.yellowDot = this.loadImage("images/yellowDot.png"); // Loads yellow dot image
        this.resources.pinkDot = this.loadImage("images/pinkDot.png");     // Loads pink dot image
        this.resources.wall = this.loadImage("images/wall.png");           // Loads wall image
        this.resources.heart = this.loadImage("images/heart.png");         // Loads heart image
        this.resources.pacman = [         // Creates array for Pac-Man animation frames
            this.loadImage("images/pac0.png"), // Loads closed mouth frame
            this.loadImage("images/pac1.png"), // Loads partially open mouth frame
            this.loadImage("images/pac2.png"), // Loads fully open mouth frame
            this.loadImage("images/pac1.png"), // Loads partially open mouth frame (repeat)
        ];                                // Stores array in resources.pacman
        this.resources.ghost = this.loadImage("images/ghost.png");         // Loads normal ghost image
        this.resources.scaredGhost = this.loadImage("images/scaredGhost.png"); // Loads scared ghost image (blue)
        this.resources.scaredGhost2 = this.loadImage("images/scaredGhost2.png"); // Loads alternate scared ghost image

        // Audio section
        this.resources.gameOverSound = new Audio("sounds/gameOver.wav");   // Creates Audio object for game over sound
        this.resources.gameWinSound = new Audio("sounds/gameWin.wav");     // Creates Audio object for game win sound
        this.resources.wakaSound = new Audio("sounds/waka.wav");           // Creates Audio object for waka sound
        this.resources.powerDotSound = new Audio("sounds/power_dot.wav");  // Creates Audio object for power dot sound
        this.resources.eatGhostSound = new Audio("sounds/eat_ghost.wav");  // Creates Audio object for eat ghost sound

        return this.resources;            // Returns the populated resources object
    }

    // Loads an image from a given source
    // - src: String path to image file
    loadImage(src) {
        const img = new Image();          // Creates new Image object
        // new Image(): Constructs an HTMLImageElement
        img.src = src;                    // Sets image source to provided path
        return img;                       // Returns the loaded Image object
    }
}