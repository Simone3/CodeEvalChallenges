"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

  var triangle = [];

  // Read triangle from input
	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

      triangle.push(line.trim().split(' '));
    }
  });

  // Loop triangle rows
  triangle[0][0] = parseInt(triangle[0][0]);
  for(var row = 1; row < triangle.length; row++) {

    // Loop triangle columns
    for(var col = 0; col < triangle[row].length; col++) {

      // Get max sum in parent(s), i.e. biggest path so far that ends in the current element
      var maxParentSum;
      if(col === 0) {

        maxParentSum = triangle[row - 1][col];
      }
      else if(col === triangle[row].length - 1) {

        maxParentSum = triangle[row - 1][col - 1];
      }
      else {

        var leftParentSum = triangle[row - 1][col - 1];
        var rightParentSum = triangle[row - 1][col];
        maxParentSum = leftParentSum>rightParentSum ? leftParentSum : rightParentSum;
      }

      // In this cell of the triangle, put maximum sum of the parents plus the current element itself
      triangle[row][col] = maxParentSum + parseInt(triangle[row][col]);
    }
  }

  // At this point, last row of the triangle contains all max sums that end in that element: just pick the biggest one for the maximum sum in the whole triangle
  var max = triangle[triangle.length-1][0];
  for(var c = 1; c < triangle[triangle.length-1].length; c++) {

    if(triangle[triangle.length - 1][c]>max) {
      
      max = triangle[triangle.length - 1][c];
    }
  }
  console.log(max);
};

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */