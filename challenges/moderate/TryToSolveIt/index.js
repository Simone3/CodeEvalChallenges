"use strict";

var fs  = require("fs");

var Chall = {};

const UNICODE_DELTA = 97;

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    line = line.replace("\r", "");
    
    if(line) {

      for(var i = 0; i < line.length; i++) {
        
        var index = line[i].charCodeAt(0) - UNICODE_DELTA;

        var jump;
        if(index >= 0 && index <= 5) {
            jump = 20;
        }
        else if(index >= 6 && index <= 12) {
            jump = 7;
        }
        else if(index >= 13 && index <= 19) {
            jump = -7;
        }
        else {
            jump = -20;
        }
        
        process.stdout.write(String.fromCharCode(UNICODE_DELTA + index + jump));
      }

      process.stdout.write("\n");
    }
  });
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */