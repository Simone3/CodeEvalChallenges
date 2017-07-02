"use strict";

var fs  = require("fs");

var Chall = {};

Chall.main = function(inputFileName) {

	fs.readFileSync(inputFileName).toString().split("\n").forEach(function(line) {

		if(line) {

			var matrix = stringToMatrix(line);

			matrix.sort(compareColumns);

			console.log(matrixToString(matrix));
		}
	});
};

// Comparator for sort
function compareColumns(firstCol, secondCol) {
	
	for(var i = 0; i < firstCol.length; i++) {
		
		if(firstCol[i] !== secondCol[i]) {
			
			return (firstCol[i] < secondCol[i] ? -1 : 1);
		}
	}
	
	return 0;
}

// Builds a [column][row] matrix (transposed of the "usual" representation)
function stringToMatrix(string) {
	
	var transposed = [];

	var matrix = string.split(" | ");
	
	for(var row = 0; row < matrix.length; row++) {
		
		matrix[row] = matrix[row].split(" ");
		
		for(var col = 0; col < matrix[row].length; col++) {
			
			if(!transposed[col]) {
				
				transposed[col] = [];
			}
			
			transposed[col][row] = parseInt(matrix[row][col]);
		}
	}

	return transposed;
}

// Builds the string from a [column][row] matrix (transposed of the "usual" representation)
function matrixToString(matrix) {
	
	var result = "";
	
	for(var row = 0; row < matrix.length; row++) {

		result += matrix[0][row]
		
		for(var col = 1; col < matrix.length; col++) {
			
			result += " " + matrix[col][row];
		}
		
		result += " | ";
	}
	
	return result.slice(0, -3);
}

// Chall.main(process.argv[2]);  /* For CodeEval submit */
module.exports = Chall.main;     /* For command-line runner */