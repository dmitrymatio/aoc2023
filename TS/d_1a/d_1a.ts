// Importing required modules
import * as fs from 'fs';
import * as readline from 'readline';

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

    // Initializing a variable to store the sum of the data
    let sum = 0;

    // Looping through each line of the file
    for await (const line of rl) {
        // Removing all non-digit characters from the line
        const numbersOnly = line.replace(/\D/g, '');
        // Getting the first and last digit of the line
        const firstAndLastDigit = numbersOnly[0] + numbersOnly[numbersOnly.length - 1];
        // Adding the first and last digit to the sum
        sum += Number(firstAndLastDigit);
    }

    // Returning the sum
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
