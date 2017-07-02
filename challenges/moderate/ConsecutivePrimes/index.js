"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {
      console.log(getCount(parseInt(line)));
    }
  });
};

/**
 * Helper that returns the final result
 */
function getCount(n) {

	// Trivial cases
	if(n <= 0) {
    return 0;
  }
	if(n === 1) {
    return 1;
  }

  // First value of all sequences (since they are circular, fixing a first value in all of them prevents duplicates)
  var startFrom = 1;

  // Build an half-matrix where (i,j) is true if i+j is prime
  var primeSumMask = [-1];
  for(var i=1; i<=n; i++) {

    primeSumMask[i] = [-1];

    for(var j = 1; j < i; j++) {

      if(isPrime(i + j)) {
        
        primeSumMask[i][j] = true;
      }
    }
  }

  /**
   * Helper function that uses the above matrix to tell if the sum of two numbers is prime
   */
  function isSumPrime(v1, v2) {

    if(v1 < v2) {
      return primeSumMask[v2][v1];
    }

    else if(v1 > v2) {
      
      return primeSumMask[v1][v2];
    }

    return false;
  }

  /**
   * Recursive function that counts all possible paths
   * @param current: the current number in the sequence
   * @param putSoFar: array where [i] is true if the number i was already used in previous paths
   * @param putCount: helper, equal to the number of cells with "true" in "putSoFar"
   */
  function recursiveInternal(current, putSoFar, putCount)  {

    // If we are at the end
    if(putCount === n - 1) {

      // Get last value to put
      var lastValue;
      for(var i = 1; i <= n; i++) {

        if(putSoFar[i]!==true) {

          lastValue = i;
          break;
        }
      }

      // Base step of recursion: if the last value is valid (i.e. sum is prime both with current and starting values) +1, otherwise 0
      if(isSumPrime(current, lastValue) && isSumPrime(lastValue, startFrom)) {
        
        return 1;
      }
      else {
        
        return 0;
      }
    }

    // Loop all values
    var count = 0;
    for(var j = 1; j <= n; j++) {

      // If it wasn't already used and it's valid (i.e. sum with current and j is prime)...
      if(putSoFar[j]!==true && isSumPrime(current, j)) {

        // Copy array and set current flag
        var newPutSoFar = putSoFar.slice(0);
        newPutSoFar[j] = true;

        // Recurse, adding the result to the current counter
        count += recursiveInternal(j, newPutSoFar, putCount + 1);
      }
    }

    return count;
  }

  // First call of the recursive function
  var initialPutSoFar = [-1];
  initialPutSoFar[startFrom] = true;
  return recursiveInternal(startFrom, initialPutSoFar, 1);
}

function isPrime(num) {
	
	if(isNaN(num) || !Number.isInteger(num) || num<=1) {
		
		return false;
	}

	if(num <= 3) {
		
		return true;
	}

	if(num % 2 === 0 || num % 3 === 0) {
		
		return false;
	}

	var i = 5;
	var w = 2;
	while(i * i <= num)	{
		
		if(num % i === 0) {
			
			return false;
		} 
		
		i += w;
		w = 6 - w;
	}
	
	return true;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */