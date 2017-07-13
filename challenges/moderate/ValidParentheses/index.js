"use strict";

var fs  = require("fs");

const OK = "True",
      KO = "False";

const NEW_LINE = 10, // \n
      CARR_RET = 13; // \r

const BRACES = {
  41: 40,  // ): (
  93: 91,  // ]: [
  125: 123 // }: {
};

var Chall = {};

Chall.main = function(inputFileName) {

  var buffer = fs.readFileSync(inputFileName);
  
  var lifo = [];
  var skip = false;

  var complete = function() {

    console.log(lifo.length === 0 ? OK : KO);
    lifo.length = 0;
    skip = false;
  };

  for(var i = 0; i < buffer.length; i++) {

    if(buffer[i] === NEW_LINE) {

      complete();
    }
    else if(buffer[i] === CARR_RET) {

      complete();
      i++;
    }
    else if(!skip) {

      if(BRACES[buffer[i]]) {

        if(lifo.pop() !== BRACES[buffer[i]]) {

          skip = true;
          lifo.length = 1;
        }
      }
      else {

        lifo.push(buffer[i]);
      }
    }
  }
  
  complete();
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */