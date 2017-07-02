"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  var lines = fs.readFileSync(inputFileName).toString().split("\n");

  var size = parseInt(lines[0]);
  var longestLinesIndices = [1];
  var longestLinesLengths = [lines[1].length];

  for(var i = 2; i < lines.length; i++) {

    if(lines[i]) {

      if(lines[i].length > longestLinesLengths[longestLinesLengths.length-1]) {

        var j;
        for(j = 0; j < longestLinesLengths.length; j++) {

          if(longestLinesLengths[j] < lines[i].length) {

            break;
          }
        }

        if(j < size) {

          longestLinesIndices.splice(j, 0, i);
          longestLinesLengths.splice(j, 0, lines[i].length);

          longestLinesIndices.splice(size, 1);
          longestLinesLengths.splice(size, 1);
        }
      }
    }
  }

  for(var k=0; k<longestLinesIndices.length; k++) {

    console.log(lines[longestLinesIndices[k]]);
  }
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */