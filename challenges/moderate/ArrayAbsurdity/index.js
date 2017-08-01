"use strict";

var fs  = require("fs");

const NEW_LINE = 10, // \n
      N_SEP    = 59, // ;
      ARR_SEP  = 44; // ,

var Chall = {};

Chall.main = function(inputFileName) {

  var buffer = fs.readFileSync(inputFileName);
  
  var currentVal = "";
  var N;
  var sum = 0;

  var output = function() {

    sum += parseInt(currentVal);
    console.log(sum - (N - 1) * (N - 2) / 2);
    sum = 0;
    currentVal = "";
  };

  for(var i = 0; i < buffer.length; i++) {
      
    if(buffer[i] === NEW_LINE) {
        
        output();
    }
    else if(buffer[i] === N_SEP) {
        
        N = parseInt(currentVal);
        currentVal = "";
    }
    else if(buffer[i] === ARR_SEP) {

        sum += parseInt(currentVal);
        currentVal = "";
    }
    else {

        currentVal += String.fromCharCode(buffer[i]);
    }
  }
  
   output();
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */