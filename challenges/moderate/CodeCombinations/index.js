"use strict";

var fs  = require("fs");

const WORD = ["c", "d", "e", "o"]; // "code" (sorted)

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var matrix = line.split(" | ");

			var times = 0;

			for(var r = 0; r < matrix.length - 1; r++) {

				for(var c = 0; c < matrix[r].length - 1; c++) {

					var sortedLetters = [matrix[r][c], matrix[r+1][c], matrix[r][c+1], matrix[r+1][c+1]].sort();
					
					if(areSortedArraysEqual(WORD, sortedLetters)) {

						times++;
					}
				}
			}

			console.log(times);
		}
	});
};

function areSortedArraysEqual(first, second) {
	
	for(var i = 0; i < first.length; i++) {
				
		if(first[i] !== second[i]) {
			
			return false;
		}
	}
	
	return true;
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */