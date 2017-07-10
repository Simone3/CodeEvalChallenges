"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  const INITIAL = 1;

  // Memoization object
  var memo = {
    slicesLengths: [("" + INITIAL).length],
    maxResult: INITIAL + " ",
    lastRow: [INITIAL]
  };

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var depth = parseInt(line);
      
      // Compute new rows, if not yet saved in memory
      for(var r = memo.slicesLengths.length; r < depth; r++) {
        
        memo.lastRow[r] = INITIAL;
        memo.maxResult += INITIAL + " ";

        var prev = memo.lastRow[0];
        for(var i = 1; i < r; i++) {

          memo.lastRow[i] += prev;
          prev = memo.lastRow[i] - prev;
          memo.maxResult += memo.lastRow[i] + " ";
        }

        memo.maxResult += INITIAL + " ";

        memo.slicesLengths[r] = memo.maxResult.length - 1;
      }

      // Print the correct slice of the memorized string
      console.log(memo.maxResult.slice(0, memo.slicesLengths[depth - 1]));
    }
  });
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */