// Defines audio management for the game
export default class AudioManager {
    // Initializes audio manager with sound resources
    // - resources: Object containing audio files
    constructor(resources) {
        this.resources = resources;       // Stores resources object with audio files
        this.muted = false;               // Sets initial muted state to false (sound on)
    }

    // Sets muted state for all audio resources
    // - muted: Boolean to enable/disable sound
    setMuted(muted) {
        this.muted = muted;               // Updates muted property with arg value
        Object.values(this.resources).forEach(resource => { // Loops through resource values
            // Object.values(obj): Returns array of resource object’s values (audio files)
            // forEach(callback): Executes callback for each resource
            if (resource instanceof Audio) resource.muted = muted; // Sets muted state if audio
            // instanceof: Checks if resource is an Audio object
        });
    }

    // Plays a specified sound if not muted
    // - sound: Audio object to play
    play(sound) {
        if (!this.muted) {                // Checks if sound is not muted
            sound.currentTime = 0;        // Resets audio to start (0 seconds)
            sound.play().catch(() => {}); // Plays sound, handles errors silently
            // play(): Starts audio playback, returns Promise
            // catch(callback): Handles playback errors (e.g., user interaction required)
            // Empty callback ignores errors to prevent crashes
        }
    }
}