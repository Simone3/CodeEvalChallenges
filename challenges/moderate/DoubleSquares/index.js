"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  var lines = fs.readFileSync(inputFileName).toString().split("\n");
  
  for(var i = 1; i < lines.length; i++) {

    if(lines[i]) {

      var N = parseInt(lines[i]);
      var sqrtHalfN = Math.sqrt(N / 2);

      var count = 0;
      for(var x = 0; x <= sqrtHalfN; x++) {
        
        if(Number.isInteger(Math.sqrt(N - Math.pow(x, 2)))) {

          count++;
        }
      }

      console.log(count); 
    }
  }
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */