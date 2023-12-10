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

// Self-invoking async function to process the CSV and calculate the sum
(async function () {
  // Await the processing of the CSV file
  const csvProc = await processLineByLine();
  // Initialize sum to accumulate the results
  let sum: number = 0;

  // Iterate over each line and character to parse and calculate the sum
  for (const [lineIdx, line] of csvProc.entries()) {
    for (let i = 0; i < line.length; i++) {
      // Check if the current character is a digit or an asterisk
      if (/[\d*]/.test(line[i])) {
        let gearStr: string = line[i];
        let iTemp: number = i - 1;

        // Traverse backwards to capture all preceding digits
        while (/\d/.test(line[iTemp])) {
          gearStr = line[iTemp] + gearStr;
          iTemp -= 1;
        }

        iTemp = i + 1;

        // Traverse forwards to capture all following digits
        while (/\d/.test(line[iTemp])) {
          gearStr = gearStr + line[iTemp];
          iTemp += 1;
        }

        /* 
        
        
        
        ADD CODE TO CHECK PREVIOUS LINE AND FOLLOWING LINE FOR ADJACENT NUMBERS
        
        
        
        
        */
        // Check if the string contains two sets of digits separated by an asterisk
        if (gearStr.split("*").length === 2) {
          // Extract the digits and calculate the product if both are valid numbers
          const parts = gearStr.split("*").map(Number);
          if (parts[0] && parts[1]) {
            sum += parts[0] * parts[1];
          }
        }
      }
    }
  }

  // Output the final sum
  console.log(`Sum of numbers with adjacent symbols: ${sum}`);
  // End the timer and log the execution time
  console.timeEnd("Execution Time");
})();
