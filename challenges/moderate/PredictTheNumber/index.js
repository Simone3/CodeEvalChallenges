"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

        console.log(getValueGoingBackPowerOfTwoRecursive(parseInt(line)));
    }
  });
}

function getValueGoingBackPowerOfTwoRecursive(n) {

  function countBackwardJumps(n) {

    if(n <= 0) {
      
      return 0;
    }

    var jump = Math.pow(2, Math.ceil(Math.log2(n + 1)) - 1);

    return 1 + countBackwardJumps(n - jump);
  }

  return countBackwardJumps(n) % 3;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */