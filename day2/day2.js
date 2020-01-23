var {
  restoreGravityAssistProgram,
  completeGravityAssist
} = require("./bruteForce");

var { completeGravityAssistOptimized } = require("./optimized");
var fs = require("fs");

var originalInputData = fs
  .readFileSync("day_2_input.txt")
  .toString()
  .split(",")
  .map(function(x) {
    return parseInt(x, 10);
  });

console.log("\n|---- DAY 2: Part 1 ----|");
console.log(restoreGravityAssistProgram(originalInputData));

console.log("\n|---- DAY 2: Part 2 ----|");
console.log(completeGravityAssist(originalInputData));

// The original file was modified and the desired output can't be found with this file
var worstCaseInputData = fs
  .readFileSync("day_2_input_modified.txt")
  .toString()
  .split(",")
  .map(function(x) {
    return parseInt(x, 10);
  });

console.log("\nExecution time for worst case using brute force algorithm:");
console.time("completeGravityAssist");
completeGravityAssist(worstCaseInputData);
console.timeEnd("completeGravityAssist");

console.log("\nExecution time for worst case using optimized algorithm:");
console.time("completeGravityAssistOptimized");
completeGravityAssistOptimized(worstCaseInputData);
console.timeEnd("completeGravityAssistOptimized");
console.log();
