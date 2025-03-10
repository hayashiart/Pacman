// Manages high score saving and display with top 10 players
export default class Ranking {
    // Saves a new score to local storage, keeping top 10
    // - score: Number representing player’s score
    // - name: String of player’s name
    static saveScore(score, name) {
        let bestScores = JSON.parse(localStorage.getItem("bestScores")) || []; // Loads existing scores or empty array
        // localStorage.getItem(key): Retrieves string from storage or null if key doesn’t exist
        // JSON.parse(string): Parses JSON string into JS object; null defaults to empty array
        bestScores.push({ name, score, date: new Date().toLocaleString() }); // Adds new score entry to array
        // push(item): Appends new object with name, score, and date to bestScores array
        // new Date(): Creates a new Date object with current timestamp
        // toLocaleString(): Converts date to readable string (e.g., "3/10/2025, 2:30:45 PM")
        bestScores.sort((a, b) => b.score - a.score); // Sorts scores in descending order
        // sort(compareFn): Orders array; (a, b) => b.score - a.score prioritizes higher scores
        bestScores = bestScores.slice(0, 10); // Keeps only the top 10 scores
        // slice(start, end): Extracts subarray from index 0 to 10 (exclusive), limiting to 10 entries
        localStorage.setItem("bestScores", JSON.stringify(bestScores)); // Saves updated top 10 to local storage
        // JSON.stringify(obj): Converts JS object back to JSON string
        // setItem(key, value): Stores string in local storage under "bestScores" key
    }

    // Populates the ranking table with top 10 scores
    static populateTable() {
        const tbody = document.getElementById("rankingBody"); // Gets the table body element by ID
        // getElementById(id): Returns HTMLElement with ID "rankingBody" or null if not found
        tbody.innerHTML = "";                 // Clears all existing rows in the table body
        const bestScores = JSON.parse(localStorage.getItem("bestScores")) || []; // Loads scores or empty array
        // localStorage.getItem(key): Retrieves stored scores or null
        // JSON.parse(string): Converts JSON string to JS object; null defaults to empty array
        if (bestScores.length === 0) {        // Checks if there are no scores to display
            const row = document.createElement("tr"); // Creates a new table row element
            // createElement(tagName): Generates a new <tr> HTMLElement
            row.innerHTML = `<td colspan="4">No scores yet!</td>`; // Sets row content to a single cell spanning 4 columns
            // colspan="4": Spans across all 4 columns (Rank, Name, Score, Date)
            tbody.appendChild(row);           // Adds the "no scores" row to the table body
            // appendChild(node): Attaches the row as the last child of tbody
        } else {                              // If there are scores to display
            bestScores.forEach((entry, index) => { // Iterates over each score entry with its index
                // forEach(callback): Runs callback for each element; entry is the score object, index is its position
                const row = document.createElement("tr"); // Creates a new table row for each score
                // createElement(tagName): Generates a new <tr> HTMLElement
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td>${entry.score}</td>
                    <td>${entry.date}</td>
                `;                            // Sets row content with rank, name, score, and date in separate cells
                tbody.appendChild(row);       // Adds the populated row to the table body
                // appendChild(node): Attaches the row as the last child of tbody
            });
        }
    }
}