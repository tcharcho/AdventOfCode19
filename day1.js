var fs = require("fs");

function findFuelRequirement(mass) {
  // calculate the fuel requirement as per given formula
  return Math.floor(mass / 3) - 2;
}

// Recursively calcualte the fuel requirement, taking into account the mass of the added fuel
function findModuleFuelRequirement(mass) {
  fuel = findFuelRequirement(mass);

  if (fuel <= 0) return 0;

  return fuel + findModuleFuelRequirement(fuel);
}

// Calculate total fuel requirements for part 1
function totalFuelRequirementPartOne(input) {
  var total = 0;

  input.forEach(mass => (total += findFuelRequirement(mass)));

  console.log(
    "The sum of the fuel requirements for all of the modules on the spacecraft is",
    total
  );
}

// Calculate total fuel requirements for part 2
function totalFuelRequirementPartTwo(input) {
  var total = 0;

  input.forEach(mass => (total += findModuleFuelRequirement(mass)));

  console.log(
    "The sum of the fuel requirements for all of the modules on the spacecraft (when also taking into account the mass of the added fuel) is",
    total
  );
}

// Read and parse data
var inputData = fs
  .readFileSync("day_1_input.txt")
  .toString()
  .split("\n");

// Solve both puzzles
totalFuelRequirementPartOne(inputData);
totalFuelRequirementPartTwo(inputData);
