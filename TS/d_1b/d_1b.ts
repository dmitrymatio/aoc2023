// Importing required modules
import * as fs from 'fs';
import * as readline from 'readline';

// Function to replace matching names of digits between one and nine with the number equivalent
function replaceDigitNamesWithValues(str: string): string {
    const digitNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const digitValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Create a copy of the string to perform replacements
    let newStr = str;

    // Iterate over the string from left to right
    for (let i = 0; i < str.length; i++) {
        // For each character in the string, check if it starts a digit name
        for (let j = 0; j < digitNames.length; j++) {
            // If it does, replace the digit name with the corresponding digit value in the new string
            if (str.substring(i, i + digitNames[j].length) === digitNames[j]) {
                newStr = newStr.replace(digitNames[j], `${digitValues[j]}${digitNames[j][digitNames[j].length - 1]}`);
            }
        }
    }

    // Return the new string
    return newStr;
}

// console.log(replaceDigitNamesWithValues('4nineightseven2'));


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
        // Replacing digit names with their numeric values
        const lineWithNumericDigits = replaceDigitNamesWithValues(line);
        // Removing all non-digit characters from the line
        const numbersOnly = lineWithNumericDigits.replace(/\D/g, '');
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
