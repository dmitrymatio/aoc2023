// Importing required modules
import * as fs from "fs";
import * as readline from "readline";

// Function to process each line of the file and return the sum of first and last digits
async function processLineByLine() {
  // Creating a read stream for the file
  const fileStream = fs.createReadStream("data.csv");

  // An interface in this context is a way to define a contract for a certain structure of an object. Here, we are creating an interface using the readline module's createInterface method.
  // This interface will allow us to read the file line by line. It takes an object as an argument, which specifies the input stream and the delay for the carriage return line feed (CRLF).
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  // Initializing a two-dimensional array to store the characters of each line
  const twoDimArray: string[][] = [];

  // Looping through each line of the file
  for await (const line of rl) {
    // Splitting the line into individual character strings array
    const charactersArray = line.split("");
    // Pushing the charactersArray to the two-dimensional array
    twoDimArray.push(charactersArray);
  }

  // Logging the two-dimensional array
  // console.log(twoDimArray);

  return twoDimArray;
}

// Start the timer
console.time("Execution Time");

(async function () {
  const csvProc = await processLineByLine();
  // console.log(csvProc);
  let sum = 0;

  // Parse the array of strings and find numbers
  for (const line of csvProc) {
    for (let i = 0; i < line.length; i++) {
      // Check if the current character is a digit
      if (/\d/.test(line[i])) {
        let numStr = line[i];
        let j = i + 1;

        // Continue to build the number string if subsequent characters are digits
        while (j < line.length && /\d/.test(line[j])) {
          numStr += line[j];
          j++;
        }

        // console.log("a", numStr);

        // Check surrounding positions for non-digit, non-period symbols in the current line
        // and also check the previous and next lines in the csvProc array
        let symbolFound = false;

        if (
          (i > 0 && /\D/.test(line[i - 1]) && line[i - 1] === "*") ||
          (j < line.length && /\D/.test(line[j]) && line[j] === "*")
        ) {
          symbolFound = true;
        }

        // Check the previous line if it exists
        const prevLine =
          csvProc.indexOf(line) > 0 ? csvProc[csvProc.indexOf(line) - 1] : null;
        if (prevLine) {
          const prevLineSplice = prevLine.slice(
            i > 0 ? i - 1 : i,
            j === prevLine.length - 1 ? j : j + 1
          );
          console.log(prevLineSplice);

          prevLineSplice.map((a) => {
            if (/\D/.test(a) && a !== ".") {
              symbolFound = true;
            }
          });
        }

        // Check the next line if it exists
        const nextLine =
          csvProc.indexOf(line) < csvProc.length - 1
            ? csvProc[csvProc.indexOf(line) + 1]
            : null;
        if (nextLine) {
          const nextLineSplice = nextLine.slice(
            i > 0 ? i - 1 : i,
            j === nextLine.length - 1 ? j : j + 1
          );
          console.log(nextLineSplice);

          nextLineSplice.map((a) => {
            if (/\D/.test(a) && a !== ".") {
              symbolFound = true;
            }
          });
        }
        console.log(numStr);

        if (symbolFound) {
          console.log(true, numStr);
          sum += parseInt(numStr, 10);
        }

        // Skip the characters that have been identified as part of the number
        i = j - 1;
      }
    }
  }

  console.log(`Sum of numbers with adjacent symbols: ${sum}`);
  // End the timer and log the execution time
  console.timeEnd("Execution Time");
})();
