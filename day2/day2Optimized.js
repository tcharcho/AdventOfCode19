var fs = require("fs");

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

    if (i == 0) {
      param1 = "noun";
      param2 = "verb";
    }

    if (param3 in operations) {
      operations[param3].push([param1, sign, param2]);
    } else {
      operations[param3] = [[param1, sign, param2]];
    }

    operationOrder.push(param3);
  }

  return { output: intcodeProgram[0], operations, operationOrder };
}

function getFormula(tree) {
  if (typeof tree !== "object") return tree;

  var left = getFormula(tree["left"]);
  var right = getFormula(tree["right"]);

  var subFormula =
    "( " + right.toString() + tree["root"] + left.toString() + " )";

  return subFormula;
}

function buildFormulaTrees(operations, order, pgm) {
  var ops = Object.assign({}, operations);
  var formulaTrees = { 1: "noun", 2: "verb" };

  for (var i = 0; i < order.length; i++) {
    var op = ops[order[i]].splice(0, 1)[0];
    var a = op[0];
    var b = op[2];
    var sign = op[1];

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

function restoreGravityAssistProgram(inputData) {
  var noun = 12;
  var verb = 2;

  var { output, operations, operationOrder } = runIntcodeProgram(
    inputData,
    noun,
    verb
  );

  console.log(
    "1202 Program Alarm State: the value in position 0 when the program halts is",
    output
  );

  return { operations, operationOrder };
}

function completeGravityAssist(inputData, operations, operationOrder) {
  var desiredOutput = 19690720;
  var pgm = Object.assign([], inputData);
  var noun;
  var verb;

  var resTree = buildFormulaTrees(operations, operationOrder, inputData)[0];
  var f = getFormula(resTree);

  for (noun = 0; noun <= 99; noun++) {
    for (verb = 0; verb <= 99; verb++) {
      pgm[1] = noun;
      pgm[2] = verb;

      if (eval(f) == desiredOutput) {
        console.log(
          (100 * noun + verb).toString(),
          "-->",
          "To produce",
          desiredOutput,
          "the noun is",
          noun,
          "and the verb is",
          verb
        );
        return;
      }
    }
  }

  console.log(desiredOutput, "cannot be produced");
}

var inputData = fs
  .readFileSync("day_2_input.txt")
  .toString()
  .split(",")
  .map(function(x) {
    return parseInt(x, 10);
  });

var { operations, operationOrder } = restoreGravityAssistProgram(inputData);

console.time("completeGravityAssist");
completeGravityAssist(inputData, operations, operationOrder);
console.timeEnd("completeGravityAssist");
