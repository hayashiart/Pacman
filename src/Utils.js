// Validates a date string in YYYY-MM-DD format
// - dateString: String in format "YYYY-MM-DD" to check
export function isValidDate(dateString) {
    const date = new Date(dateString);    // Creates Date object from string
    // new Date(string): Parses string into Date; invalid strings yield invalid Date
    const [year, month, day] = dateString.split("-").map(Number); // Splits and converts to numbers
    // split(separator): Splits string at "-" into array (e.g., ["2023", "05", "12"])
    // map(Number): Converts each string element to a number (e.g., [2023, 5, 12])
    return (                              // Returns true if date is valid
        date.getFullYear() === year &&    // Checks if parsed year matches input year
        // getFullYear(): Returns 4-digit year from Date object
        date.getMonth() + 1 === month &&  // Checks if parsed month matches (adding 1 as getMonth is 0-based)
        // getMonth(): Returns month (0-11), so +1 aligns with 1-12 input
        date.getDate() === day &&         // Checks if parsed day matches input day
        // getDate(): Returns day of month (1-31)
        year >= 1900 && year <= new Date().getFullYear() // Ensures year is between 1900 and current year
        // new Date(): Creates current date/time object
        // getFullYear(): Gets current year for upper bound
    );                                    // Combines conditions for validity
}