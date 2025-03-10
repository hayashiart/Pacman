// Purpose: Defines an enumeration for movement directions in the Pac-Man game.
// - Provides a clear, numeric representation of the four cardinal directions.
// - Used to standardize direction handling across Pacman.js, Enemy.js, and TileMap.js.
// - Exported as a default object to simplify imports and usage in other modules.

const MovingDirection = {
    // Defines an object literal with direction properties mapped to numeric values.
    up: 0,    // Represents upward movement with value 0.
              // - Value: 0, an arbitrary but consistent identifier for 'up'.
              // - Used by: Pacman.js (#move), Enemy.js (movement logic), TileMap.js (collision checks).
              // - Why: Numeric values allow easy comparison and switching in movement logic.

    down: 1,  // Represents downward movement with value 1.
              // - Value: 1, distinct from other directions for unique identification.
              // - Used by: Same as 'up', for vertical downward motion.
              // - Why: Sequential numbering keeps the enum intuitive and ordered.

    left: 2,  // Represents leftward movement with value 2.
              // - Value: 2, continues the sequence for horizontal left motion.
              // - Used by: Same as above, for left movement checks and updates.
              // - Why: Clear distinction from right ensures accurate direction handling.

    right: 3, // Represents rightward movement with value 3.
              // - Value: 3, completes the four-direction set for right motion.
              // - Used by: Same as above, for right movement logic.
              // - Why: Completes the cardinal directions, aligning with game grid movement.
};
// Note: No semicolon here as it’s an object literal assigned to a const; semicolon follows export.

export default MovingDirection;
// Exports the MovingDirection object as the default export of this module.
// - No arguments: It’s a static enum, not a function or class requiring parameters.
// - Used by: Imported in other files (e.g., `import MovingDirection from './MovingDirection.js'`).
// - Why: Default export simplifies usage (no destructuring needed) and fits the single-purpose nature of this file.