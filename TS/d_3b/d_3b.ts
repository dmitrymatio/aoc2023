// Importing required modules
import * as fs from "fs";
import * as readline from "readline";

/**
 * Asynchronously processes each line of a CSV file.
 * Assumes that the CSV file contains strings of digits separated by asterisks.
 * Returns a two-dimensional array with each line's characters as a separate array.
 */
async function processLineByLine() {
  // Creating a read stream for the file
  const fileStream = fs.createReadStream("data.csv");

  // Creating a readline interface to read the file line by line.
  // The crlfDelay option treats all instances of CR LF ('\r\n') as a single line break.
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Initializing a two-dimensional array to store the characters of each line
  const twoDimArray: string[][] = [];

  // Looping through each line of the file asynchronously
  for await (const line of rl) {
    // Splitting the line into an array of individual characters
    const charactersArray = line.split("");
    // Adding the characters array to the two-dimensional array
    twoDimArray.push(charactersArray);
  }

  // The two-dimensional array is returned for further processing
  return twoDimArray;
}

// Start the timer to measure execution time
console.time("Execution Time");

/**
 * Finds the full number in a string array around a given index.
 * It checks both left and right directions for consecutive digits to form a full number.
 * @param arr The array of strings representing characters in a line.
 * @param idx The index around which to search for the number.
 * @returns An object with the full number as an integer and a found flag indicating if a number was found.
 */
const findFullNumber = (
  arr: string[],
  idx: number
): { number: number | null; found: boolean } => {
  let numStr = "";
  let i = idx;

  // Check to the left
  while (i >= 0 && /\d/.test(arr[i])) {
    numStr = arr[i] + numStr;
    i--;
  }

  // Reset index for right check, skipping the current index as it's already included
  i = idx + 1;

  // Check to the right
  while (i < arr.length && /\d/.test(arr[i])) {
    numStr += arr[i];
    i++;
  }

  return {
    number: numStr.length > 0 ? parseInt(numStr, 10) : null,
    found: numStr.length > 0,
  };
};

// Self-invoking async function to process the CSV and calculate the sum
(async function () {
  // Await the processing of the CSV file
  const csvProc = await processLineByLine();
  // Initialize sum to accumulate the results
  let sum: number = 0;

  // Iterate over each line and character to parse and calculate the sum
  for (const [lineIdx, line] of csvProc.entries()) {
    for (let i = 0; i < line.length; i++) {
      const point = line[i];
      if (/[*]/.test(point)) {
        console.log(`Asterisk at vertical: ${lineIdx}, horizontal: ${i}`);

        // Initialize an array to store found numbers
        let foundNumbers: number[] = [];

        // Check above the asterisk for a number
        if (lineIdx > 0 && /\d/.test(csvProc[lineIdx - 1][i])) {
          const { number, found } = findFullNumber(csvProc[lineIdx - 1], i);
          if (found && number !== null) {
            foundNumbers.push(number);
          }
        } else {
          // Check diagonally to the top-left of the asterisk for a number
          if (lineIdx > 0 && i > 0 && /\d/.test(csvProc[lineIdx - 1][i - 1])) {
            const { number, found } = findFullNumber(
              csvProc[lineIdx - 1],
              i - 1
            );
            if (found && number !== null) {
              foundNumbers.push(number);
            }
          }
          // Check diagonally to the top-right of the asterisk for a number
          if (
            lineIdx > 0 &&
            i < line.length - 1 &&
            /\d/.test(csvProc[lineIdx - 1][i + 1])
          ) {
            const { number, found } = findFullNumber(
              csvProc[lineIdx - 1],
              i + 1
            );
            if (found && number !== null) {
              foundNumbers.push(number);
            }
          }
        }
        // Check below the asterisk for a number
        if (
          lineIdx < csvProc.length - 1 &&
          /\d/.test(csvProc[lineIdx + 1][i])
        ) {
          const { number, found } = findFullNumber(csvProc[lineIdx + 1], i);
          if (found && number !== null) {
            foundNumbers.push(number);
          }
        } else {
          // Check diagonally to the bottom-left of the asterisk for a number
          if (
            lineIdx < csvProc.length - 1 &&
            i > 0 &&
            /\d/.test(csvProc[lineIdx + 1][i - 1])
          ) {
            const { number, found } = findFullNumber(
              csvProc[lineIdx + 1],
              i - 1
            );
            if (found && number !== null) {
              foundNumbers.push(number);
            }
          }
          // Check diagonally to the bottom-right of the asterisk for a number
          if (
            lineIdx < csvProc.length - 1 &&
            i < line.length - 1 &&
            /\d/.test(csvProc[lineIdx + 1][i + 1])
          ) {
            const { number, found } = findFullNumber(
              csvProc[lineIdx + 1],
              i + 1
            );
            if (found && number !== null) {
              foundNumbers.push(number);
            }
          }
        }

        // Check to the left of the asterisk for a number
        if (i > 0 && /\d/.test(line[i - 1])) {
          const { number, found } = findFullNumber(line, i - 1);
          if (found && number !== null) {
            foundNumbers.push(number);
          }
        }
        // Check to the right of the asterisk for a number
        if (i < line.length - 1 && /\d/.test(line[i + 1])) {
          const { number, found } = findFullNumber(line, i + 1);
          if (found && number !== null) {
            foundNumbers.push(number);
          }
        }

        // If two numbers are found, multiply them and add to the sum
        if (foundNumbers.length >= 2) {
          foundNumbers.sort((a, b) => b - a);
          console.log(foundNumbers);
          console.log(foundNumbers[0], foundNumbers[1]);

          sum += foundNumbers[0] * foundNumbers[1];
        }
      }
    }
  }

  // Output the final sum
  console.log(`Sum: ${sum}`);

  // Stop the timer and output the execution time
  console.timeEnd("Execution Time");
})();

// This line ensures the script doesn't exit immediately and waits for the async operations to complete
setImmediate(() => {});
