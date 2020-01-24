var fs = require("fs");

/**
 * Summary. Helper function to sum all elements of array
 * @param {Array} arr   Array to sum all values
 */
var sumArray = arr => arr.reduce((a, b) => a + b, 0);

/**
 * Summary. Update coordinates where wire passes through
 *
 * @param {Array} wirePath    Path of wire according to direction and step
 * @param {Objectc} grid      Dictionary mapping grid location occupancy
 * @param {int} wireNum       Which wire (1st or second)
 * @param {int} numWires      Number of total wires (default 2)
 */
function updateGrid(wirePath, grid, wireNum, numWires = 2) {
  var x = 0;
  var y = 0;
  var steps = 0;
  var dx, dy;
  // to access indices correctly
  wireNum--;

  for (var i = 0; i < wirePath.length; i++) {
    var direction = wirePath[i][0];
    var units = parseInt(wirePath[i].substring(1));
    dx = 0;
    dy = 0;

    if (direction == "R") dx++;
    else if (direction == "L") dx--;
    else if (direction == "U") dy++;
    else if (direction == "D") dy--;

    for (var _ of Array(units).keys()) {
      x += dx;
      y += dy;
      steps++;

      var point = x.toString() + "," + y.toString();

      /**
       * Each grid location maps to an array that stores the number of steps
       * each wire requires to reach that location
       *    i.e. "2,3": [20, 15]
       *          wire 1 needs 20 steps to reach coordinate (2, 3)
       *          wire 2 needs 15 steps to reach coordinate (2, 3)
       * */
      if (!(point in grid)) grid[point] = new Array(numWires);

      // only record steps the first time the wire is in taht coordinate
      if (grid[point] != null) grid[point][wireNum] = steps;
    }
  }
}

/**
 * Summary. Find coordinates where all wires pass through
 *
 * @param {Object} grid   Dictionary mapping grid location occupancy
 */
function findIntersectionPoints(grid) {
  var intPoints = [];

  for (key in grid) {
    var emptyValues = 0;

    /** Check for any empty values
     * If an elemnt doesn't exist, the wire corresponding to that location doesn't
     * pass through that point (and no step count was recorded)
     */
    for (var stepCount of grid[key]) if (!stepCount) emptyValues++;

    // All values exist; all wires passed through that point
    if (emptyValues == 0) intPoints.push(key);
  }

  return intPoints;
}

/**
 * Summary. Find closest intersection point according to Manhattan distance
 * Description.
 *    Given points p and q, the Manhattan distance equals
 *        |px - qx| + |py - qy|
 *
 * @param {Array[int]} intPoints    List of coordinates where wires intersect
 */
function findLeastDist(intPoints) {
  var minDistance = 1e50;
  // circuit port coordinates
  var x = 0;
  var y = 0;

  for (p of intPoints) {
    var dist = Math.abs(x - p.split(",")[0]) + Math.abs(y - p.split(",")[1]);
    minDistance = Math.min(minDistance, dist);
  }

  return minDistance;
}

/**
 * Summary. Find closest intersection point according to total number of steps
 * Description.
 *    Total steps is the sum of the steps it takes each wire to reach that point
 *    If a wire passes through the point twice, use the step count from the first pass
 *
 * @param {Array[int]} intPoints    List of coordinates where wires intersect
 * @param {Object} grid             Dictionary mapping grid location occupancy
 */
function findLeastSteps(intPoints, grid) {
  var minSteps = 1e50;

  for (p of intPoints) {
    var sum = sumArray(grid[p]);
    minSteps = Math.min(minSteps, sum);
  }

  return minSteps;
}

var inputData = fs
  .readFileSync("day_3_input.txt")
  .toString()
  .split("\n");

var wirePath1 = inputData[0].split(",");
var wirePath2 = inputData[1].split(",");
var grid = {};

updateGrid(wirePath1, grid, 1);
updateGrid(wirePath2, grid, 2);

var intPoints = findIntersectionPoints(grid);
var minDist = findLeastDist(intPoints);
var leastSteps = findLeastSteps(intPoints, grid);

console.log("The closest intersection point is", minDist, "units away");
console.log("The closest intersection point is", leastSteps, "steps away");
