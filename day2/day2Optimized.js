/**
 * Summary. Restrore gravity assist program by setting the noun to 12 and verb to 2
 *
 * @see runIntcodeProgram
 * @param {Array[int]} inputData   Representation of intcode pgm
 */
function restoreGravityAssistProgram(inputData) {
  var noun = 12;
  var verb = 2;

  var { output, operations, operationOrder } = runIntcodeProgram(
    inputData,
    noun,
    verb
  );

  var msg =
    "1202 Program Alarm State: the value in position 0 when the program halts is" +
    output.toString();

  return { operations, operationOrder, msg };
}

/**
 * Summary. Run intcode pragram and return value in 0th position
 * Description.
 *    Track the operations performed and return a dictionary representation where the key is
 *    parameter 3 (index where value is stored), and the value is the operation performed
 *    (i.e. [parameter 1 +/* parameter 1])
 *
 *    Track the order in which operations are done and return an array of the parameter 3
 *    values that were modified (in order)
 *
 *
 * @param {Array} inputData   Representation of intcode pgm
 * @param {int} noun          Value for noun (1st position in inputData)
 * @param {int} verb          Value for verb (2st position in inputData)
 */
function runIntcodeProgram(inputData, noun, verb) {
  var intcodeProgram = Object.assign([], inputData);
  intcodeProgram[1] = noun;
  intcodeProgram[2] = verb;
  var operationOrder = [];
  var operations = {};

  for (var i = 0; i < intcodeProgram.length; i += 4) {
    opcode = intcodeProgram[i];

    if (opcode == 99) break;

    param1 = intcodeProgram[i + 1];
    param2 = intcodeProgram[i + 2];
    param3 = intcodeProgram[i + 3];
    var sign = opcode == 1 ? "+" : "*";

    if (opcode == 1) {
      intcodeProgram[param3] = intcodeProgram[param1] + intcodeProgram[param2];
    } else if (opcode == 2) {
      intcodeProgram[param3] = intcodeProgram[param1] * intcodeProgram[param2];
    } else {
      console.error("ERROR: Unknown Opcode", opcode);
    }

    /**
     * The value for noun and verb (i.e. the values in 1st and 2nd position)
     * are dynamic and will be determined at time of evaluation
     */
    if (i == 0) {
      param1 = "noun";
      param2 = "verb";
    }

    /**
     * Store the operation that will result in the value at position
     * intcodeProgram[parameter3]
     *      i.e. 3: [[10, "+", 2]]
     *        where 10 and 2 are referring to the 10th and 2nd positions
     */
    if (param3 in operations) {
      operations[param3].push([param1, sign, param2]);
    } else {
      operations[param3] = [[param1, sign, param2]];
    }

    operationOrder.push(param3);
  }

  return { output: intcodeProgram[0], operations, operationOrder };
}

/**
 * Summary. Build tree representations of the operations that were performed in each index
 * Description.
 *      The key is the index of the program, and the value is the resulting tree at the end
 *      of the program (i.e. if a value is overwritten, the old value will be erased)
 *
 * @see runIntcodeProgram       return values are passed to this function
 *
 * @param {Object} operations     Operations performed on each index of program
 * @param {Array[int]} order      Order in which operations were performed
 * @param {Array[int]} pgm        Representation of intcode pgm
 */
function buildFormulaTrees(operations, order, pgm) {
  var ops = Object.assign({}, operations);
  /**
   * The values in the 1st and 2nd index (noun and verb) are dynamic and will be determined
   * at time of evaluation; set 1 and 2 as dynamic nodes
   */
  var formulaTrees = { 1: "noun", 2: "verb" };

  for (var i = 0; i < order.length; i++) {
    // get the operation parameters (indices to use)
    var op = ops[order[i]].splice(0, 1)[0];
    var a = op[0];
    var b = op[2];
    var sign = op[1];

    /**
     * If a representation of the value in that index exists, set the variable to that
     * representation.
     * If the value is dynamic (noun/verb), set another dynamic node by
     * referring to the program at the index noun or verb (i.e. pgm[noun]).
     * Otherwise, find the value in program at that index
     */
    if (a in formulaTrees) a = formulaTrees[a];
    else if (a == "noun" || a == "verb") a = "pgm[" + a.toString() + "]";
    else a = pgm[a];

    if (b in formulaTrees) b = formulaTrees[b];
    else if (b == "noun" || b == "verb") b = "pgm[" + b.toString() + "]";
    else b = pgm[b];

    var formula = {
      root: sign,
      left: a,
      right: b
    };

    formulaTrees[order[i]] = formula;
  }

  return formulaTrees;
}

/**
 * Summary. Create a string respresentation of a mathematical formula represented as a tree
 * Description.
 *    tree {
 *      root: mathematical operation (+ or *)
 *      left: either an integer or a tree object
 *      right: either an integer or a tree object
 *    }
 *
 * @param {Object} tree    tree (or sub tree) representation of mathematical formula
 */
function getFormula(tree) {
  // Endnd of branch
  if (typeof tree !== "object") return tree;

  // get string representation of the left and right branches, and combine with +/* operation
  var left = getFormula(tree["left"]);
  var right = getFormula(tree["right"]);

  var subFormula =
    "( " + right.toString() + tree["root"] + left.toString() + " )";

  return subFormula;
}

/**
 * Summary. Find combination of noun and verb that will yield 19690720 in 0th position
 *
 * @param {Array[int]} inputData    Representation of intcode pgm
 */
function completeGravityAssistOptimized(inputData) {
  // run intcode program and get the operations and the order in which they were performed
  var { operations, operationOrder } = restoreGravityAssistProgram(inputData);

  var desiredOutput = 19690720;
  var pgm = Object.assign([], inputData);
  var noun;
  var verb;

  // Get the tree representation of the formula to the resulting value in 0th position
  var resTree = buildFormulaTrees(operations, operationOrder, inputData)[0];
  // Get string representation of formula
  var f = getFormula(resTree);

  for (noun = 0; noun <= 99; noun++) {
    for (verb = 0; verb <= 99; verb++) {
      pgm[1] = noun;
      pgm[2] = verb;

      if (eval(f) == desiredOutput) {
        return (
          (100 * noun + verb).toString() +
          " --> To produce " +
          desiredOutput.toString() +
          " the noun is " +
          noun.toString() +
          " and the verb is " +
          verb.toString()
        );
      }
    }
  }

  return desiredOutput.toString() + " cannot be produced";
}

module.exports = { completeGravityAssistOptimized };
