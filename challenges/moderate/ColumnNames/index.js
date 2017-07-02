"use strict";

var fs  = require("fs");

const LETTERS      = 26,
      ASCII_OFFSET = 64;

var Chall = {};

Chall.main = function(inputFileName) {

  fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var value = parseInt(line);
      var reversedLetters = [];

      while(value > 0) {

        var rem = value % LETTERS;
        value = Math.floor(value / LETTERS);

        if(rem === 0) {

          reversedLetters.push(LETTERS);
          value--;
        }
        else {

          reversedLetters.push(rem);
        }
      }

      for(var i = reversedLetters.length - 1; i >= 0; i--) {

        process.stdout.write(String.fromCharCode(ASCII_OFFSET+reversedLetters[i]));
      }
      process.stdout.write("\n");
    }
  });
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */