import fs from "fs";
import readline from "readline";
import { performance } from "perf_hooks";

const startTime = performance.now();

let sum = 0;

/**
 * Counts the number of matching elements between two arrays.
 * @param array1 - The first array.
 * @param array2 - The second array.
 * @returns The count of matching elements.
 */
const countMatches = (array1: string[], array2: string[]): number => {
  return array1.filter((element) => array2.includes(element)).length;
};

/**
 * Calculates the score based on the number of matches.
 * The first match counts as 1 point, and each subsequent match doubles the points.
 * @param matchCount - The number of matches.
 * @returns The calculated score.
 */
const calculateScore = (matchCount: number): number => {
  if (matchCount === 0) return 0;
  // 2^(n-1) where n is the number of matches
  return 2 ** (matchCount - 1);
};

/**
 * Parses a CSV file and logs each line to the console.
 * @param filePath - The path to the CSV file.
 */
const parseCsv = async (filePath: string) => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const winNums = line
      .split(":")[1]
      .split("|")[0]
      .trim()
      .split(" ")
      .filter((entry) => entry.length);
    const myNums = line
      .split(":")[1]
      .split("|")[1]
      .trim()
      .split(" ")
      .filter((entry) => entry.length);

    const matches = countMatches(winNums, myNums);
    sum += calculateScore(matches);
  }
};

(async () => {
  // Parse the CSV file at 'data.csv'
  await parseCsv("data.csv");
  console.log(sum);
  const endTime = performance.now();
  console.log(
    `Parsing CSV and calculating scores took ${
      endTime - startTime
    } milliseconds`
  );
})();
