/**
 * Summary. Run intcode pragram and return value in 0th position
 * @param {Array} inputData   Representation of intcode pgm
 * @param {int} noun          Value for noun (1st position in inputData)
 * @param {int} verb          Value for verb (2st position in inputData)
 */
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

/**
 * Summary. Restrore gravity assist program by setting the noun to 12 and verb to 2
 * @param {Array} inputData   Representation of intcode pgm
 */
function restoreGravityAssistProgram(inputData) {
  var noun = 12;
  var verb = 2;

  var output = runIntcodeProgram(inputData, noun, verb);

  return (
    "1202 Program Alarm State: the value in position 0 when the program halts is " +
    output.toString()
  );
}

/**
 * Summary. Find combination of noun and verb that will yield desiredOutput in 0th position
 * @param {Array} inputData       Representation of intcode pgm
 * @param {int} desiredOutput   Desired number in 0th position at the end
 */
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

/**
 * Summary. Find combination of noun and verb that will yield 19690720 in 0th position
 * @see testAllInputs
 * @param {Array} inputData     Representation of intcode pgm
 */
function completeGravityAssist(inputData) {
  var desiredOutput = 19690720;
  var { noun, verb } = testAllInputs(inputData, desiredOutput);

  if (!noun || !verb) return desiredOutput.toString() + " cannot be produced";
  else
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

module.exports = { restoreGravityAssistProgram, completeGravityAssist };
