// Importing required modules
import * as fs from 'fs';
import * as readline from 'readline';

const limits = { red: 12, green: 13, blue: 14 };

// Function to process each line of the file and return the sum of first and last digits
async function processLineByLine() {
    // Creating a read stream for the file
    const fileStream = fs.createReadStream('data.csv');

    // An interface in this context is a way to define a contract for a certain structure of an object. Here, we are creating an interface using the readline module's createInterface method.
    // This interface will allow us to read the file line by line. It takes an object as an argument, which specifies the input stream and the delay for the carriage return line feed (CRLF).
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let sum: number = 0;

    // Looping through each line of the file
    for await (const line of rl) {
        // Initializing a variable to store the game data
        let gameData: string[][][] = [];
        let pass: boolean = true;

        // Splitting the line by colon to get the game number and the data
        const [gameNumber, gameInfo] = line.split(':');
        // Splitting the gameInfo by semicolon to get individual game entries
        const gameEntries = gameInfo.split(';').map(game => game.trim().split(',')).map(set => set.map(cubes => cubes.trim().split(' ')));
        // Pushing the game number and game entries to the gameData array
        gameData = [...gameEntries];
        console.log(JSON.stringify(gameData));

        const gameValue: number = Number(gameNumber.split(' ')[1]);
        /* 
                [
                    [
                        ["9", "green"], ["2", "blue"], ["12", "red"]
                    ],
                    [
                        ["2", "blue"], ["14", "red"], ["2", "green"]
                    ],
                    [
                        ["14", "red"], ["12", "green"]
                    ]
                ] 
        */
       
        /**
         * Loop through each game data and check if the value exceeds the color limit
         */
        for (const game of gameData) {
            for (const entry of game) {
                const value: number = Number(entry[0]);
                const color: string = entry[1];
                if (value > limits[color as keyof typeof limits]) {
                    pass = false;
                    break;
                }
            }
        }

        /**
         * If all game entries pass the limit check, add the game value to the sum
         */
        if (pass) {
            sum += gameValue;
        }
    }

    // Returning the game data
    return sum;
}

// Start the timer
console.time("Execution Time");

// Calling the function to process the file and log the sum
processLineByLine().then(sum => {
    console.log(sum);

    // End the timer and log the execution time
    console.timeEnd("Execution Time");
});

