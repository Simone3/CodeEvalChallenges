"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

    if(line) {

      var temp = line.split(";");
      var list = temp[0].split(",");
      var k = parseInt(temp[1]);
      
      var length = list.length;
      var slicesLength = length - (length % k);

      // Loop all slices (skip any extra element at the end)
      var result = "";
      for(var i = 0; i < slicesLength; i = i + k) {

        // Reverse each slice in the result string
        for(var j = i + k - 1; j >= i; j--) {

          result += list[j] + ",";
        }
      }

      // Add any remaining elements as they appear
      for(var p = slicesLength; p < length; p++) {

        result += list[p] + ",";
      }

      console.log(result.slice(0, -1));
    }
  });
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */