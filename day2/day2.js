var fs = require("fs");

function runIntcodeProgram(inputData, noun, verb) {
  var intcodeProgram = Object.assign([], inputData);
  intcodeProgram[1] = noun;
  intcodeProgram[2] = verb;

  for (var i = 0; i < intcodeProgram.length; i += 4) {
    opcode = intcodeProgram[i];

    if (opcode == 99) break;

    param1 = intcodeProgram[i + 1];
    param2 = intcodeProgram[i + 2];
    param3 = intcodeProgram[i + 3];

    if (opcode == 1) {
      intcodeProgram[param3] = intcodeProgram[param1] + intcodeProgram[param2];
    } else if (opcode == 2) {
      intcodeProgram[param3] = intcodeProgram[param1] * intcodeProgram[param2];
    } else {
      console.error("ERROR: Unknown Opcode", opcode);
    }
  }

  return intcodeProgram[0];
}

function restoreGravityAssistProgram(inputData) {
  var noun = 12;
  var verb = 2;

  var output = runIntcodeProgram(inputData, noun, verb);

  console.log(
    "1202 Program Alarm State: the value in position 0 when the program halts is",
    output
  );
}

function testAllInputs(inputData, desiredOutput) {
  var noun;
  var verb;

  for (noun = 0; noun <= 99; noun++) {
    for (verb = 0; verb <= 99; verb++) {
      output = runIntcodeProgram(inputData, noun, verb);
      if (output == desiredOutput) return { noun, verb };
    }
  }

  return { noun: null, verb: null };
}

function completeGravityAssist(inputData) {
  var desiredOutput = 19690720;
  var { noun, verb } = testAllInputs(inputData, desiredOutput);

  if (!noun || !verb) console.log(desiredOutput, "cannot be produced");
  else
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
}

var inputData = fs
  .readFileSync("day_2_input.txt")
  .toString()
  .split(",")
  .map(function(x) {
    return parseInt(x, 10);
  });

restoreGravityAssistProgram(inputData);

console.time("completeGravityAssist");
completeGravityAssist(inputData);
console.timeEnd("completeGravityAssist");
