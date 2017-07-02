"use strict";

var fs  = require("fs");

const NUM_LETTERS = 26;

var Chall = {};

Chall.main = function(inputFileName) {

  fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      line = line.replace("\r", "");

      var count = 1;
      var currentPairsCluster = 0;

      for(var i = 1; i < line.length; i++) {

        if(parseInt(line.substring(i - 1, i + 1)) <= NUM_LETTERS) {

          currentPairsCluster++;
        }
        else if(currentPairsCluster > 0) {

          count *= countNumberOfWays(1 + currentPairsCluster);
          currentPairsCluster = 0;
        }
      }

      if(currentPairsCluster > 0) {
        
        count *= countNumberOfWays(1+currentPairsCluster);
      }

      console.log(count);
    }
  });
};

var globalMemo = {};

function fibonacci(num, memo) {

  memo = memo || {};

  if(memo[num]) {

    return memo[num];
  }

  if(num <= 1) {
    
    return 1;
  }

  memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);

  return memo[num];
}

function countNumberOfWays(size) {

  if(size <= 4) {

    if(size === 4) {

      return 5;
    }

    else {
      
      return size;
    }
  }
  else {

    return 2 * fibonacci(size - 2, globalMemo) + fibonacci(size - 3, globalMemo);
  }
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */

