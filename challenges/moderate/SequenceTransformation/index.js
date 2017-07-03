"use strict";

var fs  = require("fs");

var Chall = {};

const B = "B",
      _0 = "0";

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

        if(line) {

            var values = line.replace("\r", "").split(" ");
            var seq01 = values[0].split("");
            var seqAB = values[1].split("");

            // Create list with counters, e.g. AAAABBA --> 4A,2B,1A
            var prev = seqAB[0];
            var countersAB = [];
            var count = 0;
            seqAB.forEach(function(s) {

                if(prev !== s) {

                    countersAB.push(new Counter(prev, count));
                    count = 0;
                    prev = s;
                }

                count++;
            });

            countersAB.push(new Counter(prev, count));

            console.log(checkRecursively(seq01, countersAB, 0, 0) ? "Yes" : "No");
        }
    });
};

function checkRecursively(seq01, countersAB, indexAB, index01) {

    var counter = countersAB[indexAB];
    var isLast = indexAB === countersAB.length - 1;

    // Loop all 01 digits that this counter can cover (e.g. if I have 4 As I can take at most 4 0s/1s)
    for(var digitsNum = 1; digitsNum <= counter.num; digitsNum++) {

        // If we reached the end of the 01 sequence or it's an invalid character, no need to go further
        if(index01 + digitsNum > seq01.length || (B === counter.value && _0 === seq01[index01 + digitsNum - 1])) {
            
            break;
        }

        // If this is the last counter, either return true (base case of recursion) or go to next number of digits
        if(isLast) {

            if(index01 + digitsNum === seq01.length) {
                
                return true;
            }

            else {
                
                continue;
            }
        }

        // Recursively call changing the two indices
        var isOk = checkRecursively(seq01, countersAB, indexAB + 1, index01 + digitsNum);

        // If a valid path has been found, it's ok
        if(isOk) {
            
            return true;
        }
    }

    // No valid path has been found
    return false;
}

/**
* Simple helper class that contains a value (A or B) and a number
*/
function Counter(value, num) {

    this.value = value;
    this.num = num;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */