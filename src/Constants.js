// Purpose: Defines global constants used throughout the Pac-Man game.
// - These values are centralized here to ensure consistency across all modules.
// - Exporting them as constants prevents accidental modification during runtime.
// - Values are chosen to balance gameplay speed, visual clarity, and performance.

export const TILE_SIZE = 32; 
// Defines the size of each tile in the game map in pixels.
// - Value: 32 pixels, a power of 2, which aligns well with rendering and scaling.
// - Used by: TileMap.js (for map layout), Pacman.js and Enemy.js (for movement and positioning).
// - Why: 32px provides a good balance between detail and screen space, making the game visually clear.

export const VELOCITY = 2;   
// Sets the movement speed of Pac-Man and enemies in pixels per frame.
// - Value: 2 pixels per frame, meaning entities move 2px each frame at 75 FPS.
// - Used by: Pacman.js and Enemy.js (to update x/y positions in #move methods).
// - Why: 2px ensures smooth, controllable movement; it’s a factor of TILE_SIZE (32/2 = 16 frames to cross a tile).

export const TOTAL_LEVELS = 3; 
// Specifies the total number of levels in the game.
// - Value: 3, matching the three distinct maps defined in TileMap.js.
// - Used by: GameLoop.js (in checkGameWin to determine if the game ends or advances).
// - Why: Fixed at 3 to reflect the designed levels; keeps the game finite and structured.

export const FPS = 75;       
// Defines the frames per second for the game loop.
// - Value: 75 FPS, meaning the game updates 75 times per second.
// - Used by: GameLoop.js (to set the interval of the game loop: 1000/FPS ms).
// - Why: 75 FPS offers smooth animation without taxing lower-end systems; higher than 60 FPS for fluidity.