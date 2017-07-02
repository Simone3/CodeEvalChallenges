"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var num = parseInt(line);
      var sums = 0;

      while(true) {

        var pal = getPalindrome(num);

        if(pal === num) {

          console.log(sums+" "+pal);
          break;
        }

        num += pal;
        sums++;
      }
    }
  });
};

function getPalindrome(num) {

  var stringNum = num.toString();

  var result = "";
  for(var i = stringNum.length - 1; i >= 0; i--) {

    result += stringNum[i];
  }
  
  return parseInt(result);
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */