// Imports tile size constant for rendering
import { TILE_SIZE } from './Constants.js'; // TILE_SIZE: 32px from constants

// Handles rendering game elements to the canvas
export default class Renderer {
    // Initializes renderer with canvas context
    // - canvas: HTMLCanvasElement for drawing
    constructor(canvas) {
        this.canvas = canvas;             // Stores canvas element
        this.ctx = canvas.getContext("2d"); // Gets 2D rendering context
        // getContext("2d"): Returns CanvasRenderingContext2D for 2D drawing
    }

    // Clears the entire canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clears canvas area
        // clearRect(x, y, width, height): Erases rectangle area from x, y with given size
    }

    // Draws the tile map
    // - tileMap: TileMap instance to render
    // - currentLevel: Number for current level (unused here)
    drawTileMap(tileMap, currentLevel) {
        tileMap.draw(this.ctx, currentLevel); // Calls tileMap’s draw method
        // draw(ctx, level): Renders tile map using provided context
    }

    // Draws Pac-Man
    // - pacman: Pacman instance to render
    // - pause: Boolean indicating game pause state
    // - enemies: Array of Enemy instances for interaction
    drawPacman(pacman, pause, enemies) {
        pacman.draw(this.ctx, pause, enemies); // Calls pacman’s draw method
        // draw(ctx, pause, enemies): Renders Pac-Man with context, pause state, and enemies
    }

    // Draws all enemies
    // - enemies: Array of Enemy instances
    // - pause: Boolean indicating game pause state
    // - pacman: Pacman instance for enemy interaction
    drawEnemies(enemies, pause, pacman) {
        enemies.forEach(enemy => enemy.draw(this.ctx, pause, pacman)); // Loops through enemies to draw each
        // forEach(callback): Executes callback for each enemy
        // draw(ctx, pause, pacman): Renders enemy with context, pause state, and pacman
    }

    // Draws score, level, lives, and time during gameplay
    // - gameState: GameState instance with game data
    drawScoreLevelAndLives(gameState) {
        if (!gameState.gameOver && !gameState.gameWin) { // Checks if game is active (not over or won)
            this.ctx.font = "20px Comic Sans MS"; // Sets font to 20px Comic Sans MS
            this.ctx.fillStyle = "yellow";    // Sets text color to yellow
            const scoreText = `Score: ${gameState.score}`; // Creates score string with current score
            this.ctx.fillText(scoreText, 10, 25); // Draws score text at x:10, y:25
            // fillText(text, x, y): Renders text at x, y position
            const scoreWidth = this.ctx.measureText(scoreText).width; // Measures score text width
            // measureText(text): Returns TextMetrics object; width is text length in pixels
            for (let i = 0; i < gameState.lives; i++) { // Loops through number of lives
                this.ctx.drawImage(this.loadImage("images/heart.png"), 10 + scoreWidth + 10 + i * 30, 10, 25, 25); // Draws heart icons
                // drawImage(image, x, y, width, height): Renders heart image at calculated x, y=10, size 25x25
                // x position: 10 (start) + scoreWidth + 10 (gap) + i * 30 (spacing)
            }
            this.ctx.fillText(`Level: ${gameState.currentLevel}`, this.canvas.width - 100, 25); // Draws level text
            // fillText(text, x, y): Renders level at right side (width - 100), y=25
            this.ctx.fillText(`Time: ${Math.floor(gameState.gameTimer / 75)} sec`, 10, 50); // Draws time text
            // Math.floor(num): Rounds down gameTimer/75 (frames to seconds) to integer
            // fillText(text, x, y): Renders time at x:10, y:50
        }
    }

    // Draws game end screen with animation
    // - gameState: GameState instance with end game data
    drawGameEnd(gameState) {
        if (gameState.gameOver || gameState.gameWin) { // Checks if game is over or won
            let endAnimationTimer = gameState.endAnimationTimer || 0; // Gets or sets timer to 0
            if (endAnimationTimer < 75) endAnimationTimer++; // Increments timer up to 75 frames
            gameState.endAnimationTimer = endAnimationTimer; // Updates gameState timer
            const opacity = Math.min(endAnimationTimer / 75, 1); // Calculates opacity (0 to 1 over 75 frames)
            // Math.min(a, b): Returns smaller of a (timer/75) or b (1)
            
            const boxWidth = 300;         // Sets box width to 300px
            const boxHeight = 150;        // Sets box height to 150px
            const boxX = (this.canvas.width - boxWidth) / 2; // Centers box horizontally
            const boxY = this.canvas.height / 2 - boxHeight / 2; // Centers box vertically
            
            this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity * 0.8})`; // Sets semi-transparent black fill
            this.ctx.beginPath();         // Starts new path for drawing
            // beginPath(): Clears current path for new shape
            this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20); // Defines rounded rectangle
            // roundRect(x, y, width, height, radius): Creates rectangle with 20px rounded corners
            this.ctx.fill();              // Fills rectangle with current fillStyle
            
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`; // Sets semi-transparent white outline
            this.ctx.lineWidth = 2;       // Sets outline thickness to 2px
            this.ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 20); // Defines same rounded rectangle
            this.ctx.stroke();            // Draws outline with strokeStyle
            
            const message = gameState.gameWin ? "Victory!" : "Game Over"; // Sets win or lose message
            this.ctx.font = "40px Comic Sans MS"; // Sets font to 40px Comic Sans MS
            const gradient = this.ctx.createLinearGradient(boxX, boxY, boxX + boxWidth, boxY); // Creates gradient
            // createLinearGradient(x1, y1, x2, y2): Defines gradient from left to right of box
            gradient.addColorStop(0, "cyan");    // Adds cyan at start
            gradient.addColorStop(0.5, "lime");  // Adds lime at midpoint
            gradient.addColorStop(1, "yellow");  // Adds yellow at end
            // addColorStop(offset, color): Sets color at offset (0 to 1)
            this.ctx.fillStyle = gradient;       // Sets fill to gradient
            this.ctx.globalAlpha = opacity;      // Applies opacity to all rendering
            const messageWidth = this.ctx.measureText(message).width; // Measures message text width
            // measureText(text): Returns TextMetrics object; width is text length in pixels
            const messageX = boxX + (boxWidth - messageWidth) / 2; // Centers message horizontally
            this.ctx.fillText(message, messageX, boxY + 50); // Draws message text
            // fillText(text, x, y): Renders message at centered x, y=50 from box top
            
            this.ctx.font = "20px Comic Sans MS"; // Sets font to 20px Comic Sans MS
            this.ctx.fillStyle = "white";        // Sets text color to white
            this.ctx.fillText(`Time: ${gameState.finalTime} sec`, boxX + 20, boxY + 85); // Draws time
            // fillText(text, x, y): Renders time at x=boxX+20, y=85 from box top
            if (gameState.gameWin) {             // Checks if game was won
                this.ctx.fillText(`Bonus: ${gameState.bonusPoints} pts`, boxX + 20, boxY + 110); // Draws bonus points
                // fillText(text, x, y): Renders bonus at x=boxX+20, y=110 from box top
                this.ctx.fillText(`Final Score: ${gameState.animatedScore}`, boxX + 20, boxY + 135); // Draws animated score
                // fillText(text, x, y): Renders final score at x=boxX+20, y=135 from box top
            } else {                             // If game over (not won)
                this.ctx.fillText(`Final Score: ${gameState.score}`, boxX + 20, boxY + 110); // Draws final score
                // fillText(text, x, y): Renders score at x=boxX+20, y=110 from box top
            }
            this.ctx.globalAlpha = 1;            // Resets opacity to full
        }
        
        // Handles level transition animation
        if (gameState.transitionTimer > 0) {     // Checks if transition is active
            let opacity;                         // Declares opacity variable
            if (gameState.transitionTimer > 100) { // Fade-in phase (150-100)
                opacity = (150 - gameState.transitionTimer) / 50; // Calculates fade-in opacity (0 to 1)
            } else if (gameState.transitionTimer > 50) { // Full opacity phase (100-50)
                opacity = 1;                     // Sets opacity to full
            } else {                             // Fade-out phase (50-0)
                opacity = gameState.transitionTimer / 50; // Calculates fade-out opacity (1 to 0)
            }
            this.ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Sets semi-transparent black fill
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); // Fills entire canvas
            // fillRect(x, y, width, height): Draws filled rectangle covering canvas
            
            this.ctx.font = "40px Comic Sans MS"; // Sets font to 40px Comic Sans MS
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; // Sets semi-transparent white text
            this.ctx.textAlign = "center";       // Centers text horizontally
            const levelText = `Level ${gameState.currentLevel}`; // Creates level text
            this.ctx.fillText(levelText, this.canvas.width / 2, this.canvas.height / 2); // Draws centered level text
            // fillText(text, x, y): Renders text at canvas center
            this.ctx.textAlign = "left";         // Resets text alignment to left
        }
    }

    // Loads an image from a given source
    // - src: String path to image file
    loadImage(src) {
        const img = new Image();             // Creates new Image object
        // new Image(): Constructs an HTMLImageElement
        img.src = src;                       // Sets image source to provided path
        return img;                          // Returns the loaded Image object
    }
}